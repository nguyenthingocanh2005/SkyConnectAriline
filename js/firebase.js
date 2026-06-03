import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfgbs7yyRDaSNScUmJKqO2TNbySS4Mjew",
  authDomain: "skyconnectairlines-ed0c2.firebaseapp.com",
  projectId: "skyconnectairlines-ed0c2",
  storageBucket: "skyconnectairlines-ed0c2.firebasestorage.app",
  messagingSenderId: "305409330640",
  appId: "1:305409330640:web:51becaa8d24bc28464fdd5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
    auth,
    provider,
    onAuthStateChanged,
    signOut
};