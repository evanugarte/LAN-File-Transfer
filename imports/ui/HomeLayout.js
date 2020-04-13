import { Template } from 'meteor/templating';
import { UploadedFiles } from '../api/uploadedFiles.js';

import './HomeLayout.html';

Template.HomeLayout.onCreated(function helloOnCreated() {
  console.log('the deliciousness has landed');
});

Template.UploadComponent.events({
  'change .file-upload': function (event, template) {
    FS.Utility.eachFile(event, function (file) {
      let yourFile = new FS.File(file);
      console.log(file);
      console.log(yourFile);
      UploadedFiles.insert(yourFile, function (err, fileObj) {
        if (err) {
          alert('you suck man');
          return;
        }
        console.log('i guess we did it', fileObj);
      });
    });
  }
});

