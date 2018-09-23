import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNameBindings: [ ':ui-route-index' ],

  android: service(),
  transform: null,

  actions: {
    foo() {
      this.android.request('pickImage').then(result => {
        console.log("****", result);
      });
    },
    file(file) {
      this.processFile(file);
    },
    reset() {
      this.set('transform', null);
    }
  },

  processFile(file) {
    let transform = getOwner(this).factoryFor('model:transform').create({ file });
    this.setProperties({ transform });
  }

});
