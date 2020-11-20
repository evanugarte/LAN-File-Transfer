const FileLog = require('../models/FileLog');

class LoggingHandler {
  storeFileInformation({fileName, uuid, fileSize}) {
    console.log({fileName, uuid, fileSize});
    const newFile = new FileLog({
      fileName,
      uuid,
      fileSize,
    });
    return new Promise((resolve, reject) => {
      newFile.save(function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  logDownload(fileId) {
    return new Promise((resolve, reject) => {
      FileLog.findOneAndUpdate({ uuid: fileId }, 
        { $inc : { timesDownloaded: 1} }, 
        { useFindAndModify: false }, 
        function(err, response) {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
    });
  }
  
    getAllFiles() {
      return new Promise((resolve, reject) => {
        FileLog.find()
        .sort({ uploadDate: -1 })
        .then(files => resolve(files))
        .catch(err => reject(err));
    });
  }
}

module.exports = { LoggingHandler };
