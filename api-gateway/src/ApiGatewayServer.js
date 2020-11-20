const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { FileApiHandler } = require('./FileApiHandler');


const UPLOAD_ENDPOINT = '/upload';
const DOWNLOAD_ENDPOINT = '/download';

class ApiGatewayServer {
  constructor(port=5000) {
    this.port = port;
    this.app = express();
    this.app.use(fileUpload({
      createParentPath: true
    }));
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  startServer() {
    this.app.post(UPLOAD_ENDPOINT, this.uploadEndpointHandler);
    this.app.get(DOWNLOAD_ENDPOINT, this.downloadEndpointHandler);
    this.app.listen(this.port, () =>
      console.log(`App is listening on port ${this.port}.`)
    );
  }

  async uploadEndpointHandler(req, res) {
    const fileData = req.files['fileToUpload'].data;
    const fileApiHandler = new FileApiHandler();
    const uploadServiceResponse = await fileApiHandler.attemptUpload(fileData);
    // todo, see https://github.com/evanugarte/LAN-File-Transfer/issues/32
    // we will use uploadServiceResponse to save file metadata
    console.log('server responded with:', uploadServiceResponse);
    res.send(uploadServiceResponse);
  }

  async downloadEndpointHandler(req, res) {
    const { fileId } = req.query;
    const fileApiHandler = new FileApiHandler();
    const downloadServiceResponse =
      await fileApiHandler.attemptDownload(fileId);
    downloadServiceResponse.body.pipe(res);
  }
}

module.exports = { ApiGatewayServer };
