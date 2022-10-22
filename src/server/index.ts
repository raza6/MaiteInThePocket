import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import colors from 'colors';
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
serv.listen(PORT, MongoDB.start);

/**
 * API
 */

/**
 * Test endpoint
 *
 * @name Test
 * @route {GET} /test
 */
serv.get('/mp/test', (req: Request, res: Response) => {
  console.log('hello');
  res.status(200).send('hello');
});

/**
 * Get recipe detail
 *
 * @name RecipeGet
 * @route {GET} /mp/recipe/:id
 * @routeparam {string} :id is the unique identifier for the recipe
 * @returns {Recipe} requested recipe
 */
serv.get('/mp/recipe/:id', async (req: Request, res: Response) => {
  const result = await recipeService.getRecipe(req.params.id);
  res.status(result ? 200 : 400).send(result);
});

/**
 * Add image to a recipe
 *
 * @name RecipeAddImg
 * @route {POST} /mp/recipe/img/:id
 */
serv.post('/mp/recipe/img/:id', async (req: Request, res: Response) => {
  let error;
  // check if file is valid
  if (req.files === undefined || req.files.img === undefined) {
    error = 'No img file attached';
  } else if (Array.isArray(req.files.img)) {
    error = 'More than 1 img file attached';
  } else {
    const reqFile = req.files.img;

    if (!['image/jpeg', 'image/png'].includes(reqFile.mimetype)) {
      error = 'Attached file is not a .png or a .jpg';
    } else if (req.files.img.size >= 4 * 1024 * 1024) {
      error = 'Attached file size is more than 4MB';
    } else {
      const recipeId = req.params.id;

      if (!await recipeService.checkRecipe(recipeId)) {
        error = `Recipe ${recipeId} does not exist`;
      } else {
        const fileExt = req.files.img.mimetype === 'image/png' ? 'png' : 'jpg';
        req.files.img.mv(`./static/img/${recipeId}.${fileExt}`);
      }
    }
  }

  // TODO
  // Handle error (too big, wrong width/length)
  // Resize img (jimp)

  res.status(error ? 400 : 200).send(error);
});

/**
 * Add a recipe
 *
 * @name RecipeAdd
 * @route {PUT} /mp/recipe/add
 * @bodyparam {Recipe} recipe is the recipe uploaded
 */
serv.put('/mp/recipe/add', async (req: Request, res: Response) => {
  const result = await recipeService.addRecipe(req.body);
  console.log(result ? '😀 recipe added' : '😔 recipe not added');
  res.status(result ? 200 : 400).send();
});

/**
 * Edit a recipe
 *
 * @name RecipeEdit
 * @route {PUT} /mp/recipe/:id
 * @routeparam {string} :id is the unique identifier for the recipe
 * @bodyparam {Recipe} recipe is the recipe with the edits
 */
serv.put('/mp/recipe/:id', async (req: Request, res: Response) => {
  const result = await recipeService.editRecipe(req.params.id, req.body);
  console.log(result ? '😀 recipe edited' : '😔 recipe not edited');
  res.status(result ? 200 : 400).send();
});

/**
 * Delete a recipe
 *
 * @name RecipeDelete
 * @route {DELETE} /mp/recipe/:id
 * @routeparam {string} :id is the unique identifier for the recipe
 */
serv.delete('/mp/recipe/:id', async (req: Request, res: Response) => {
  const result = await recipeService.deleteRecipe(req.params.id);
  console.log(result ? '😀 recipe deleted' : '😔 recipe not deleted');
  res.status(result ? 200 : 400).send();
});

/**
 * Serve a list of recipe according to a search term and pagination
 *
 * @name RecipeSearch
 * @route {POST} /mp/recipe/search
 * @bodyparam {RecipeRequest} recipeRequest is the request containing the search term and pagination parameters
 * @returns {RecipeSummarySearchResponse} List of recipes summary corresponding to the search request, sorted by pertinence
 */
serv.post('/mp/recipe/search', async (req: Request, res: Response) => {
  const { searchTerm, pageIndex, pageSize } = req.body;
  const result = await recipeService.searchRecipe(searchTerm, pageIndex, pageSize);
  res.status(200).send(result);
});
