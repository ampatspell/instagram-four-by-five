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

  user: readOnly('store.user'),
  uid: readOnly('user.uid'),

  state: 'none',
  error: null,

  isNone:      state('none'),
  isUploading: state('uploading'),
  isUploaded:  state('uploaded'),
  isError:     state('error'),

  doc: observed().content(owner => {
    let { store, uid } = owner;
    return store.collection(`users/${uid}/pictures`).doc().existing();
  }),

  ref: computed(function() {
    let { uid, doc: { id } } = this;
    return this.store.storage.ref(`users/${uid}/pictures/${id}/original`);
  }).readOnly(),

  prepare() {
    return resolveObservers(this.doc);
  },

  async upload(file) {
    setProperties(this, {
      state: 'uploading'
    });
    try {
      await this.ref.put({
        type: 'data',
        data: file,
        metadata: {
          contentType: file.type
        }
      });
      setProperties(this, {
        state: 'uploaded'
      });
    } catch(err) {
      setProperties(this, {
        state: 'error',
        error: err
      });
    }
  },

  async select(file) {
    await this.upload(file);
  },

  onDocumentCreated: observer('doc.exists', function() {
    if(this.isDestroying) {
      return;
    }
    let doc = this.doc;
    if(!doc.exists) {
      return;
    }
    this.router.transitionTo('files.file', doc.id);
  })

});
