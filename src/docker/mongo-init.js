db = db.getSiblingDB('MaiteInThePocket');

db.createCollection('Recipes');
db.createCollection('Sessions');
db.createCollection('Users');

const collection = db.getCollection('Recipes');

collection.createIndex({
  'summary.name': 'text',
  'ingredients.ingredientsList.name': 'text',
  'steps': 'text',
}, {
  weights: {
    'summary.name': 4,
    'ingredients.ingredientsList.name': 2,
    'steps': 1,
  },
  name: 'textRecipesIndex'
});