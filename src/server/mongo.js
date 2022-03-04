const MongoClient = require('mongodb').MongoClient;

let db;

function start() {
  MongoClient.connect('mongodb://127.0.0.1:27017', function(err, client) {
    if (err) {
      throw err;
    }
    db = client.db('CashMire');
    let allCollections = [];
    db.listCollections().toArray(function(err, collections) {
      if(err) console.log(err);
      collections.forEach(eachCollectionDetails => {
          allCollections.push(eachCollectionDetails.name);
      });
      console.log('Connected to db with collections :', allCollections.reduce((acc, c) => acc !== '' ? `${acc}, ${c}` : c, ''));
      console.log(`💎 CashMire successfully launched`);
    });
  });
}

function addStatement(statement) {
  db.collection('bkStatements').insertOne(statement);
}

// db.collection('bkStatements').find().toArray(function(err, result) {
//   if (err) {
//     throw err;
//   }
//   console.log(result);
// });

module.exports = { start, addStatement };