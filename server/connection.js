require( 'dotenv' ).config();
const { Pool } = require( 'pg' );

const pool = new Pool( {
  host: 'localhost',
  database: 'sdc2',
  //user: process.env.psqlUser,
  //password: process.env.postgresKey,
  port: 5432
} );

module.exports = {
  pool
}

