const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { LoggingHandler } = require('./LoggingHandler');


const UPLOAD_ENDPOINT = '/upload';
const DOWNLOAD_ENDPOINT = '/download';
const DELETE_ENDPOINT = '/delete';
const ALL_FILES_ENDPOINT = '/files';

class LoggingServer {
  constructor(port=5002) {
    this.port = port;
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  startServer() {
    this.app.post(UPLOAD_ENDPOINT, this.saveFileToMongoDb);
    this.app.post(DOWNLOAD_ENDPOINT, this.logDownload);
    this.app.delete(DELETE_ENDPOINT, this.handleDelete);
    this.app.get(ALL_FILES_ENDPOINT, this.getAllFles);
    this.app.listen(this.port, () => {
      this.connectToMongoDb();
      console.log(`App is listening on port ${this.port}.`)
    });
  }

  connectToMongoDb() {
    const dockerEnv = process.env.DOCKER === 'true';
    const mongoDbUrl = dockerEnv ? 'mongo' : 'localhost';
    this.mongoose = mongoose;
      this.mongoose
        .connect(`mongodb://${mongoDbUrl}/lft`, {
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
    loggingHandler.storeFileInformation({ ...req.body })
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(400));
  }

  async logDownload(req, res) {
    const loggingHandler = new LoggingHandler();
    loggingHandler.logDownload(req.body.fileId)
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(400));
  }

  async handleDelete(req, res) {
    const loggingHandler = new LoggingHandler();
    loggingHandler.handleDelete(req.body.fileToDelete)
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
