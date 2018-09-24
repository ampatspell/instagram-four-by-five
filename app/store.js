import Store from 'ember-cli-zuglet/store';

const options = {
  firebase: {
    apiKey: "AIzaSyBfrqtqcr4pYhKHJxbkvxbczxnfkZMFYzw",
    authDomain: "four-by-five.firebaseapp.com",
    databaseURL: "https://four-by-five.firebaseio.com",
    projectId: "four-by-five",
    storageBucket: "four-by-five.appspot.com"
  },
  firestore: {
    persistenceEnabled: true
  }
};

export default Store.extend({

  options,

  async restore() {
    if(this.auth.user) {
      return;
    }
    await this.auth.methods.anonymous.signIn();
  },

  async restoreUser(user) {
    let current = this.user;
    if(current && user && user.uid === current.uid) {
      current.set('user', user);
    } else {
      let next = null;
      if(user) {
        next = this.models.create('user', { user });
        await next.restore();
      }
      this.set('user', next);
      current && current.destroy();
    }
  },

});
