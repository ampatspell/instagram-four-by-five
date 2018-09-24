import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';

export default Route.extend({

  model: route().named('files/new').mapping(() => ({}))

});
