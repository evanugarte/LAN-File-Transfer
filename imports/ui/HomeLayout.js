import { Template } from 'meteor/templating';

import './HomeLayout.html';

Template.HomeLayout.onCreated(function helloOnCreated() {
  console.log('the deliciousness has landed');
});
