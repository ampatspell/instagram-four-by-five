import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-files-new' ],

  actions: {
    file(file) {
      this.model.select(file);
    }
  }

});
