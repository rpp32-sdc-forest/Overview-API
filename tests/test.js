
const supertest = require( 'supertest' );


it( 'Testing to see if Jest works', () => {
  expect( 1 ).toBe( 1 )
})


describe('given the route is correct', () => {
  const url = 'http://localhost:3335';
  it( 'should return an success code', async () => {
    const response = await supertest(url).get('/products/199');
    expect(response.statusCode).toBe(200);
  } );

  const resObj = [{"category": "Shorts", "default_price": 162, "description": "Maxime non ut dolor ut deleniti corrupti perspiciatis debitis. Ad enim ex impedit exercitationem a. Magni perferendis ab vero cumque. Quia aut impedit maxime sunt et. Beatae iure enim quasi voluptatem placeat voluptatibus voluptatem at. Iusto dolore at et tempore culpa dolores non ex officiis.", "feature": "Non-GMO", "id": 444, "name": "Bertram 50 Shorts", "product_id": 199, "slogan": "Unde fugiat perferendis velit quis sed dolor dolorem.", "value": "null"}];


  it( 'should return the correct data', async () => {
    const response = await supertest(url).get('/products/199');
    expect(response.body).toMatchObject(resObj);
  } );



})
