const fetch = require('node-fetch');

const NODE_SERVICE_URL =
  process.env.NODE_SERVICE_URL || 'http://localhost:5002';


class LoggingApiHandler {
  storeFileMetadata({ fileName, fileSize, uuid }) {
    return new Promise((resolve, reject) => {
      fetch(`${NODE_SERVICE_URL}/upload/${fileName}/${uuid}/${fileSize}`, {
        method: 'POST',
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
      fetch(`${NODE_SERVICE_URL}/download/${fileId}`, {
        method: 'POST',
      })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject('logging download failed:', err);
        });
    });
  }

  handleDelete(fileToDelete) {
    return new Promise((resolve, reject) => {
      fetch(`${NODE_SERVICE_URL}/delete/${fileToDelete}`, {
        method: 'DELETE',
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
      fetch(`${NODE_SERVICE_URL}/files`)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => {
          reject('download failed:', err);
        });
    });
  }
}

module.exports = { LoggingApiHandler };
