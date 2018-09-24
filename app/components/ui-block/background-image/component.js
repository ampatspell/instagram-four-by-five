import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-background-image' ],

  attributeBindings: [ 'style' ],

  style: computed('url', function() {
    let { url } = this;
    if(!url) {
      return;
    }
    return htmlSafe(`background-image: url("${url}")`);
  }).readOnly()

});
