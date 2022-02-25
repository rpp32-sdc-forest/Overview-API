
const supertest = require( 'supertest' );
const api = require( '../server/api.js' );
const index = require( '../server/index.js' );

it( 'Testing to see if Jest works', () => {
  expect( 1 ).toBe( 1 )
})


describe('given the route is correct', () => {
  const url = 'http://localhost:8080';
  it( 'should return an success code for the products route', async () => {
    const response = await supertest(url).get('/products/199');
    expect(response.statusCode).toBe(200);
  } );

  it( 'should return an success code for the styles route', async () => {
    const response = await supertest(url).get('/styles/199');
    expect(response.statusCode).toBe(200);
  } );

  xit( 'should return an success code for the ratings route', async () => {
    const response = await supertest(url).get('/ratings/199');
    expect(response.statusCode).toBe(200);
  } );

  const resObj = {"category": "Shorts", "default_price": 162, "description": "Maxime non ut dolor ut deleniti corrupti perspiciatis debitis. Ad enim ex impedit exercitationem a. Magni perferendis ab vero cumque. Quia aut impedit maxime sunt et. Beatae iure enim quasi voluptatem placeat voluptatibus voluptatem at. Iusto dolore at et tempore culpa dolores non ex officiis.", "features": [{"feature": "Non-GMO", "value": "null"}], "id": 199, "name": "Bertram 50 Shorts", "slogan": "Unde fugiat perferendis velit quis sed dolor dolorem."};


  it( 'should return the correct data from /products', async () => {
    let response = await supertest(url).get('/products/199');
    expect(response.body).toMatchObject(resObj);
  } );



  it( 'should return the correct data from /styles', async () => {
    let response = await supertest(url).get('/styles/199');
    let parsed = JSON.parse(response.text);
    console.log('parsed', parsed);

    expect(parsed.results[0].name).toBe('Maroon');
  } );


  xit( 'should return an error code if the productid is out of range', async () => {
    const response = await supertest(url).get('/products/45312454844');
    expect(response.statusCode).toBe(404);
  } );

})


describe('given the route is incorrect', () => {
  const url = 'http://localhost:8080';
  it( 'should return an error code for the products route', async () => {
    const response = await supertest(url).get('/productss/199');
    expect(response.statusCode).toBe(404);
  } );


  it( 'should return an error code for the styles route', async () => {
    const response = await supertest(url).get('/styles/id/983');
    expect(response.statusCode).toBe(404);
  } );

  // it('klsjdfg', () => {
  //   req = {};
  //   req.params.id = 43;
  //   const xx = api.getProductById( req );

  // })

})
