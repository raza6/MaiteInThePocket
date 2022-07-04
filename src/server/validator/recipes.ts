import { arrayOf, enumOf, maybe, objectOf, primitives } from "@altostra/type-validations";
import { Ingredient, IngredientsGroup, Recipe, RecipeIngredients, RecipeSummary } from "../types/recipes";
import { EUnit } from "../types/units";

const isRecipeSummary = objectOf<RecipeSummary>({
    name: primitives.string,
    servings: primitives.number,
    prepTime: primitives.number,
    cookingTime: primitives.number,
});

const isIngredient = objectOf<Ingredient>({
    name: primitives.string,
    quantity: primitives.maybeNumber,
    unit: maybe(enumOf<EUnit>(), true),
})

const isIngredientsGroup = objectOf<IngredientsGroup>({
    ingredientsGroupName: primitives.maybeString,
    ingredientsList: arrayOf(isIngredient)
});

const isRecipeIngredient = objectOf<RecipeIngredients>({
    groups: arrayOf(isIngredientsGroup)
});

const isRecipe = objectOf<Recipe>({
    id: primitives.maybeString,
    summary: isRecipeSummary,
    ingredients: isRecipeIngredient, 
    steps: arrayOf(primitives.string),
});

export { isRecipe };