import { Template } from 'meteor/templating';

import './TopMenu.html';

Template.TopMenu.helpers({
  links: [
      { name: 'Home', path: '/', icon: 'home' },
      { name: 'Downloads', path: '/downloads', icon: 'download' }
    ]
});
