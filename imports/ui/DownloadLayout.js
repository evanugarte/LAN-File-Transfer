import { Template } from 'meteor/templating';
import { UploadedFiles } from '../api/uploadedFiles.js';

import './DownloadLayout.html';

Template.DownloadLayout.onCreated(function helloOnCreated() {
  console.log('the deliciousness has landed but now in download');
  console.log(UploadedFiles.find());

});

Template.FileList.helpers({
  uploadedFiles: function () {
    return UploadedFiles.find();
  }
});

function getFileType(fileName) {
  let fileType = null;
  const splitFileName = fileName.split(".");
  if (splitFileName.length > 1) {
    fileType = splitFileName[splitFileName.length - 1];
  }
  return fileType;
}

const FILE_MAP = {
  'pdf': 'file alternate',
  'doc': 'file alternate',
  'docx': 'file alternate',
  'md': 'file alternate',
  'c': 'file code',
  'py': 'file code',
  'cpp': 'file code',
  'js': 'file code',
  'html': 'file code',
  'css': 'file code',
  'mp3': 'headphones',
  'mp4': 'film',
  'avi': 'film',
}

Template.File.helpers({
  getFileIcon: function (file) {
    const fileType = getFileType(file.original.name);
    if (fileType && FILE_MAP[fileType]) {
      return FILE_MAP[fileType];
    } else {
      return 'file';
    }
  }
});

Template.File.events({
  'click #delete-button': function (event, template) {
    UploadedFiles.remove(this.file._id);
  }
});
