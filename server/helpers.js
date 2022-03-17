const combineIds = ( ids ) => {
  //i: [1, 2, 3]
  //o: (1, 2, 3)
  // ids.forEach( id => {
    //   idString = idString + id + ',';
    // })
    // idString = idString.substring(0, idString.length - 1) + ')';

  let idString = '(';
  for (let i = 0; i < ids.length; i++) {
    if (i === ids.length - 1) {
      idString = idString + ids[i] + ')';
    } else {
      idString = idString + ids[i] + ',';
    }
  }

  return idString;
};

module.exports = {
  combineIds
}