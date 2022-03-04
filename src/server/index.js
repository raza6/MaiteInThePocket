const serv = require('express')();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const csv = require('@fast-csv/parse');
const fs = require('fs');
const colors = require('colors');
const utils = require('./utilities');
const mongo = require('./mongo');
const PORT = 3005;

// Config
serv.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: './tmp/'
}));

serv.use(cors());
serv.use(bodyParser.json());
serv.use(bodyParser.urlencoded({ extended: true }));

// Start CashMire server
console.log(`💎 CashMire launching on port ${colors.bold.blue(PORT)}`);
serv.listen(PORT, mongo.start);


// API
serv.get('/test', (req, res) => {
  console.log('hello');
  res.status(200).send('hello');
});

serv.put('/bk/statement/add', async (req, res) => {
  console.info(utils.currentTimeLog(), '📫 - New statement');

  try {
    if (!req.files) {
      res.status(400).send('No file received');
    } else {
      let statementFile = req.files.statement;

      csv.parseFile(statementFile.tempFilePath, { headers: true, delimiter: '	' })
        .transform((data) => ({
          date: data['Date operation'],
          categorie: data['Categorie operation'].trim(),
          label: data['Libelle operation'].trim(),
          amount: parseFloat(data['Montant operation'].replace(',', '.'))
        }))
        .on('error', err => {
          fs.unlinkSync(statementFile.tempFilePath);
          console.error(err);
        })
        .on('data', parsedRow => mongo.addStatement(parsedRow))
        .on('end', (rowCount) => {
          console.info(utils.currentTimeLog(), `👏 - ${rowCount} statements added`);
          fs.unlinkSync(statementFile.tempFilePath);
          res.status(200).send('File received');
        });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
