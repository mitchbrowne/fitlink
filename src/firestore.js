import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBiTiVQm30NbWxxn07kcs2pYe5WFZFzdyw",
    authDomain: "fitlink-1.firebaseapp.com",
    databaseURL: "https://fitlink-1.firebaseio.com",
    projectId: "fitlink-1",
    storageBucket: "fitlink-1.appspot.com",
    messagingSenderId: "973493932675",
    appId: "1:973493932675:web:bc6fa272e8fb31b75041b6",
    measurementId: "G-2R4TEEM75S"
}

const firestore = firebase.initializeApp(config);
firestore.analytics();

export default firestore;
