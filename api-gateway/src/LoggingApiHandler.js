const fetch = require('node-fetch');

const LOGGING_SERVICE_URL =
  process.env.LOGGING_SERVICE_URL || 'http://localhost:5002';


class LoggingApiHandler {
  storeFileMetadata({ fileName, fileSize, uuid }) {
    return new Promise((resolve, reject) => {
      fetch(`${LOGGING_SERVICE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName, fileSize, uuid
        })
      })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject('upload failed:', err);
        });
    });
  }

  logDownload(fileId) {
    return new Promise((resolve, reject) => {
      fetch(`${LOGGING_SERVICE_URL}/download/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId
        })
      })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject('logging download failed:', err);
        });
    });
  }

  handleDelete(fileId) {
    return new Promise((resolve, reject) => {
      fetch(`${LOGGING_SERVICE_URL}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId
        })
      })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject('logging download failed:', err);
        });
    });
  }

  getAllFiles() {
    return new Promise((resolve, reject) => {
      fetch(`${LOGGING_SERVICE_URL}/files`)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => {
          reject('download failed:', err);
        });
    });
  }
}

module.exports = { LoggingApiHandler };
