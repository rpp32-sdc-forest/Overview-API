const db = require( './connection.js' );

const getProducts = ( req, res ) => {
  const count = req.params.count;
  const id = req.params.id;
  const style = req.params.styles;
  console.log('req query', req.query);
  let queryString;
  console.log('what', req.params)
  if ( !id && !count ) {
    queryString = 'SELECT * FROM products LIMIT 5';
  } else if ( count ) {
    queryString = `SELECT * FROM products LIMIT ${ count }`;
  } else if ( id && !style ) {
    queryString = `SELECT
    p.id, p.name, p.slogan, p.description, p.category, p.default_price,
    json_agg(
      json_build_object(
        'feature', f.feature, 'value', f.value
      )
    ) AS features FROM products p
    LEFT JOIN features f
    ON f.featureId_productId = p.id
    WHERE p.id = ${ id }
    GROUP BY p.id;`
  } else if ( id && style === 'styles') {
    queryString = `with photos as (
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
      group by s.styleId_productId;`
  }
  console.log('querystring', queryString);
  db.pool.query( queryString, ( err, results ) => {
    if ( err ) {
      res.status( 404 );
    } else {
      let data;
      if ( results.rows.length > 1 ) {
        data = results.rows;
      } else {
        data = results.rows[ 0 ];
      }
      res.status( 200 ).json( data );
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

const getStylesById = ( req, res ) => {
  const id = req.params.id;
  db.pool.query( `
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
  })
};



const getCart = ( req, res ) => {
  const id = req.params.id;
  queryString = `SELECT sku_id, count FROM cart where session = ${ id }`;
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
  queryString = `INSERT INTO cart(session, sku_id, count) VALUES (${session}, ${skuId}, ${count})`;
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
  getStylesById,
  getCart,
  postCart,
}