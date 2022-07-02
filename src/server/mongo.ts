import { Db, MongoClient } from "mongodb";

let db: Db;

function start() {
  MongoClient.connect('mongodb://127.0.0.1:27017', function(err, client) {
    if (err || client === undefined) {
      console.log(`💀 Maite in the Pocket failed to connect to DB`);
      throw err;
    }
    db = client.db('MaiteInThePocket');
    let allCollections: Array<string> = [];
    db.listCollections().toArray(function(err, collections) {
      if(err || collections === undefined) {
        console.log(err); 
      } else {
        collections.forEach(eachCollectionDetails => {
            allCollections.push(eachCollectionDetails.name);
        });
      }
      console.log('Connected to DB with collections :', allCollections.reduce((acc, c) => acc !== '' ? `${acc}, ${c}` : c, ''));
      console.log(`🍰 Maite in the Pocket successfully launched`);
    });
  });
}

function addRecipe(recipe: any) {
  db.collection('mpRecipes').insertOne(recipe);
}

// db.collection('bkStatements').find().toArray(function(err, result) {
//   if (err) {
//     throw err;
//   }
//   console.log(result);
// });

export = { start, addRecipe };