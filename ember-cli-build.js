'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
  });

  app.import('node_modules/blob-util/dist/blob-util.js');
  app.import('vendor/blob-util-shim.js');

  return app.toTree();
};
