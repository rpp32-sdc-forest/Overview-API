const newrelic = require( 'newrelic' );
//const client = require( './connection.js' );
const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
app.use( bodyParser.json() );
app.use( express.json() );
const api = require( './api.js' );
const port = 8080;



app.get( '/pro/products/:count?', api.getProducts );

app.get( '/pro/product/:id/:styles?', api.getProduct );

//app.get( '/reviews/:id', api.getReviewsById );

app.get( '/cart/:id', api.getCart );

app.post( '/cart', api.postCart );


app.listen( port, () => {
  console.log(`Server is now listening at port ${port}`);
})

module.exports = {
};

