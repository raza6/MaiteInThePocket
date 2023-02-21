import { ValidationRejection } from '@altostra/type-validations';
import ShortUniqueId from 'short-unique-id';
import MongoDB from '../mongo/mongo';
import { Recipe, RecipeSummarySearchResponse } from '../types/recipes';
import isRecipe from '../validator/recipes';

export default class recipeService {
  public static async checkRecipe(recipeId: string): Promise<boolean> {
    if (recipeId) {
      try {
        const mongo = new MongoDB();
        return await mongo.checkRecipe(recipeId);
      } catch (err: unknown) {
        console.log(`🧨 Could not verify recipe (Id : ${recipeId}), reason : ${err}`);
        return false;
      }
    } else {
      console.log('🧨 Recipe not verified, reason : recipe Id is empty');
    }
    return false;
  }

  public static async getRecipe(recipeId: string): Promise<Recipe | null> {
    if (recipeId) {
      try {
        const mongo = new MongoDB();
        return await mongo.getRecipe(recipeId);
      } catch (err: unknown) {
        console.log(`🧨 Recipe not retrieved (Id : ${recipeId}), reason : ${err}`);
        return null;
      }
    } else {
      console.log('🧨 Recipe not retrieved, reason : recipe Id is empty');
    }
    return null;
  }

  public static async addRecipe(recipe: Recipe): Promise<string|null> {
    if (isRecipe(
      recipe,
      (rej: ValidationRejection) => console.log(
        `🧨 Recipe rejected, reason : ${rej.reason} in recipe ${rej.path.reverse().join(' > ')}`,
      ),
    )
    ) {
      const slugId = new ShortUniqueId()();
      const recipeDb = { ...recipe, slugId };
      try {
        const mongo = new MongoDB();
        await mongo.addRecipe(recipeDb);
        return slugId;
      } catch (err: unknown) {
        return null;
      }
    } else {
      return null;
    }
  }

  public static async setRecipeImg(recipeId: string, hasImg: boolean): Promise<boolean> {
    if (recipeId) {
      try {
        const mongo = new MongoDB();
        await mongo.setRecipeImg(recipeId, hasImg);
        return true;
      } catch (err: unknown) {
        console.log(`🧨 Recipe not edited (Id : ${recipeId}), reason : ${err}`);
        return false;
      }
    } else {
      console.log('🧨 Recipe not edited, reason : recipe Id is empty');
    }
    return false;
  }

  public static async editRecipe(recipeId: string, recipe: Recipe): Promise<boolean> {
    if (recipeId && recipe.slugId === recipeId) {
      if (isRecipe(
        recipe,
        (rej: ValidationRejection) => console.log(
          `🧨 Recipe rejected, reason : ${rej.reason} in recipe ${rej.path.reverse().join(' > ')}`,
        ),
      )
      ) {
        try {
          const mongo = new MongoDB();
          await mongo.editRecipe(recipeId, recipe);
          return true;
        } catch (err: unknown) {
          console.log(`🧨 Recipe not edited (Id : ${recipeId}), reason : ${err}`);
          return false;
        }
      }
    } else {
      console.log('🧨 Recipe not edited, reason : recipe Id is empty');
    }
    return false;
  }

  public static async deleteRecipe(recipeId: string): Promise<boolean> {
    if (recipeId) {
      try {
        const mongo = new MongoDB();
        await mongo.deleteRecipe(recipeId);
        return true;
      } catch (err: unknown) {
        console.log(`🧨 Recipe not deleted (Id : ${recipeId}), reason : ${err}`);
        return false;
      }
    } else {
      console.log('🧨 Recipe not deleted, reason : recipe Id is empty');
    }
    return false;
  }

  public static async searchRecipe(
    term: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<RecipeSummarySearchResponse> {
    try {
      const mongo = new MongoDB();
      return await mongo.searchRecipe(term.trim(), pageIndex, pageSize);
    } catch (err: unknown) {
      return {
        recipes: [],
        count: 0,
      };
    }
  }
}
