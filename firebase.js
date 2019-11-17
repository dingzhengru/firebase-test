const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

const firebaseConfig = {};

const firestore = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { firebase, db };