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
