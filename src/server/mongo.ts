import { Db, MongoClient, WriteConcern, WriteError } from "mongodb";
import { Recipe } from "./types/recipes";

export default class MongoDB {
  private static db: Db;
  
  public static start(): void {
    MongoClient.connect('mongodb://127.0.0.1:27017', function(err, client) {
      if (err || client === undefined) {
        console.log(`💀 Maite in the Pocket failed to connect to DB`);
        throw err;
      }
      MongoDB.db = client.db('MaiteInThePocket');
      let allCollections: Array<string> = [];
      MongoDB.db.listCollections().toArray(function(err, collections) {
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
  
  public static async addRecipe(recipe: Recipe): Promise<void> {
    await MongoDB.db.collection('Recipes').insertOne(recipe);
  }

  public static async getRecipe(recipeId: string): Promise<Recipe> {
    return <Recipe><unknown>(
      await MongoDB.db.collection('Recipes').findOne({ slugId: recipeId })
    );
  }
  
  // db.collection('bkStatements').find().toArray(function(err, result) {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(result);
  // });

}
