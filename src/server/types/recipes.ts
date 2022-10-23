import { EUnit } from './units';

interface RecipeSummary {
    name: string;
    servings: number;
    prepTime: number;
    cookingTime: number;
    comment: number | null;
    hasImg: boolean;
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

interface Recipe {
    slugId: string | undefined;
    summary: RecipeSummary;
    ingredients: Array<IngredientsGroup>;
    steps: Array<string>;
}

interface RecipeSummaryShort {
    slugId: string | undefined;
    summary: RecipeSummary;
}

interface RecipeSummarySearchResponse {
    recipes: Array<RecipeSummaryShort>;
    count: number;
}

interface RecipeRequest {
    searchTerm: string;
    pageSize: number;
    pageIndex: number;
}

export type {
  Recipe, RecipeSummary, RecipeSummaryShort, RecipeRequest, IngredientsGroup, Ingredient, RecipeSummarySearchResponse,
};
