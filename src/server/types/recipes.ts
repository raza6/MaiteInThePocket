import { EUnit } from './units';

interface RecipeSummary {
    name: string;
    servings: number;
    prepTime: number;
    cookingTime: number;
    comment: number | null;
}

interface Ingredient {
    name: string;
    quantity: number | null;
    unit: EUnit | null;
    optional: boolean;
}

interface IngredientsGroup {
    ingredientsGroupName: string | null;
    ingredientsList: Array<Ingredient>;
}

interface RecipeIngredients {
    groups: Array<IngredientsGroup>;
}

interface Recipe {
    slugId: string | undefined;
    summary: RecipeSummary;
    ingredients: RecipeIngredients;
    steps: Array<string>;
}

interface RecipeSummaryShort {
    slugId: string | undefined;
    summary: RecipeSummary;
}

interface RecipeRequest {
    searchTerm: string;
    pageSize: number;
    pageIndex: number;
}

export {
  Recipe, RecipeSummary, RecipeSummaryShort, RecipeIngredients, RecipeRequest, IngredientsGroup, Ingredient,
};
