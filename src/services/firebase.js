//import * as firebase from "firebase";
import firebase from "firebase";
import 'firebase/database';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyCIeFNZorTXAH5MSFxIAaILwRTNMfEr3fY",
    authDomain: "thesocialmedium-110a0.firebaseapp.com",
    databaseURL: "https://thesocialmedium-110a0.firebaseio.com",
    projectId: "thesocialmedium-110a0",
    storageBucket: "thesocialmedium-110a0.appspot.com",
    messagingSenderId: "749462796772",
    appId: "1:749462796772:web:44df3752d82016615caff1",
    measurementId: "G-K9HLH22Z19"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

  export const auth = firebase.auth()
  export const db = firebase.database()
  export const twitterProvider = new firebase.auth.TwitterAuthProvider();

  export default firebase