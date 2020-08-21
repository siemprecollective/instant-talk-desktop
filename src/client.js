import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "BLANK",
  authDomain: "BLANK",
  databaseURL: "BLANK",
  projectId: "BLANK",
  storageBucket: "BLANK",
  messagingSenderId: "BLANK",
  appId: "BLANK"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
