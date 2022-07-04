import { ValidationRejection } from "@altostra/type-validations";
import ShortUniqueId from "short-unique-id";
import MongoDB from "./mongo";
import { Recipe } from "./types/recipes";
import { EMassUnit, EUnit } from "./types/units";
import { isRecipe } from "./validator/recipes";

export default class recipeService {

    public static async getRecipe(recipeId: string): Promise<Recipe | null> {
        if (recipeId) {
            try {
                let recipe = await MongoDB.getRecipe(recipeId);
                // @ts-ignore
                delete recipe['_id'];
                return recipe;
            } catch (err: unknown) {
                console.log(`🧨 Recipe not retrieved (Id : ${recipeId}), reason : ${err}`);
                return null;
            }
        } else{
            console.log(`🧨 Recipe not retrieved, reason : recipe Id is empty`);
        }
        return null;
    }

    public static async addRecipe(recipe: Recipe): Promise<boolean> {
        if (isRecipe(
            recipe, 
            (rej: ValidationRejection) => console.log(`🧨 Recipe rejected, reason : ${rej.reason} in recipe ${rej.path.reduceRight((acc, cur) => `${acc} > ${cur.toString()}`, '').toString().trim()}`))
        ) {
            recipe.slugId = new ShortUniqueId()();
            try {
                await MongoDB.addRecipe(recipe);
                return true;
            } catch (err: unknown) {
                return false;
            }
        } else {
            return false
        }
    }

    public static async editRecipe(recipeId: string, recipe: Recipe): Promise<boolean> {
        if (recipeId && recipe.slugId === recipeId) {
            if (isRecipe(
                recipe,
                (rej: ValidationRejection) => console.log(`🧨 Recipe rejected, reason : ${rej.reason} in recipe ${rej.path.reduceRight((acc, cur) => `${acc} > ${cur.toString()}`, '').toString().trim()}`))
            ) {
                try {
                    await MongoDB.editRecipe(recipeId, recipe);
                    return true;
                } catch (err: unknown) {
                    console.log(`🧨 Recipe not edited (Id : ${recipeId}), reason : ${err}`);
                    return false;
                }
            }
        } else{
            console.log(`🧨 Recipe not edited, reason : recipe Id is empty`);
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
        } else{
            console.log(`🧨 Recipe not deleted, reason : recipe Id is empty`);
        }
        return false;
    }
}
