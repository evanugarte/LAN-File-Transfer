import './ui/DownloadLayout';
import './ui/HomeLayout';

const routes = [
  {route: '/', name: 'home', layout: 'HomeLayout'},
  {route: '/downloads', name: 'downloads', layout: 'DownloadLayout'}
]

routes.map(({route, name, layout}) => {
  FlowRouter.route(route, {
    name,
    action() {
      BlazeLayout.render(layout)
    }
  })
})
