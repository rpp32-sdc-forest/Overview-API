require( 'dotenv' ).config();
const Pool = require( 'pg' ).Pool;

const pool = new Pool( {
  host: 'localhost',
  user: 'joe',
  database: 'sdc2',
  port: 5432,
  connectionTimeoutMillis: 2000,
} );

module.exports = {
  pool
}


