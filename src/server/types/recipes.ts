import ShortUniqueId from 'short-unique-id';
import { EUnit } from './units';

interface Recipe {
    id: ShortUniqueId;
    summary: RecipeSummary;
    ingredients: RecipeIngredients;
    steps: Array<string>;
}

interface RecipeSummary {
    name: string;
    servings: number;
    prepTime: number;
    cookingTime: number;
}

interface RecipeIngredients {
    groups: Array<IngredientsGroup>;
}

interface IngredientsGroup {
    ingredientsGroupName: string | null;
    ingredientsList: Array<Ingredient>; 
}

interface Ingredient {
    name: string;
    quantity: number | null;
    unit: EUnit | null;
}

interface RecipeRequest {
    searchTerm: string;
    pageSize: number;
    pageIndex: number;
}

export { Recipe, RecipeSummary, RecipeIngredients, RecipeRequest };
