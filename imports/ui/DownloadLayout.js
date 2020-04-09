import { Template } from 'meteor/templating';

import './DownloadLayout.html';

Template.DownloadLayout.onCreated(function helloOnCreated() {
  console.log('the deliciousness has landed but now in download');
});

