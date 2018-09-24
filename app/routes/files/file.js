import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';

export default Route.extend({

  model: route().named('files/file').mapping((route, params) => {
    let id = params.file_id;
    return { id };
  })

});
