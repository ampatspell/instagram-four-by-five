import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend({

  user: null,
  uid: readOnly('user.uid'),

  async restore() {
  }

});
