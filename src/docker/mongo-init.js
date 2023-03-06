db = db.getSiblingDB('MaiteInThePocket');

db.createCollection('Recipes');
db.createCollection('Sessions');
db.createCollection('Users');

// INDEXES

const users = db.getCollection("Users");
users.createIndex(
  { "lastConnection": 1 }, 
  { expireAfterSeconds: 31536000, name: 'userTTLIndex' }
);

const recipes = db.getCollection('Recipes');
recipes.createIndex(
  { 'summary.name': 1 },
  { name: 'regexSearchIndex' }
);
recipes.createIndex(
  {
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
  }
);