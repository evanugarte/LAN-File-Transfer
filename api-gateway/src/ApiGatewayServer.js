const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { FileApiHandler } = require('./FileApiHandler');
const { LoggingApiHandler } = require('./LoggingApiHandler');


const UPLOAD_ENDPOINT = '/upload';
const DOWNLOAD_ENDPOINT = '/download';
const FILES_ENDPOINT = '/files';

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
    this.app.get(FILES_ENDPOINT, this.filesEndpointHandler);
    this.app.listen(this.port, () =>
      console.log(`App is listening on port ${this.port}.`)
    );
  }

  async uploadEndpointHandler(req, res) {
    const { name, size, data } = req.files['fileToUpload'];
    const fileApiHandler = new FileApiHandler();
    const uploadServiceResponse = await fileApiHandler.attemptUpload(data);
    const loggingApiHandler = new LoggingApiHandler();
    loggingApiHandler.storeFileMetadata({
      fileName: name,
      fileSize: size,
      uuid: uploadServiceResponse.uuid_string
    });
    res.send(uploadServiceResponse);
  }

  async downloadEndpointHandler(req, res) {
    const { fileId } = req.query;
    const fileApiHandler = new FileApiHandler();
    const downloadServiceResponse =
      await fileApiHandler.attemptDownload(fileId);
    const loggingApiHandler = new LoggingApiHandler();
    loggingApiHandler.logDownload(fileId);
    downloadServiceResponse.body.pipe(res);
  }

  async filesEndpointHandler(req, res) {
    const loggingApiHandler = new LoggingApiHandler();
    const files = await loggingApiHandler.getAllFiles();
    res.status(200).send(files);
  }
}

module.exports = { ApiGatewayServer };
