import { Template } from 'meteor/templating';

import './SideMenu.html';

Template.SideMenu.helpers({
  links: [
      { name: 'Home', path: '/', icon: 'home' },
      { name: 'Downloads', path: '/downloads', icon: 'download' }
    ]
});
