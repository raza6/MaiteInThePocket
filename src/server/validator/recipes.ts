import {
  anyOf, arrayOf, enumOf, maybe, objectOf, primitives,
} from '@altostra/type-validations';
import {
  Ingredient, IngredientsGroup, Recipe, RecipeSummary,
} from '../types/recipes';
import {
  ELengthUnit, EMassUnit, ETemperatureUnit, EVolumeUnit,
} from '../types/units';

const maybeNullString = maybe(primitives.string, true);
const maybeNullNumber = maybe(primitives.number, true);

const isRecipeSummary = objectOf<RecipeSummary>({
  name: primitives.string,
  servings: primitives.number,
  prepTime: primitives.number,
  cookingTime: primitives.number,
  comment: maybeNullString,
  hasImg: primitives.boolean,
});

const isIngredient = objectOf<Ingredient>({
  name: primitives.string,
  quantity: maybeNullNumber,
  optional: primitives.boolean,
  unit: maybe(anyOf(
    enumOf<EVolumeUnit>(...Object.entries(EVolumeUnit).map(([, val]) => val)),
    enumOf<EMassUnit>(...Object.entries(EMassUnit).map(([, val]) => val)),
    enumOf<ELengthUnit>(...Object.entries(ELengthUnit).map(([, val]) => val)),
    enumOf<ETemperatureUnit>(...Object.entries(ETemperatureUnit).map(([, val]) => val)),
  ), true),
});

const isIngredientsGroup = objectOf<IngredientsGroup>({
  ingredientsGroupName: maybeNullString,
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
