import {
  FindCursor, MongoClient, MongoError
} from 'mongodb';
import { Recipe, RecipeSummary, RecipeSummaryShort } from './types/recipes';
import { NoCollectionError } from './utilities';

export default class MongoDB {
  private static dbName = 'MaiteInThePocket';
  private static collectionRecipes = 'Recipes';

  private static client: MongoClient;

  private static async run(command: Function): Promise<void|unknown> {
    let res = undefined;
    try {
      await MongoDB.client.connect();
      res = await command();
    } catch(ex) {
      console.log('💀 Maite in the Pocket failed to execute command');
    } finally {
      // Ensures that the client will close when you finish/error
      await MongoDB.client.close();
      return res;
    }
  }

  public static async start(): Promise<void> {
    MongoDB.client = new MongoClient('mongodb://maite:maitepwd@raza6.fr:27017');

    try {
      await MongoDB.client.connect()

      const allCollectionsDetail = await MongoDB.client.db(MongoDB.dbName).listCollections().toArray();
      const allCollections = allCollectionsDetail.map(detail => detail.name);

      if (allCollections.length === 0) {
        throw new NoCollectionError('Recipes missing');
      }

      console.log('Connected to DB with collections :', allCollections.reduce((acc, c) => (acc !== '' ? `${acc}, ${c}` : c), ''));
      console.log('🍰 Maite in the Pocket successfully launched');
    } catch (ex) {
      if (ex instanceof MongoError) {
        console.log('💀 Maite in the Pocket failed to connect to DB');
      } else if (ex instanceof NoCollectionError) {
        console.log('💀 Maite in the Pocket has no collections available');
      } else {
        console.log('💀 Maite in the pocket unknown error while starting');
      }
    } finally {
      await MongoDB.client.close();
    }
  }

  public static async addRecipe(recipe: Recipe): Promise<void> {
    await MongoDB.run(
      () => MongoDB.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).insertOne(recipe)
    );
  }

  public static async getRecipe(recipeId: string): Promise<Recipe> {
    return <Recipe><unknown>await MongoDB.run(
      () => MongoDB.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).findOne({ slugId: recipeId }, { projection: { _id: 0 } })
    );
  }

  public static async editRecipe(recipeId: string, recipe: Recipe): Promise<void> {
    await MongoDB.run(
      () => MongoDB.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).replaceOne({ slugId: recipeId }, recipe)
    );
  }

  public static async deleteRecipe(recipeId: string): Promise<void> {
    await MongoDB.run(
      () => MongoDB.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).deleteOne({ slugId: recipeId })
    );
  }

  public static async searchRecipe(
    term: string,
    pageIndex = 0,
    pageSize = 20,
  ): Promise<Array<RecipeSummaryShort>> {
    const searchParam = term === '' ? {} : { $text: { $search: term } };

    let result = <Array<RecipeSummaryShort>><unknown> await MongoDB.run(
      () => {
        const cursor = <FindCursor><unknown> MongoDB.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes)
          .find(searchParam)
          .project({ _id: 0, slugId: 1, summary: 1, score : { $meta : 'textScore' }})
          .sort({ score: { $meta: 'textScore' } })
          .skip(pageIndex * pageSize)
          .limit(pageSize);

          return cursor.toArray(); 
        }
    );

    return result.map(r => { return { 
      summary: r.summary, 
      slugId: r.slugId 
    }});
  }
}
