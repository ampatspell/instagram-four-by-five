module.exports = function(app) {

  const trigger = require('../-trigger');

  return trigger(app, 'users/{uid}/pictures/{id}/original', { timeoutSeconds: 360, memory: '2GB' }).onFinalize(async (object, context, params) => {
    let { uid, id } = params;

    let data = {
      status: null,
      images: null,
      error: null,
    };

    try {
      let images = await app.services.processImage({
        directory: `users/${uid}/pictures/${id}`,
        original:  'original',
        processed: 'processed'
      });
      data = Object.assign(data, { status: 'succss', images });
    } catch(err) {
      console.log(err);
      data = Object.assign(data, { status: 'error', error: err.stack });
    }

    await app.firestore.doc(`users/${uid}/pictures/${id}`).set(data, { merge: true });
  });
}
