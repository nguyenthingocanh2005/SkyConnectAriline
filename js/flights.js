const API_KEY = "8f76ed43-1d13-4e99-9628-a24f934cf874";

let flights = [];
let page = 1;
let perPage = 12;

/* ===============================
   DANH SÁCH SÂN BAY
================================= */
const airports = [
    "HAN","SGN","DAD","CXR","PQC","HUI","VCA",
    "HPH","VII","THD","VDH","BMV","PXU","DLI",
    "UIH","TBB","VCL","CAH","VCS","DIN"
];

/* ===============================
   MAP TÊN THÀNH PHỐ
================================= */
const cityMap = {
    HAN:"Hà Nội (HAN)",
    SGN:"Hồ Chí Minh (SGN)",
    DAD:"Đà Nẵng (DAD)",
    CXR:"Nha Trang (CXR)",
    PQC:"Phú Quốc (PQC)",
    HUI:"Huế (HUI)",
    VCA:"Cần Thơ (VCA)",
    HPH:"Hải Phòng (HPH)",
    VII:"Vinh (VII)",
    THD:"Thanh Hóa (THD)",
    VDH:"Đồng Hới (VDH)",
    BMV:"Buôn Ma Thuột (BMV)",
    PXU:"Pleiku (PXU)",
    DLI:"Đà Lạt (DLI)",
    UIH:"Quy Nhơn (UIH)",
    TBB:"Tuy Hòa (TBB)",
    VCL:"Chu Lai (VCL)",
    CAH:"Cà Mau (CAH)",
    VCS:"Côn Đảo (VCS)",
    DIN:"Điện Biên (DIN)"
};
console.log("flights.js loaded");
/* ===============================
   LOADING
================================= */
function showLoading() {
    document.getElementById("pageInfo").innerHTML =
        "⏳ Đang tải dữ liệu chuyến bay...";
}

function hideLoading() {
    document.getElementById("pageInfo").innerHTML =
        `Trang ${page}`;
}

/* ===============================
   SẮP XẾP GIỜ MỚI NHẤT TRƯỚC
================================= */
function sortFlightsNewest() {
    flights.sort((a, b) => {
        let timeA = a.dep_time ? new Date(a.dep_time).getTime() : 0;
        let timeB = b.dep_time ? new Date(b.dep_time).getTime() : 0;
        return timeB - timeA;
    });
}

/* ===============================
   LOAD DATA
================================= */
async function loadFlights() {

    showLoading();
    flights = [];

    const fastAirports = airports.slice(0, 7);

    const firstRequests = fastAirports.map(code =>
        fetch(`https://airlabs.co/api/v9/schedules?dep_iata=${code}&api_key=${API_KEY}`
        ).then(res => res.json())
    );

    const firstResults = await Promise.all(firstRequests);
    console.log(firstResults);

    firstResults.forEach(data => {
        if (data.response) {
            flights = flights.concat(data.response);
        }
    });

    sortFlightsNewest();
    renderPage();
    hideLoading();

    const remainAirports = airports.slice(7);

    const otherRequests = remainAirports.map(code =>
        fetch(`https://airlabs.co/api/v9/schedules?dep_iata=${code}&api_key=${API_KEY}`
        ).then(res => res.json())
    );

    const otherResults = await Promise.all(otherRequests);

    otherResults.forEach(data => {
        if (data.response) {
            flights = flights.concat(data.response);
        }
    });

    sortFlightsNewest();
    renderPage();
}

/* ===============================
   HIỂN THỊ
================================= */
function renderPage() {

    let start = (page - 1) * perPage;
    let current = flights.slice(start, start + perPage);

    let left = current.slice(0, 6);
    let right = current.slice(6, 12);

    document.getElementById("leftTable").innerHTML =
        left.map(f => rowHTML(f)).join("");

    document.getElementById("rightTable").innerHTML =
        right.map(f => rowHTML(f)).join("");

    document.getElementById("pageInfo").innerHTML =
        `Trang ${page}`;
}

function rowHTML(f) {

    let depCity = cityMap[f.dep_iata] || f.dep_iata || "--";
    let arrCity = cityMap[f.arr_iata] || f.arr_iata || "--";

    let date = "--";
    let time = "--";

    // dùng giờ khởi hành thật
    if (f.dep_time) {

        let d = new Date(f.dep_time);

        date = d.toLocaleDateString("vi-VN");

        time = d.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    return `
        <tr>
            <td>${f.flight_iata || "--"}</td>
            <td>${depCity}</td>
            <td>${arrCity}</td>
            <td>${date}</td>
            <td>${time}</td>
        </tr>
    `;
}

/* ===============================
   CHUYỂN TRANG
================================= */
function nextPage() {
    if (page * perPage < flights.length) {
        page++;
        renderPage();
    }
}

function prevPage() {
    if (page > 1) {
        page--;
        renderPage();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadFlights();
});

window.nextPage = nextPage;
window.prevPage = prevPage;