import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { calculateBounds } from '../../../models/transform';

window.c = calculateBounds;


export default Component.extend({
  classNameBindings: [ ':ui-route-index' ],

  transform: null,

  actions: {
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
