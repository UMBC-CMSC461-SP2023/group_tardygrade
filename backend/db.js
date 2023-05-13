const { Pool } = require('pg');

const pool = new Pool ({
    host: 'localhost',
    port: 5432,
    database: 'optionsdb',
    user: 'joshuaf1',
    password: 'yumyumsauced132'
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
};