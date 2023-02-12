import { EUnit } from './units';

interface RecipeSummary {
  name: string;
  servings: number;
  prepTime: number;
  cookingTime: number;
  comment: string | null;
  hasImg: boolean;
}

interface RecipeSummaryEdit {
  name: string;
  servings: number | null;
  prepTime: number | null;
  cookingTime: number | null;
  comment: string | null;
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

interface Recipe<T> {
  slugId: string | undefined;
  summary: T;
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
  Recipe, RecipeSummary, RecipeSummaryEdit, RecipeSummaryShort, RecipeRequest, IngredientsGroup, Ingredient, RecipeSummarySearchResponse
};
