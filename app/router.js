import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('files', function() {
    this.route('new');
    this.route('file', { path: ':file_id' }, function() {
    });
  });

});

export default Router;
