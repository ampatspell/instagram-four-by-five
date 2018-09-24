import { initialize } from 'ember-cli-zuglet/initialize';
import Store from '../store';

export default {
  name: 'square:store',
  initialize: initialize({
    store: {
      identifier: 'store',
      factory: Store
    },
    development: {
      logging: false
    }
  })
};
