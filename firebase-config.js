// Firebase Configuration using the compat libraries to ensure it works on local file:// protocol
const firebaseConfig = {
  apiKey: "AIzaSyDkidhSg_163n1yzrfk_qyGfgaE3MSErqk",
  authDomain: "anonymcreator---dashboard.firebaseapp.com",
  projectId: "anonymcreator---dashboard",
  storageBucket: "anonymcreator---dashboard.firebasestorage.app",
  messagingSenderId: "137220724819",
  appId: "1:137220724819:web:47df071a7534dc04a20ea6",
  measurementId: "G-JRJ670LW8P"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();
