const config = {
  apiKey: "AIzaSyBfrqtqcr4pYhKHJxbkvxbczxnfkZMFYzw",
  authDomain: "four-by-five.firebaseapp.com",
  databaseURL: "https://four-by-five.firebaseio.com",
  projectId: "four-by-five",
  storageBucket: "four-by-five.appspot.com",
};

process.env.FIREBASE_CONFIG = config;

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Application = require('./app');

const serviceAccount = require('../service-account-key.json');

admin.initializeApp(Object.assign({
  credential: admin.credential.cert(serviceAccount),
}, config));

admin.firestore().settings({ timestampsInSnapshots: true });

let app = new Application(admin, functions);

app.services.processImage({
  directory: 'users/WITfC6fDEjdn5vHSdcpZvwkAKsu2/pictures/TRG8x5eL7qJlX2B1oF7R',
  original: 'original',
  processed: 'processed'
}).then(res => {
  console.log(res);
}, err => {
  console.log(err.stack);
});
