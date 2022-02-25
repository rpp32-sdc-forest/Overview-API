const client = require( './connection.js' );
const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
app.use( bodyParser.json() );
app.use( express.json() );
const api = require( './api.js' );
const port = 8080;


//app.get( '/products/count?', api.getProducts );

app.get( '/products', api.getProducts );

app.get( '/styles/:id', api.getStylesById );

//app.get( '/reviews/:id', api.getReviewsById );

app.get( '/cart/:id', api.getCart );

app.post( '/cart', api.postCart );


app.listen( port, () => {
  console.log(`Server is now listening at port ${port}`);
})

module.exports = {
};

