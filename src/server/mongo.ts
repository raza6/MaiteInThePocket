import {
  Db, MongoClient,
} from 'mongodb';
import { Recipe, RecipeSummary } from './types/recipes';

export default class MongoDB {
  private static db: Db;

  public static start(): void {
    MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
      if (err || client === undefined) {
        console.log('💀 Maite in the Pocket failed to connect to DB');
        throw err;
      }
      MongoDB.db = client.db('MaiteInThePocket');
      const allCollections: Array<string> = [];
      MongoDB.db.listCollections().toArray((dberr, collections) => {
        if (dberr || collections === undefined) {
          console.log(dberr);
        } else {
          collections.forEach((eachCollectionDetails) => {
            allCollections.push(eachCollectionDetails.name);
          });
        }
        console.log('Connected to DB with collections :', allCollections.reduce((acc, c) => (acc !== '' ? `${acc}, ${c}` : c), ''));
        console.log('🍰 Maite in the Pocket successfully launched');
      });
    });
  }

  public static async addRecipe(recipe: Recipe): Promise<void> {
    await MongoDB.db.collection('Recipes').insertOne(recipe);
  }

  public static async getRecipe(recipeId: string): Promise<Recipe> {
    return <Recipe><unknown>(
      await MongoDB.db.collection('Recipes').findOne({ slugId: recipeId }, { projection: { _id: 0 } })
    );
  }

  public static async editRecipe(recipeId: string, recipe: Recipe): Promise<void> {
    await MongoDB.db.collection('Recipes').replaceOne({ slugId: recipeId }, recipe);
  }

  public static async deleteRecipe(recipeId: string): Promise<void> {
    await MongoDB.db.collection('Recipes').deleteOne({ slugId: recipeId });
  }

  public static async searchRecipe(
    term: string,
    pageIndex = 0,
    pageSize = 20,
  ): Promise<Array<RecipeSummary>> {
    const cursor = MongoDB.db.collection('Recipes')
      .find({ $text: { $search: term } }, { projection: { _id: 0, slugId: 1, summary: 1 } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(pageIndex * pageSize)
      .limit(pageSize);
    return <Array<RecipeSummary>><unknown>(
      await cursor.toArray()
    );
  }
}
