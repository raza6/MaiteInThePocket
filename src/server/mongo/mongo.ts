import {
  FindCursor, MongoClient, MongoError,
} from 'mongodb';
import dotenv from 'dotenv';
import { Recipe, RecipeSummarySearchResponse, RecipeSummaryShort } from '../types/recipes';
import { NoCollectionError } from '../utils/utils';

export default class MongoDB {
  private static dbName = 'MaiteInThePocket';

  private static collectionRecipes = 'Recipes';

  private static dbConnect;

  static {
    dotenv.config();
    let connectionString = `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}:${process.env.MONGO_PORT}`;
    if (process.env.MONGO_USER === '') {
      connectionString = `${process.env.MONGO_URL}:${process.env.MONGO_PORT}`;
    }
    this.dbConnect = `mongodb://${connectionString}`;
  }

  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(MongoDB.dbConnect);
  }

  private async run(command: Function): Promise<void|unknown> {
    let res;
    try {
      await this.client.connect();
      res = await command();
      return res;
    } catch (ex) {
      console.log('💀 Maite in the Pocket failed to execute command');
      return res;
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close();
    }
  }

  public async start(): Promise<void> {
    try {
      await this.client.connect();

      const allCollectionsDetail = await this.client.db(MongoDB.dbName).listCollections().toArray();
      const allCollections = allCollectionsDetail.map((detail) => detail.name);

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
      await this.client.close();
    }
  }

  public async checkRecipe(recipeId: string): Promise<boolean> {
    return await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).countDocuments({ slugId: recipeId }),
    ) === 1;
  }

  public async addRecipe(recipe: Recipe): Promise<void> {
    await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).insertOne(recipe),
    );
  }

  public async getRecipe(recipeId: string): Promise<Recipe> {
    return <Recipe><unknown> await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).findOne({ slugId: recipeId }, { projection: { _id: 0 } }),
    );
  }

  public async setRecipeImg(recipeId: string, hasImg: boolean): Promise<void> {
    await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).updateOne(
        { slugId: recipeId },
        { $set: { 'summary.hasImg': hasImg } },
      ),
    );
  }

  public async editRecipe(recipeId: string, recipe: Recipe): Promise<void> {
    await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).replaceOne({ slugId: recipeId }, recipe),
    );
  }

  public async deleteRecipe(recipeId: string): Promise<void> {
    await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).deleteOne({ slugId: recipeId }),
    );
  }

  public async searchRecipe(
    term: string,
    pageIndex = 0,
    pageSize = 20,
  ): Promise<RecipeSummarySearchResponse> {
    const searchParam = term === '' ? {} : { $text: { $search: term } };

    const result = <Array<RecipeSummaryShort>><unknown> await this.run(
      () => {
        const cursor = <FindCursor><unknown> this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes)
          .find(searchParam)
          .project({
            _id: 0, slugId: 1, summary: 1, score: { $meta: 'textScore' },
          })
          .sort(term !== '' ? { score: { $meta: 'textScore' } } : { 'summary.name': 1 })
          .skip(pageIndex * pageSize)
          .limit(pageSize);

        return cursor.toArray();
      },
    );

    const countResult = <number><unknown> await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes).countDocuments(searchParam),
    );

    return {
      recipes: result.map((r) => ({
        summary: r.summary,
        slugId: r.slugId,
      })),
      count: countResult,
    };
  }
}