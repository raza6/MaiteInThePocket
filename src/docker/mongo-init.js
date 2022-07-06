db = db.getSiblingDB('MaiteInThePocket');

const collection = db.getCollection('Recipes');

collection.createIndex({
  'summary.name': 'text',
  'ingredients.groups.ingredientsList.name': 'text',
  'steps': 'text',
}, {
  weights: {
    'summary.name': 4,
    'ingredients.groups.ingredientsList.name': 2,
    'steps': 1,
  },
  name: 'textRecipesIndex'
});