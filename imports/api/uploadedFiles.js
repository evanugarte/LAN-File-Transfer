const UPLOAD_PATH = process.env.DOCKER ?
  '/meteor_uploads' :
  '~/meteor_uploads';

const UploadedFiles = new FS.Collection("uploadedFiles", {
  stores: [new FS.Store.FileSystem("uploadedFiles", { path: UPLOAD_PATH })]
});

UploadedFiles.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

module.exports = { UploadedFiles }
