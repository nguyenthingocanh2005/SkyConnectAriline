import { auth, provider } from "./firebase.js";

import {
 signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ⛔ CHỜ DOM LOAD XONG
window.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("googleLogin");
    const userInfo = document.getElementById("userInfo");

    if (!btn) {
        console.error("Không tìm thấy button googleLogin");
        return;
    }

    btn.addEventListener("click", () => {

        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;

            setTimeout(() => {
                window.location.href = "Home.html";
            }, 1200);

        })
        .catch((error) => {
            console.log(error);
            alert("Lỗi đăng nhập: " + error.message);
        });

    });

});