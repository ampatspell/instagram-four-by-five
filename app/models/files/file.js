import EmberObject, { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly, equal } from '@ember/object/computed';
import { observed, resolveObservers } from 'ember-cli-zuglet/lifecycle';

const setProperties = (object, props) => {
  if(object.isDestroying) {
    return;
  }
  object.setProperties(props);
}

const state = value => equal('state', value);

export default EmberObject.extend({

  router: service(),
  uid: readOnly('store.user.uid'),

  id: null,

  doc: observed().content(owner => {
    let { store, uid, id } = owner;
    return store.doc(`users/${uid}/pictures/${id}`).existing();
  }),

  url: readOnly('doc.data.images.processed.url'),
  error: readOnly('doc.data.error'),

  async prepare({ id }) {
    this.setProperties({ id });

    let doc = this.doc;
    await resolveObservers(doc);

    if(!doc.exists) {
      this.router.transitionTo('index');
    }
  }

});
