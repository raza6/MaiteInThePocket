import {
  anyOf, arrayOf, enumOf, maybe, objectOf, primitives,
} from '@altostra/type-validations';
import {
  Ingredient, IngredientsGroup, Recipe, RecipeSummary,
} from '../types/recipes';
import {
  ELengthUnit, EMassUnit, ETemperatureUnit, EVolumeUnit,
} from '../types/units';

const isRecipeSummary = objectOf<RecipeSummary>({
  name: primitives.string,
  servings: primitives.number,
  prepTime: primitives.number,
  cookingTime: primitives.number,
  comment: primitives.maybeNumber,
});

const isIngredient = objectOf<Ingredient>({
  name: primitives.string,
  quantity: primitives.maybeNumber,
  optional: primitives.boolean,
  unit: maybe(anyOf(
    enumOf<EVolumeUnit>(...Object.entries(EVolumeUnit).map(([, val]) => val)),
    enumOf<EMassUnit>(...Object.entries(EMassUnit).map(([, val]) => val)),
    enumOf<ELengthUnit>(...Object.entries(ELengthUnit).map(([, val]) => val)),
    enumOf<ETemperatureUnit>(...Object.entries(ETemperatureUnit).map(([, val]) => val)),
  ), true),
});

const isIngredientsGroup = objectOf<IngredientsGroup>({
  ingredientsGroupName: primitives.maybeString,
  ingredientsList: arrayOf(isIngredient),
});

const isRecipeIngredient = arrayOf<IngredientsGroup>(isIngredientsGroup);

const isRecipe = objectOf<Recipe>({
  slugId: primitives.maybeString,
  summary: isRecipeSummary,
  ingredients: isRecipeIngredient,
  steps: arrayOf(primitives.string),
});

export default isRecipe;
