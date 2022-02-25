
DROP DATABASE IF EXISTS sdc2;
CREATE DATABASE sdc2 OWNER josef;
\connect sdc2;

CREATE TABLE products(
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR (40) NOT NULL,
  slogan VARCHAR (200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(30) NOT NULL,
  default_price INT NOT NULL
);

COPY products FROM '/Users/joe/Documents/RPP32/senior-phase/Overview-API/db/csvFiles/product.csv' DELIMITER ',' CSV HEADER;
/*need to index*/

CREATE TABLE features(
  featureId SERIAL NOT NULL PRIMARY KEY,
  featureId_productId INT NOT NULL REFERENCES products (id),
  feature VARCHAR (50) NOT NULL,
  value VARCHAR (50)
);

COPY features FROM '/Users/joe/Documents/RPP32/senior-phase/Overview-API/db/csvFiles/features.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE styles(
  style_id SERIAL NOT NULL PRIMARY KEY,
  styleId_productId INT NOT NULL REFERENCES products (id),
  name VARCHAR(75) NOT NULL,
  sale_price VARCHAR (20),
  original_price INT NOT NULL,
  "default?" BOOLEAN
);
COPY styles FROM '/Users/joe/Documents/RPP32/senior-phase/Overview-API/db/csvFiles/styles.csv' DELIMITER ',' CSV HEADER;


CREATE TABLE photos(
  photoId SERIAL NOT NULL PRIMARY KEY,
  photoId_styleId INT NOT NULL REFERENCES styles (style_id),
  url VARCHAR NOT NULL,
  thumbnail_url VARCHAR NOT NULL
);

COPY photos FROM '/Users/joe/Documents/RPP32/senior-phase/Overview-API/db/csvFiles/photos.csv' DELIMITER ',' CSV HEADER;


CREATE TABLE skus(
  skuId SERIAL NOT NULL PRIMARY KEY,
  skuId_styleId INT NOT NULL REFERENCES styles (style_id),
  size VARCHAR (8) NOT NULL,
  quantity SMALLINT NOT NULL
);

CREATE TABLE cart(
  id SERIAL NOT NULL PRIMARY KEY,
  session INT NOT NULL,
  sku_id INT NOT NULL,
  count SMALLINT NOT NULL
);

COPY skus FROM '/Users/joe/Documents/RPP32/senior-phase/Overview-API/db/csvFiles/skus.csv' DELIMITER ',' CSV HEADER;


CREATE INDEX features_index ON features(featureId_productId);
CREATE INDEX styles_index ON styles(styleId_productId);
CREATE INDEX photos_index ON photos(photoId_styleId);
CREATE INDEX skus_index ON skus(skuId_styleId);

/*
psql postgres
\i path to file

set search_path = overview; (to set schema);

indexing example:
CREATE INDEX STYLE_SKUS ON OVERVIEW.SKUS(STYLEID);
*/

