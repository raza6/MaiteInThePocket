import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import colors from 'colors';
import utils from './utilities';
import mongo from './mongo';
import express, { Request, Response } from 'express';

// Express config
const serv = express();
const PORT = 3005;

serv.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: './tmp/'
}));

serv.use(cors());
serv.use(bodyParser.json());
serv.use(bodyParser.urlencoded({ extended: true }));

// Start CashMire server
console.log(`🍰 Maite in the Pocket launching on port ${colors.bold.blue(PORT.toString())}`);
serv.listen(PORT, mongo.start);

/**
 * API
 */

// Test endpoint
serv.get('/test', (req: Request, res: Response) => {
  console.log('hello');
  res.status(200).send('hello');
});

// Add a recipe
serv.put('/mp/recipe/add', async (req: Request, res: Response) => {
  res.status(501);
});

// Edit a recipe
serv.put('/mp/recipe/:id', async (req: Request, res: Response) => {
  res.status(501);
});

// Delete a recipe
serv.delete('/mp/recipe/:id', async (req: Request, res: Response)  => {
  res.status(501);
});

// Get recipe detail
serv.get('/mp/recipe/:id', async (req: Request, res: Response) => {
  res.status(501);
});

// Serve a list of recipe  according to a search term and pagination
serv.post('/mp/recipe/search', async (req: Request, res: Response) => {
  res.status(501);
})