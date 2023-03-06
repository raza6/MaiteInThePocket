import {
  FindCursor, MongoClient, MongoError, Sort,
} from 'mongodb';
import colors from 'colors';
import { Recipe, RecipeSummarySearchResponse, RecipeSummaryShort } from '../types/recipes';
import { NoCollectionError } from '../utils/utils';
import EnvWrap from '../utils/envWrapper';
import { User } from '../types/user';

export default class MongoDB {
  public static dbName = 'MaiteInThePocket';

  private static collectionRecipes = 'Recipes';

  private static collectionUsers = 'Users';

  private static dbConnect;

  static {
    let connectionString = `${EnvWrap.get().value('MONGO_URL')}:${EnvWrap.get().value('MONGO_PORT')}`;
    if (EnvWrap.get().value('MONGO_USER') !== '') {
      connectionString = `${EnvWrap.get().value('MONGO_USER')}:${EnvWrap.get().value('MONGO_PASSWORD')}@${connectionString}`;
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
      console.log(`💀 ${colors.red('Maite in the Pocket failed to execute command')}`);
      return res;
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close();
    }
  }

  public exposeClient(): MongoClient {
    return this.client;
  }

  public async start(): Promise<void> {
    try {
      await this.client.connect();

      const allCollectionsDetail = await this.client.db(MongoDB.dbName).listCollections().toArray();
      const allCollections = allCollectionsDetail.map((detail) => detail.name);

      if (allCollections.length === 0) {
        throw new NoCollectionError('No collection found');
      }

      console.log('Connected to DB with collections :', allCollections.reduce((acc, c) => (acc !== '' ? `${acc}, ${c}` : c), ''));
    } catch (ex) {
      if (ex instanceof MongoError) {
        console.log(`💀 ${colors.red('Maite in the Pocket failed to connect to DB')}`);
      } else if (ex instanceof NoCollectionError) {
        console.log(`💀 ${colors.red('Maite in the Pocket has no collections available')}`);
      } else {
        console.log(`💀 ${colors.red('Maite in the pocket unknown error while starting')}`);
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
    const searchParam = term === '' ? {} : { $or: [{ 'summary.name': { $regex: `${term}`, $options: 'i' } }, { $text: { $search: term } }] };
    const projectParam = term === '' ? { _id: 0, slugId: 1, summary: 1 }
      : {
        _id: 0, slugId: 1, summary: 1, score: { $meta: 'textScore' },
      };
    const sortParam = term === '' ? { 'summary.name': 1 } : { score: { $meta: 'textScore' } };

    const result = <Array<RecipeSummaryShort>><unknown> await this.run(
      () => {
        const cursor = <FindCursor><unknown> this.client.db(MongoDB.dbName).collection(MongoDB.collectionRecipes)
          .find(searchParam)
          .project(projectParam)
          .sort(<Sort><unknown>sortParam)
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

  public async getUser(userId: string): Promise<User> {
    return <User><unknown> await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionUsers).findOne({ id: userId }, { projection: { _id: 0 } }),
    );
  }

  public async checkUser(userId: string, withLastConnectionUpdate: boolean = false): Promise<boolean> {
    const exist = await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionUsers).countDocuments({ id: userId }),
    ) === 1;
    if (exist && withLastConnectionUpdate) {
      await this.run(
        () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionUsers)
          .updateOne({ id: userId }, { $currentDate: { lastConnection: true } }),
      );
    }
    return exist;
  }

  public async addUser(user: User): Promise<void> {
    await this.run(
      () => this.client.db(MongoDB.dbName).collection(MongoDB.collectionUsers).insertOne(user),
    );
  }
}
