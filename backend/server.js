const express = require('express');
const db = require('./db');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const userExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rowCount > 0) {
            return res.status(401).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        const user = await db.query('INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully', user: user.rows[0] });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred during registration' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username exists
        const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rowCount === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Login success, create session or JWT
        res.status(200).json({ message: 'Login successful', user: { id: user.rows[0].id, username: user.rows[0].username } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred during login' });
    }
});

app.post('/api/insert_or_update_contract', async (req, res) => {
    const {
      contract_ticker,
      contract_type,
      exercise_style,
      expiration_date,
      shares_per_contract,
      strike_price,
      underlying_ticker,
      break_even_price,
      open_interest,
      greeks_delta,
      greeks_gamma,
      greeks_theta,
      greeks_vega,
      implied_volatility,
    } = req.body;
  
    try {
      // Insert or update the contract in the PostgreSQL database
      await db.query(
        `INSERT INTO options_contracts (
          contract_ticker, contract_type, exercise_style, expiration_date,
          shares_per_contract, strike_price, underlying_ticker, break_even_price,
          open_interest, greeks_delta, greeks_gamma, greeks_theta, greeks_vega,
          implied_volatility)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (contract_ticker)
      DO UPDATE SET
        contract_type = EXCLUDED.contract_type,
        exercise_style = EXCLUDED.exercise_style,
        expiration_date = EXCLUDED.expiration_date,
        shares_per_contract = EXCLUDED.shares_per_contract,
        strike_price = EXCLUDED.strike_price,
        underlying_ticker = EXCLUDED.underlying_ticker,
        break_even_price = COALESCE(EXCLUDED.break_even_price, options_contracts.break_even_price),
        open_interest = COALESCE(EXCLUDED.open_interest, options_contracts.open_interest),
        greeks_delta = COALESCE(EXCLUDED.greeks_delta, options_contracts.greeks_delta),
        greeks_gamma = COALESCE(EXCLUDED.greeks_gamma, options_contracts.greeks_gamma),
        greeks_theta = COALESCE(EXCLUDED.greeks_theta, options_contracts.greeks_theta),
        greeks_vega = COALESCE(EXCLUDED.greeks_vega, options_contracts.greeks_vega),
        implied_volatility = COALESCE(EXCLUDED.implied_volatility, options_contracts.implied_volatility)`,
      [
        contract_ticker,
        contract_type,
        exercise_style,
        expiration_date,
        shares_per_contract,
        strike_price,
        underlying_ticker,
        break_even_price,
        open_interest,
        greeks_delta,
        greeks_gamma,
        greeks_theta,
        greeks_vega,
        implied_volatility,
      ]
    );

    res.status(200).send({ message: 'Contract inserted or updated successfully' });
  } catch (error) {
    console.error('Error inserting or updating contract:', error);
    res.status(500).send({ error: 'Error inserting or updating contract' });
  }
});

app.get('/api/get_contracts/:ticker', async (req, res) => {
    try {
      const { ticker } = req.params;
      const response = await db.query(
        `SELECT * FROM options_contracts WHERE underlying_ticker = $1`,
        [ticker]
      );
      res.status(200).send(response.rows);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      res.status(500).send({ error: 'Error fetching contracts' });
    }
});

// Save an option contract for a user
app.post('/api/save_contract', async (req, res) => {
    const { userId, contractId } = req.body;
  
    try {
      // Insert into user_saved_contracts
      await db.query(
        'INSERT INTO user_saved_contracts (user_id, contract_id) VALUES ($1, $2)',
        [userId, contractId]
      );
  
      res.status(200).json({ message: 'Contract saved successfully.' });
    } catch (error) {
      console.error('Error saving contract:', error.message);
      res.status(500).json({ error: 'Error saving contract.' });
    }
  });
  


// List saved option contracts for a user
app.get('/api/saved_contracts/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const response = await db.query(
        `SELECT oc.*
         FROM user_saved_contracts usc
         JOIN users u ON usc.user_id = u.id
         JOIN options_contracts oc ON usc.contract_id = oc.id
         WHERE u.id = $1`,
        [userId]
      );
  
      const rows = response.rows;
      
      if (rows.length === 0) {
        res.status(200).json([]);
      } else {
        console.log('Fetched saved contracts:', rows);
        res.status(200).json(rows);
      }
    } catch (error) {
      console.error('Error fetching saved contracts:', error);
      res.status(500).json({ error: 'Error fetching saved contracts.' });
    }
  });
  

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});