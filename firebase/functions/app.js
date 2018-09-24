module.exports = function() {

  class Application {

    constructor(admin, functions) {
      this.admin = admin;
      this.functions = functions;
      this.firestore = admin.firestore();
      this.storage = admin.storage();
      this.bucket = this.storage.bucket();
      this.exports = {
        storage: {
          users: {
            pictures: {
              onFinalize: this.require('./storage/pictures/on-finalize')
            }
          }
        }
      };
      this.services = {
        processImage: this.require('./services/process-image')
      };
    }

    require(name) {
      return require(name)(this);
    }

  }

  return Application;

}();
