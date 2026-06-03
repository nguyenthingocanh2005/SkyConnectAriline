import { auth } from "./firebase.js";
import { flightsDB } from "./fakeFlights.js";

console.log("booking.js loaded");

window.onload = () => {

    const btn = document.getElementById("btnSearch");

    if (!btn) return;

    btn.onclick = async () => {

        const user = auth.currentUser;

        if (!user) {
            alert("Bạn cần đăng nhập trước khi đặt vé!");
            window.location.href = "Dangnhap.html";
            return;
        }

        searchFlights();
    };
};

function searchFlights() {

    const from = document.getElementById("diem-di").value;
    const to = document.getElementById("diem-den").value;
    const date = document.getElementById("ngay_di").value;

    if (!from || !to || !date || from === "0" || to === "0") {
        alert("Vui lòng nhập đủ thông tin");
        return;
    }

    if (from === to) {
        alert("Điểm đi và điểm đến không được trùng nhau");
        return;
    }

    console.log("SEARCH:", from, to, date);

    // 🔥 1. Ưu tiên fake DB (5000 flights)
    let result = flightsDB.filter(f =>
        f.dep_iata === from &&
        f.arr_iata === to
    );

    // 🔥 2. nếu không có thì fallback API (nếu cần)
    if (result.length === 0) {
        alert("Không có dữ liệu trong database giả");
        return;
    }

    localStorage.setItem("searchFlights", JSON.stringify(result));
    localStorage.setItem("searchDate", date);

    window.location.href = `ketqua.html?from=${from}&to=${to}&date=${date}`;
}