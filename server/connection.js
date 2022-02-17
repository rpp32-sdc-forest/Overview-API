require( 'dotenv' ).config();
const Pool = require( 'pg' ).Pool;

const pool = new Pool( {
  host: 'localhost',
  user: 'joe',
  database: 'sdc2',
  port: 5432,
} );

module.exports = {
  pool
}


