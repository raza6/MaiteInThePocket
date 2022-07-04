import { ValidationRejection } from "@altostra/type-validations";
import ShortUniqueId from "short-unique-id";
import MongoDB from "./mongo";
import { Recipe } from "./types/recipes";
import { isRecipe } from "./validator/recipes";

export default class recipeService {


    // public static async getRecipe(recipeId: ShortUniqueId): Promise<Recipe> {
        
    // }

    public static addRecipe(recipe: Recipe): boolean {
        if (isRecipe(
            recipe, 
            (rej: ValidationRejection) => console.log(`🧨 Recipe rejected, reason : ${rej.reason} in recipe ${rej.path.reduceRight((acc, cur) => `${acc} > ${cur.toString()}`, '').toString().trim()}`))
        ) {
            recipe.id = new ShortUniqueId()();
            try {
                MongoDB.addRecipe(recipe);
            } catch (err: unknown) {
                return false;
            }
            return true;
        } else {
            return false
        }
    }

    // public static async editRecipe(recipeId: ShortUniqueId, recipe: Recipe): Promise<boolean> {
        
    // }

    // public static async deleteRecipe(recipeId: ShortUniqueId): Promise<boolean> {
        
    // }
}
