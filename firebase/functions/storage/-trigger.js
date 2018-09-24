const murl = require('murl');

module.exports = (app, pattern) => {
  const matcher = murl(pattern);
  const build = name => {
    let object = app.functions.storage.object();
    return fn => object[name].call(object, async (metadata, context) => {
      let name = metadata.name;
      let params = matcher(name);
      if(!params) {
        console.log('skip', name);
        return;
      }
      console.log('invoke', name);
      await fn(metadata, context, params);
    });
  };
  return {
    onFinalize: build('onFinalize'),
    onDelete:   build('onDelete')
  };
}
