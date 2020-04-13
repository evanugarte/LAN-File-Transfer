const UploadedFiles = new FS.Collection("uploadedFiles", {
  stores: [new FS.Store.FileSystem("uploadedFiles", { path: "~/meteor_uploads" })]
});

UploadedFiles.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

module.exports = { UploadedFiles }
