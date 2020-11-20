const express = require('express');
const mongoose = require('mongoose');
const { LoggingHandler } = require('./LoggingHandler');


const UPLOAD_ENDPOINT = '/upload';
const DOWNLOAD_ENDPOINT = '/download';
const ALL_FILES_ENDPOINT = '/files';

class LoggingServer {
  constructor(port=5002) {
    this.port = port;
    this.app = express();
  }

  startServer() {
    this.app.post(UPLOAD_ENDPOINT, this.saveFileToMongoDb);
    this.app.post(DOWNLOAD_ENDPOINT, this.logDownload);
    this.app.get(ALL_FILES_ENDPOINT, this.getAllFles);
    this.app.listen(this.port, () => {
      this.connectToMongoDb();
      console.log(`App is listening on port ${this.port}.`)
    });
  }

  connectToMongoDb() {
    this.mongoose = mongoose;
      this.mongoose
        .connect(`mongodb://localhost/lft`, {
          promiseLibrary: require('bluebird'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        })
        .catch((error) => {
          throw error;
        });
  }

  async saveFileToMongoDb(req, res) {
    const loggingHandler = new LoggingHandler();
    loggingHandler.storeFileInformation({ ...req.query })
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(400));
  }

  async logDownload(req, res) {
    const loggingHandler = new LoggingHandler();
    loggingHandler.logDownload(req.query.fileId)
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(400));
  }

  async getAllFles(req, res) {
    const loggingHandler = new LoggingHandler();
    loggingHandler.getAllFiles()
      .then((data) => res.json(data))
      .catch(() => res.sendStatus(400));
  }
}

module.exports = { LoggingServer };
