import { Template } from 'meteor/templating';
import '../imports/routes'
import '../imports/ui/SideMenu'

import './main.html';

Template.body.onCreated(function helloOnCreated() {
  // counter starts at 0
});
