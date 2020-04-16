import { Template } from 'meteor/templating';

import './SideMenu.html';

Template.SideMenu.helpers({
  links: function () {
    return [
      { name: 'Home', path: '/', icon: 'home' },
      { name: 'Downloads', path: '/downloads', icon: 'download' }
    ]
  }
});
