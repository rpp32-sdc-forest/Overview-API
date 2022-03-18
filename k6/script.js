import http from 'k6/http';
import { check, group, sleep } from 'k6';

export default () => {
  const getRandomInt = (min, max) => {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * ( max - min ) + min );
  };
  const randomId = getRandomInt(900000, 1000000);
  // const options = {
  //   vus: 1000,
  //   duration: '30s',
  // };
  const url = `http://localhost:8080/pro/product/${randomId}/styles/`;

  http.get( url );
}

// export default () => {
//   const randomId = Math.floor(Math.random() * 1000011);
//   // const options = {
//   //   vus: 1000,
//   //   duration: '30s'
//   // };
//   // const SLEEP_DURATION = 0.1;

//   group( 'initial page load', () => {
//     let initialUrl = 'http://localhost:8080/products/';
//     const initialVisit = http.get( initialUrl, options );
//     //sleep( SLEEP_DURATION );

//     const productUrl = `http://localhost:8080/product/${randomId}`;
//     const getProduct = http.get( productUrl, options );
//     //sleep( SLEEP_DURATION );
//   });

// }

// module.exports = {
//   productId,
//   productCount,
// }