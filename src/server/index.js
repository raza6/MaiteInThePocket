const serv = require('express')();
const MongoClient = require('mongodb').MongoClient;
const PORT = 8080;
let db;

serv.listen(PORT, start);

serv.get('/test', (req, res) => {
  console.log('hello');
  res.status(200).send('hello');
});

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
      console.log(`💎 CashMire launched on ${PORT}`);
    });
  });
}

// db.collection('bkStatements').find().toArray(function(err, result) {
//   if (err) {
//     throw err;
//   }
//   console.log(result);
// });