import { ValidationRejection } from '@altostra/type-validations';
import ShortUniqueId from 'short-unique-id';
import MongoDB from './mongo';
import { Recipe, RecipeSummarySearchResponse } from './types/recipes';
import isRecipe from './validator/recipes';

export default class recipeService {
  public static async getRecipe(recipeId: string): Promise<Recipe | null> {
    if (recipeId) {
      try {
        return await MongoDB.getRecipe(recipeId);
      } catch (err: unknown) {
        console.log(`🧨 Recipe not retrieved (Id : ${recipeId}), reason : ${err}`);
        return null;
      }
    } else {
      console.log('🧨 Recipe not retrieved, reason : recipe Id is empty');
    }
    return null;
  }

  public static async addRecipe(recipe: Recipe): Promise<boolean> {
    if (isRecipe(
      recipe,
      (rej: ValidationRejection) => console.log(
        `🧨 Recipe rejected, reason : ${rej.reason} in recipe ${rej.path.reverse().join(' > ')}`,
      ),
    )
    ) {
      const recipeDb = { ...recipe, slugId: new ShortUniqueId()() };
      try {
        await MongoDB.addRecipe(recipeDb);
        return true;
      } catch (err: unknown) {
        return false;
      }
    } else {
      return false;
    }
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
          await MongoDB.editRecipe(recipeId, recipe);
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
        await MongoDB.deleteRecipe(recipeId);
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
      return await MongoDB.searchRecipe(term.trim(), pageIndex, pageSize);
    } catch (err: unknown) {
      return {
        recipes: [],
        count: 0,
      };
    }
  }
}
