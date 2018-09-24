const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Application = require('./app');


admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

let app = new Application(admin, functions);

Object.assign(exports, app.exports);
Object.defineProperty(exports, '_app', { value: app });
