const pool = require( './connection.js' );

// const getProductById = ( req, res ) => {
//   const id = req.params.id;
//   pool.pool.query( `SELECT * FROM overview.products inner join overview.features on products.id = features.product_id WHERE products.id = ${id}`, ( err, results ) => {
//     if ( err ) {
//       res.status( 404 );
//     } else {
//       features = [];
//       for ( let i = 0; i < results.rows.length; i++ ) {
//         var oneFeature = { feature: results.rows[i].feature, value: results.rows[i].value };
//         features.push( oneFeature );
//       }
//       const product = results.rows[ 0 ];
//       const obj = {
//         id: product.product_id,
//         name: product.name,
//         slogan: product.slogan,
//         description: product.description,
//         category: product.category,
//         default_price: product.default_price,
//         features
//       };
//       res.status( 200 ).json( obj );
//     }
//   } )
// };

const getProductById = ( req, res ) => {
  const id = req.params.id;
  pool.pool.query( `SELECT
  p.id, p.name, p.slogan, p.description, p.category, p.default_price,
  json_agg(
    json_build_object(
      'feature', f.feature, 'value', f.value
    )
  ) AS features FROM products p
  LEFT JOIN features f
  ON f.featureId_productId = p.id
  WHERE p.id = ${id}
  GROUP BY p.id;`, ( err, results ) => {
    if ( err ) {
      res.status( 404 );
    } else {
      res.status( 200 ).json( results.rows[ 0 ] );
    }
  } )
};



const getReviewsById = ( req, res ) => {
  const id = req.params.id;
  pool.pool.query('', ( err, results ) => {
    if ( err ) {
      res.status( 404 );
    } else {
      res.status( 200 ).json( results.rows );
    }
  })
}

const getStylesById = ( req, res ) => {
  const id = req.params.id;
  pool.pool.query( `
  with photos as (
    select p.photoId_styleId, json_agg(
      json_build_object(
        'url', p.url,
        'thumbnail_url', p.thumbnail_url
      )
    ) photos from photos p
    group by p.photoId_styleId
  ),
  skus as (
    select
    sk.skuId_styleId,
    json_object_agg(
      sk.skuId, json_build_object(
        'quantity', sk.quantity,
        'size', sk.size
        )
    ) "skus" from skus sk
    group by sk.skuId_styleId
  )
  select s.styleId_productId as product_id, json_agg(
    json_build_object(
      'style_id', s.style_id,
      'name', s.name,
      'original_price', s.original_price,
      'sale_price', s.sale_price,
      'default?', s."default?",
      'photos', photos,
      'skus', skus
    )
  ) results from styles s left join photos
    on s.style_id = photos.photoId_styleId
    left join skus on s.style_id = skus.skuId_styleId
    where s.styleId_productId = ${ id }
    group by s.styleId_productId;`,
    ( err, results ) => {
    if ( err ) {
      res.status( 404 );
    } else {
      res.status( 200 ).json( results.rows[0] );
    }
  } )
};


/*
`
  with photos as (
    select p.photoId_styleId, json_agg(
      json_build_object(
        'url', p.url,
        'thumbnail_url', p.thumbnail_url
    )) photos from photos p group by p.photoId_styleId
  ),
  skuss as (
      select sk.skuId_styleId,
         json_build_object(
      sk.skuId, json_build_object(
        'quantity', sk.quantity,
        'size', sk.size
      )

      )skuss from skus sk group by sk.skuId_styleId, sk.skuId

  )
  select s.styleId_productId as product_id, json_agg(
    json_build_object(
      'style_id', s.style_id,
      'name', s.name,
      'original_price', s.original_price,
      'default?', s."default?",
      'photos', photos,
      'skus', skuss
    )) results from styles s left join photos
    on s.style_id = photos.photoId_styleId left join skuss on s.style_id = skuss.skuId_styleId
    where s.styleId_productId = 1 group by s.styleId_productId;`
*/


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
  getProductById,
  getStylesById,
  getReviewsById,

  }