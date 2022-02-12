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

const getStylesById = ( req, res ) => {
  const id = req.params.id;
  pool.pool.query( `SELECT * FROM products inner join styles ON products.id = styles.product_id inner join photos on `, ( err, results ) => {
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

const test2 = ( req, res ) => {
  console.log('dfh')
  pool.pool.query( `SELECT s.styleId_productId, JSON_AGG(JSON_BUILD_OBJECT('style_id', s.style_id, 'name', s.name, 'original_price', s.original_price, 'sale_price', s.sale_price, 'default?', s."default?", JSON_AGG(JSON_BUILD_OBJECT('thumbnail_url', p.thumbnail_url, 'url', p.url)) photos from styles s left join photos p on s.style_id = p.photoId_styleId)) as results FROM styles s where s.styleId_productId = 4 GROUP BY s.styleId_productId;`, ( err, results ) => {
    if ( err ) {
      res.status( 404 );
    } else {
      res.status( 200 ).json( results.rows[0] );
    }
  } )
};


/*
SELECT
JSON_BUILD_OBJECT(
  'product_id', styles.styledId_productId,
)


SELECT JSON_AGG(
  JSON_BUILD_OBJECT(
    'style_id', styles.style_id,
    'name', styles.name,
    'original_price', styles.original_price,
    'sale_price', styles.sale_price,
    'default?', styles."default?"
  )
) as results FROM styles
left join (
  select
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'thumbnail_url', photos.thumbnail_url,
        'url', photos.url
      )
    )) as photos FROM photos p on styles.style_id = photos.photoId_styleId where styles.styleId_productId = 4;
*/


/*
with photos as (
  select
    json_agg(
      json_build_object(
        'thumbnail_url', p.thumbnail_url,
        'url', p.url
      )
    ) photos
  from photos p
)
select styles.styleId_productId, json_agg(
  json_build_obj(
    'style_id', s.style_id,
    'name', s.name
  )
) results
from styles s left join photos p on s.style_id = p.photoId_styleId where s.style_id = 3 Group by 1;

*/
BOTTOM UP photos and styles and skus
with skuss as (
  select
  styles.style_id,
  json_build_object(
    skus.skuId, json_build_object(
      'quantity', skus.quantity,
      'size', skus.size
    )) as skus
    from skus group by 1
),
photoss as (
  select
    styles.style_id,
    json_agg(
      json_build_object(
        'thumbnail_url', p.thumbnail_url,
        'url', p.url
      )
    ) as photos
    from photos p group by 1
)
select s.styleId_productId, json_agg(
  json_build_obj(
    'style_id', s.style_id,
    'name', s.name,
    'original_price', s.original_price,
    'sale_price', s.sale_price,
    'default?', s."default?",
    'photos', photoss,
    'skus', skuss
  )
) as results from styles s
left join photos p on s.style_id = p.photoid_styleId
left join skus on s.style_id = skus.skuId_styleId where s.style_id = 4
group by s.styleId_productId;


BOTTOM UP photos and styles only

with photoss as (
  select
    styles.style_id,
    json_agg(
      json_build_object(
        'thumbnail_url', p.thumbnail_url,
        'url', p.url
      )
    ) as photos from photos p
    group by styles.style_id
)
select s.styleId_productId, json_agg(
  json_build_obj(
    'style_id', s.style_id,
    'name', s.name,
    'original_price', s.original_price,
    'sale_price', s.sale_price,
    'default?', s."default?",
    'photos', photoss
  )
) as results from styles s
left join photos p on s.style_id = p.photoid where s.style_id = 4
group by s.styleId_productId;



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



module.exports = {
  getProductById,
  getStylesById,
  getReviewsById,
  test2,

  }