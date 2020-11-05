const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true
}));

const SERVER_PORT = process.env.SERVER_PORT || 5000;
const CPP_SERVICE_URL = process.env.CPP_SERVICE_URL || 'http://localhost:5001';

function attemptUpload(fileData) {
  return new Promise((resolve, reject) => {
    fetch(`${CPP_SERVICE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: fileData
    })
      .then(res => res.json())
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject('upload failed:', err);
      });
  });
}

app.post('/upload', async (req, res) => {
  const fileData = req.files['fileToUpload'].data;
  const uploadServiceResponse = await attemptUpload(fileData);
  // todo, see https://github.com/evanugarte/LAN-File-Transfer/issues/32
  // we will use uploadServiceResponse to save file metadata
  console.log('server responded with:', uploadServiceResponse);
  res.sendStatus(200);
});

app.listen(SERVER_PORT, () =>
  console.log(`App is listening on port ${SERVER_PORT}.`)
);
