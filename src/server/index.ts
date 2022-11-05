import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import colors from 'colors';
import Jimp from 'jimp';
import express, { Request, Response } from 'express';
import recipeService from './recipeService';
import MongoDB from './mongo';

// Express config
const serv = express();
const PORT = 3005;

serv.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: './tmp/',
}));

serv.use(cors());
serv.use(bodyParser.json());
serv.use(bodyParser.urlencoded({ extended: true }));
serv.use('/mp/static/img', express.static('static/img'));

// Start CashMire server
console.log(`🍰 Maite in the Pocket launching on port ${colors.bold.blue(PORT.toString())}`);
const mongoStart = new MongoDB();
serv.listen(PORT, () => mongoStart.start());

/**
 * API
 */

/**
 * @apiName Test
 * @apiGroup Test
 * @api {GET} /mp/test Test endpoint
 *
 * @apiDescription Will return a 200 with "hello" if the api is up and running
 */
serv.get('/mp/test', (req: Request, res: Response) => {
  console.log('hello');
  res.status(200).send('hello');
});

/**
 * @apiName RecipeGet
 * @apiGroup Recipe
 * @api {GET} /mp/recipe/:id Get recipe detail
 *
 * @apiparam {string} id Unique identifier of the recipe
 *
 * @apiUse RecipeSuccess
 * @apiError (400) {null} RecipeNotFound Recipe with id <code>id</code> was not found
 */
serv.get('/mp/recipe/:id', async (req: Request, res: Response) => {
  const result = await recipeService.getRecipe(req.params.id);
  res.status(result ? 200 : 400).send(result);
});

/**
 * @apiName RecipeAddImg
 * @apiGroup Recipe
 * @api {POST} /mp/recipe/img/:id Add image to a recipe
 *
 * @apiparam {string} id Unique identifier of the recipe
 * @apiBody {File} files.img The cover image of the recipe
 *
 * @apiError (400) {string} NoFileAttached No image file attached with the request
 * @apiError (400) {string} ManyFileAttached More than one image file attached with the request
 * @apiError (400) {string} FileAttachedFormat File attached with the request are not .png or .jpg
 * @apiError (400) {string} FileAttachedSize File attached with the request are more than 4MB in size
 * @apiError (400) {string} NoFileAttached No image file attached with the request
 * @apiError (400) {string} RecipeNotFound Recipe with id <code>id</code> was not found
 * @apiError (400) {string} ImageManipulation Fatal error while manipulating the recipe image
 */
serv.post('/mp/recipe/img/:id', async (req: Request, res: Response) => {
  let error;
  // check if file is valid
  if (req.files === undefined || req.files === null || req.files.img === undefined) {
    error = 'No img file attached';
  } else if (Array.isArray(req.files.img)) {
    error = 'More than 1 img file attached';
  } else {
    const reqFile = req.files.img;

    if (!['image/jpeg', 'image/png'].includes(reqFile.mimetype)) {
      error = 'Attached file is not a .png or a .jpg';
    } else if (reqFile.size >= 4 * 1024 * 1024) {
      error = 'Attached file size is more than 4MB';
    } else {
      const recipeId = req.params.id;

      if (!await recipeService.checkRecipe(recipeId)) {
        error = `Recipe ${recipeId} does not exist`;
      } else {
        Jimp.read(reqFile.tempFilePath)
          .then(async (image) => {
            await image
              .cover(600, 400)
              .writeAsync(`./static/img/${recipeId}.jpg`);
            await recipeService.setRecipeImg(recipeId, true);
          })
          .catch((err) => {
            error = `Error while manipulating image : ${err}`;
          });
      }
    }
  }

  res.status(error ? 400 : 200).send(error);
});

/**
 * @apiName RecipeAdd
 * @apiGroup Recipe
 * @api {PUT} /mp/recipe/add Add a recipe
 *
 * @apiBody {Recipe} recipe The recipe to add
 */
serv.put('/mp/recipe/add', async (req: Request, res: Response) => {
  const result = await recipeService.addRecipe(req.body);
  console.log(result !== null ? '😀 recipe added' : '😔 recipe not added');
  res.status(result !== null ? 200 : 400).send(result);
});

/**
 * @apiName RecipeEdit
 * @apiGroup Recipe
 * @api {PUT} /mp/recipe/:id Edit a recipe
 *
 * @apiParam {string} id Unique identifier of the recipe
 * @apiBody {Recipe} recipe The edited recipe
 */
serv.put('/mp/recipe/:id', async (req: Request, res: Response) => {
  const result = await recipeService.editRecipe(req.params.id, req.body);
  console.log(result ? '😀 recipe edited' : '😔 recipe not edited');
  res.status(result ? 200 : 400).send();
});

/**
 * @apiName RecipeDelete
 * @apiGroup Recipe
 * @api {DELETE} /mp/recipe/:id Delete a recipe
 *
 * @apiParam {string} id Unique identifier of the recipe
 */
serv.delete('/mp/recipe/:id', async (req: Request, res: Response) => {
  const result = await recipeService.deleteRecipe(req.params.id);
  console.log(result ? '😀 recipe deleted' : '😔 recipe not deleted');
  res.status(result ? 200 : 400).send();
});

/**
 * @apiName RecipeSearch
 * @apiGroup Recipe
 * @api {POST} /mp/recipe/search Search for recipes
 * @apiDescription Serve a list of recipe according to a search term and pagination
 *
 * @apiBody {RecipeRequest} recipeRequest The request containing the search term and pagination parameters
 * @apiUse RecipeSearchSuccess
 */
serv.post('/mp/recipe/search', async (req: Request, res: Response) => {
  const { searchTerm, pageIndex, pageSize } = req.body;
  const result = await recipeService.searchRecipe(searchTerm, pageIndex, pageSize);
  res.status(200).send(result);
});

/* API DEFINITION */

/**
 * @apiDefine RecipeSuccess
 * @apiSuccess {string} slugId The short unique identifier of a recipe
 * @apiSuccess {RecipeSummary} summary The summary of a recipe (title, servings...)
 * @apiSuccess {IngredientsGroup[]} ingredients List of ingredients of a recipe for the default serving
 * @apiSuccess {string[]} steps List of intructions to cook the recipe
 */

/**
 * @apiDefine RecipeSearchSuccess
 * @apiSuccess {RecipeSummaryShort[]} recipes List of recipes summary corresponding to the search request, sorted by pertinence
 * @apiSuccess {number} count Total number of recipes matching the search request
 */
