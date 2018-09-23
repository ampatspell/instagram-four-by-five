(function() {

  function vendorModule() {
    'use strict';
    return self['blobUtil'];
  }

  define('blob-util', [], vendorModule);
})();
