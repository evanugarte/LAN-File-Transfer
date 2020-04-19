import { Template } from 'meteor/templating';
import { UploadedFiles } from '../api/uploadedFiles.js';
import { ReactiveVar } from 'meteor/reactive-var';

import './HomeLayout.html';

Template.UploadComponent.onCreated(function() {
  this.fileToUpload = new ReactiveVar(null);
});

Template.UploadComponent.helpers({
  uploadDisabled: () => Template.instance().fileToUpload.get() === null
});

Template.UploadComponent.events({
  'change .file-upload': function (event, template) {
    template.fileToUpload.set(event);
  },
  'click #upload-button': function(event, template) {
    const fileToUpload = Template.instance().fileToUpload.get();
    FS.Utility.eachFile(fileToUpload, function (file) {
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

