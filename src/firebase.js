import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDWDnxM9bk1jYvo-_uw4odRm-PgbAHwyLw",
    authDomain: "instagram-clone-f0c01.firebaseapp.com",
    projectId: "instagram-clone-f0c01",
    storageBucket: "instagram-clone-f0c01.appspot.com",
    messagingSenderId: "1310988761",
    appId: "1:1310988761:web:ba889348db685f8e4aa1c8"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db, auth, storage}