import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNameBindings: [ ':ui-route-files-file-index' ],

  router: service(),

  actions: {
    back() {
      this.router.transitionTo('files.new');
    }
  }

});
