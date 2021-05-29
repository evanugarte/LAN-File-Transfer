const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { FileApiHandler } = require('./FileApiHandler');
const { LoggingApiHandler } = require('./LoggingApiHandler');


const UPLOAD_ENDPOINT = '/api/upload';
const DOWNLOAD_ENDPOINT = '/api/download';
const DELETE_ENDPOINT = '/api/delete';
const FILES_ENDPOINT = '/api/files';

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
    this.app.delete(DELETE_ENDPOINT, this.deleteEndpointHandler);
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
    loggingApiHandler.logDownload(fileId)
      .then(() => downloadServiceResponse.body.pipe(res))
      .catch(() => res.sendStatus(404));
  }

  async deleteEndpointHandler(req, res) {
    const { fileToDelete } = req.body;
    const fileApiHandler = new FileApiHandler();
    fileApiHandler.handleDelete(fileToDelete);
    const loggingApiHandler = new LoggingApiHandler();
    loggingApiHandler.handleDelete(fileToDelete)
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(404));
  }

  async filesEndpointHandler(req, res) {
    const loggingApiHandler = new LoggingApiHandler();
    const { files } = await loggingApiHandler.getAllFiles();
    let parsedFiles = files.map(file => JSON.parse(file));
    parsedFiles.forEach((file, index) => {
      const timestamp = file.uploadDate.$date
      parsedFiles[index].timestamp = timestamp;
      parsedFiles[index].uploadDate = new Date(timestamp).toDateString();
    });
    res.json({
      files: parsedFiles
    });
  }
}

module.exports = { ApiGatewayServer };
