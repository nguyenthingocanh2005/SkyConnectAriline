import {
    auth,
    onAuthStateChanged,
    signOut
} from "./firebase.js";

// đưa ra global cho navbar.js dùng
window.auth = auth;
window.onAuthStateChanged = onAuthStateChanged;
window.signOutGoogle = signOut;