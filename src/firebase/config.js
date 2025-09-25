import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC09mosJ6HcwbUrIOdFiuGiSTYp2DjAyrc",
  authDomain: "facebook-6131f.firebaseapp.com",
  projectId: "facebook-6131f",
  storageBucket: "facebook-6131f.firebasestorage.app",
  messagingSenderId: "978676984631",
  appId: "1:978676984631:web:051cc7f6298f9ae05548b2"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db=getFirestore(app)
export const auth=getAuth(app)
export const provider=new GoogleAuthProvider() 