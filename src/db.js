import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import "firebase/firebase-messaging";

var firebaseConfig = {
  apiKey: "AIzaSyAUqIkkhNLja9rPIo1VxJHzfS8GOAqytmg",
  authDomain: "tasks-app12.firebaseapp.com",
  projectId: "tasks-app12",
  storageBucket: "tasks-app12.appspot.com",
  messagingSenderId: "787125914742",
  appId: "1:787125914742:web:783db342ee1c9266a86357",
  measurementId: "G-8LZMB792WZ",
  databaseURL: "https://tasks-app12-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Get a Firestore instance
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const msg = firebaseApp.messaging()
export const db = firebaseApp.firestore()
export const auth = firebaseApp.auth()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint, FieldValue } = firebase.firestore
export { Timestamp, GeoPoint, FieldValue }

// if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true })