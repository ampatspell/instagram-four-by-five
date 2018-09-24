const tmp = require('tmp');

const file = cb => new Promise((resolve, reject) => {
  tmp.file(async (err, path, fd, cleanup) => {
    if(err) {
      reject(err);
      return;
    }

    try {
      resolve(await cb(path));
    } catch(err) {
      reject(err);
    } finally {
      try {
        cleanup();
      } catch(err) {
        console.error(err.stack);
      }
    }
  });
});

module.exports = {
  file
}
