// const firebase = require('firebase/app');
// require('firebase/firestore');
// require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyA1v-8vqcbl-kvKKUybHKQkJdimDNs2Ykk",
    authDomain: "vue-demo-92774.firebaseapp.com",
    databaseURL: "https://vue-demo-92774.firebaseio.com",
    projectId: "vue-demo-92774",
    storageBucket: "vue-demo-92774.appspot.com",
    messagingSenderId: "293558852778",
    appId: "1:293558852778:web:e0b38cd9525f765ba6c4d3"
};

const firestore = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// export { firebase, db }