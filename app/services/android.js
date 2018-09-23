import Service from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { defer } from 'rsvp';
import { run } from '@ember/runloop';

let _id = 0;

export default Service.extend({

  init() {
    this._super(...arguments);
    window.__handleAndroidResponse = (id, string) => run(() => this._handleResponse(id, string));
  },

  requests: computed(function() {
    return A();
  }).readOnly(),

  request(name, opts={}) {
    _id++;
    let id = `${_id}`;
    let deferred = defer();
    this.requests.pushObject({ name, id, opts, deferred });
    Android.request(JSON.stringify({ name, id, opts }));
    return deferred.promise;
  },

  _handleResponse(id, string) {
    console.log(string);
    let json = JSON.parse(string);
    let payload = this.requests.findBy('id', id);
    if(!payload) {
      return;
    }
    this.requests.removeObject(payload);
    payload.deferred.resolve(json);
  }

});
