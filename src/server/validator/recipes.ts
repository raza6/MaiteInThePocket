import { anyOf, arrayOf, enumOf, maybe, objectOf, primitives } from "@altostra/type-validations";
import { Ingredient, IngredientsGroup, Recipe, RecipeIngredients, RecipeSummary } from "../types/recipes";
import { ELengthUnit, EMassUnit, ETemperatureUnit, EUnit, EVolumeUnit } from "../types/units";

const isRecipeSummary = objectOf<RecipeSummary>({
    name: primitives.string,
    servings: primitives.number,
    prepTime: primitives.number,
    cookingTime: primitives.number,
});

const isIngredient = objectOf<Ingredient>({
    name: primitives.string,
    quantity: primitives.maybeNumber,
    unit: maybe(
        anyOf(
            enumOf<EVolumeUnit>(...Object.entries(EVolumeUnit).map(([_, val]) => val)),
            enumOf<EMassUnit>(...Object.entries(EMassUnit).map(([_, val]) => val)),
            enumOf<ELengthUnit>(...Object.entries(ELengthUnit).map(([_, val]) => val)),
            enumOf<ETemperatureUnit>(...Object.entries(ETemperatureUnit).map(([_, val]) => val)),
        ), true),
})

const isIngredientsGroup = objectOf<IngredientsGroup>({
    ingredientsGroupName: primitives.maybeString,
    ingredientsList: arrayOf(isIngredient)
});

const isRecipeIngredient = objectOf<RecipeIngredients>({
    groups: arrayOf(isIngredientsGroup)
});

const isRecipe = objectOf<Recipe>({
    slugId: primitives.maybeString,
    summary: isRecipeSummary,
    ingredients: isRecipeIngredient, 
    steps: arrayOf(primitives.string),
});

export { isRecipe };