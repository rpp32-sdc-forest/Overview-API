const combineIds = ( ids ) => {
  let idString = '(';
  ids.forEach( id => {
    idString = idString + id + ',';
  })
  idString = idString.substring(0, idString.length - 1) + ')';
  return idString;
};

module.exports = {
  combineIds
}