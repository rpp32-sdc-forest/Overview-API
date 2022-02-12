const client = require( './connection.js' );
const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );
app.use( bodyParser.json() );
app.use( express.json() );
const api = require( './api.js' );
const port = 3335;


app.get( '/products/:id', api.getProductById );

app.get( '/styles/:id', api.getStylesById );

app.get( '/reviews/:id', api.getReviewsById );

app.get( '/test2', api.test2 );





app.listen( port, () => {
  console.log(`Server is now listening at port ${port}`);
})

module.exports = {
  app
};

