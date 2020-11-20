const fetch = require('node-fetch');


const CPP_SERVICE_URL = process.env.CPP_SERVICE_URL || 'http://localhost:5001';

class FileApiHandler {
  attemptUpload(fileData) {
    return new Promise((resolve, reject) => {
      fetch(`${CPP_SERVICE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
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
  
  attemptDownload(fileName) {
    return new Promise((resolve, reject) => {
      fetch(`${CPP_SERVICE_URL}/download/${fileName}`)
        .then(res => resolve(res))
        .catch(err => {
          reject('download failed:', err);
        });
    });
  }
}

module.exports = { FileApiHandler };
