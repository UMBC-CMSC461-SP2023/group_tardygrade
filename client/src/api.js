import axios from 'axios';

const API_KEY = '4Y8_IcV2LK_t8P79dwtYwzCRJuw2bQ9h';
const BASE_URL = 'https://api.polygon.io/v3/snapshot/options';

export const fetchOptionsContracts = async (ticker) => {
    let nextUrl = `${BASE_URL}/${ticker}?limit=50&apiKey=${API_KEY}`;
  
    while (nextUrl) {
      try {
        const response = await axios.get(nextUrl);
  
        // Insert or update options contracts data in the PostgreSQL database
        await insertOrUpdateOptionsContracts(response.data.results);
  
        // Get the next URL for fetching more options contracts data
        if (response.data.next_url) {
          nextUrl = `${response.data.next_url}&apiKey=${API_KEY}`;
        } else {
          nextUrl = null; // Break the loop when there are no more options contracts to fetch
        }
      } catch (error) {
        console.error('Error fetching options contracts data:', error);
        break;
      }
    }
  };

const insertOrUpdateOptionsContracts = async (contracts) => {
  for (const contract of contracts) {
    const {
      ticker: contract_ticker,
      contract_type,
      exercise_style,
      expiration_date,
      shares_per_contract,
      strike_price,
    } = contract.details;
    const { ticker: underlying_ticker } = contract.underlying_asset;
    const { delta, gamma, theta, vega } = contract.greeks || {};

    // Insert or update the contract in the PostgreSQL database
    await axios.post('api/insert_or_update_contract', {
      contract_ticker,
      contract_type,
      exercise_style,
      expiration_date,
      shares_per_contract,
      strike_price,
      underlying_ticker,
      break_even_price: contract.break_even_price || null,
      open_interest: contract.open_interest || null,
      greeks_delta: delta || null,
      greeks_gamma: gamma || null,
      greeks_theta: theta || null,
      greeks_vega: vega || null,
      implied_volatility: contract.implied_volatility || null,
    });
  }
};

