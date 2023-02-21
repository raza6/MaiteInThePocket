import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import colors from 'colors';
import express from 'express';
import MongoDB from './mongo/mongo';
import recipeController from './controllers/recipeController';

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

recipeController(serv);
