const db = require( './connection.js' );
const helpers = require( './helpers.js' );
const redis = require( 'redis' );
const redisPort = 6379;
const redisClient = redis.createClient(redisPort);
redisClient.connect();

redisClient.on('connect', () => {
  console.log('connected to redis');
});
redisClient.on('error', (err) =>{
  console.log(err);
});



const getProduct = (req, res) => {

  const id = req.params.id;
  const styles = req.params.styles;
  if (id && (!styles || styles === '\n')) {
    queryString = `SELECT
    p.id, p.name, p.slogan, p.description, p.category, p.default_price,
    json_agg(
      json_build_object(
        'feature', f.feature, 'value', f.value
      )) AS features FROM products p
      LEFT JOIN features f
      ON f.featureId_productId = p.id
      WHERE p.id = ${ id }
      GROUP BY p.id;`
    db.pool.connect()
    .then( client => {
      return client.query( queryString )
      .then( data => {
        client.release();
        if ( data.length < 1 ) {
          res.status(200).send('Product does not exist');
        } else {
          res.status(200).json(data.rows[0]);
        }
      })
      .catch( err => {
        res.status(404).json(err);
      })
    })
  } else if (id && (styles === 'styles' || styles === 'styles\n')) {
      let allIds;
      redisClient.get(id)
      .then((data) => {
        if (data) {
          console.log('redis id 1', data);
          res.status( 200 ).send( JSON.parse( data ) );
        } else {
          db.pool.connect()
          .then( client => {
            return client.query(`select * from styles where styleId_productId = ${id}`)
            .then( data => {
              if (data.rows.length > 0) {
                allStyleIds = [];
                data.rows.forEach( item => {
                  allStyleIds.push( item.style_id );
                });
                let combined = helpers.combineIds( allStyleIds );
                allIds = combined;
              } else {
                allIds = '(1, 2)';
              }
            })
            .then( () => {
              client.query(`CREATE OR REPLACE VIEW photo_view AS
              SELECT * FROM photos WHERE styleId IN ${ allIds }`);
            })
            .then( () => {
              client.query(`CREATE OR REPLACE VIEW sku_view AS
              SELECT * FROM skus where styleId IN ${ allIds }`);
            })
            .then( () => {
              let queryString = `WITH photos AS (
                SELECT p.styleId, json_agg(
                  json_build_object(
                    'url', p.url,
                    'thumbnail_url', p.thumbnail_url
                  )
                ) photos FROM photo_view p
                GROUP BY p.styleId
              ),
              skus AS (
                SELECT
                sk.styleId,
                json_object_agg(
                  sk.skuId, json_build_object(
                    'quantity', sk.quantity,
                    'size', sk.size
                    )
                ) "skus" FROM sku_view sk
                GROUP BY sk.styleId
              )
              SELECT s.styleId_productId AS product_id, json_agg(
                json_build_object(
                  'style_id', s.style_id,
                  'name', s.name,
                  'original_price', s.original_price,
                  'sale_price', s.sale_price,
                  'default?', s."default?",
                  'photos', photos,
                  'skus', skus
                )
              ) results FROM styles s LEFT JOIN photos
                ON s.style_id = photos.styleId
                LEFT JOIN skus ON s.style_id = skus.styleId
                WHERE s.styleId_productId = ${ id }
                GROUP BY s.styleId_productId;`
              return client.query( queryString );
            })
            .then( data => {
              client.release();
              if ( data.length < 1 ) {
                let emptyResults = {product_id: id, results: []};
                redisClient.set( id, JSON.stringify( emptyResults ) );
                res.status( 200 ).json( emptyResults );
              } else {
                console.log(data.rows[0]);
                redisClient.set( id, JSON.stringify( data.rows[0]) );
                res.status( 200 ).json( data.rows[0] );
              }
            })
            .catch( (err) => {
              client.release();
              console.log('error yo', err)
              //res.status(404).json(err);
            })
          })
        }
      })
      .catch((err) => {
        console.log('err', err)
      })







  }
}


const getProducts = ( req, res ) => {
  //const count = req.params.count;
  let count = req.query.count;
  if ( Number(count) > 1000 ) {
    count = '1000';
  }
  let queryString;
  if ( !count ) {
    queryString = 'SELECT * FROM products LIMIT 5';
  } else if ( count ) {
    queryString = `SELECT * FROM products LIMIT ${ count }`;
  }
  db.pool.query( queryString, ( err, results ) => {
    if ( err ) {
      res.status( 404 );
    } else {
      res.status( 200 ).json( results.rows );
    }
  })
};

// const getReviewsById = ( req, res ) => {
//   const id = req.params.id;
//   db.pool.query('', ( err, results ) => {
//     if ( err ) {
//       res.status( 404 );
//     } else {
//       res.status( 200 ).json( results.rows );
//     }
//   })
// };

const getCart = ( req, res ) => {
  const id = req.params.id;
  queryString = `SELECT sku_id, count FROM cart where sessionid = ${ id }`;
  db.pool.query( queryString, (err, result) => {
    if ( err ) {
      console.log('error getting from cart', err);
    } else {
      res.status( 200 ).json( results.rows );
    }
  })
}

const postCart = ( req, res ) => {
  const session = req.body.session;
  const skuId = req.body.sku;
  const count = req.body.count;
  queryString = `INSERT INTO cart(sessionid, sku_id, count) VALUES (${session}, ${skuId}, ${count})`;
  db.pool.query( queryString, ( err, results ) => {
    if ( err ) {
      console.log( 'error posting into cart', err );
    } else {
      res.status( 201 ).json( results.rows );
    }
  })
}








/*
//TOP DOWN
select json_build_object('product_id', s.styleId_productId,
  'results', json_agg(
    json_build_object(
      'style_id', s.style_id,
      'name', s.name,
      'original_price', s.original_price,
      'sale_price', s.sale_price,
      'default?', s."default?",
      'photos', photos1
    )
  )
) as results
from styles s left join (
  select
    s.style_id, json_agg(json_build_obj(
    'thumbnail_url', photos.thumbnail_url,
    'url', photos.url
  )) as photos1 from photos p group by s.style_id
  )photos on photos.photoId_styleId = s.style_id
*/






module.exports = {
  getProducts,
  getProduct,
  getCart,
  postCart,
}


