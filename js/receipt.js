const cityMap = {
    HAN:"Hà Nội",
    SGN:"Hồ Chí Minh",
    DAD:"Đà Nẵng",
    CXR:"Nha Trang",
    PQC:"Phú Quốc",
    HUI:"Huế",
    VCA:"Cần Thơ",
    HPH:"Hải Phòng",
    VII:"Vinh",
    THD:"Thanh Hóa",
    DLI:"Đà Lạt",
    PXU:"Pleiku"
};

// =========================
// LẤY RECEIPT
// =========================

const receipt = JSON.parse(
    localStorage.getItem("latestReceipt")
);

// =========================
// CHECK
// =========================

if(!receipt){

    alert("Không tìm thấy biên lai");
}

// =========================
// DATA
// =========================

const flight = receipt.flight;
const passenger = receipt.passenger;

// =========================
// SPLIT DATETIME
// =========================

function splitDateTime(dateTime){

    if(!dateTime){

        return {
            date:"--",
            time:"--:--"
        };
    }

    const parts = dateTime.split("T");

    return {

        date:parts[0],

        time:parts[1]
            ? parts[1].substring(0,5)
            : "--:--"
    };
}

const dep = splitDateTime(flight.dep_time);
const arr = splitDateTime(flight.arr_time);

// =========================
// RENDER BOOKING ID
// =========================

document.getElementById("bookingId").innerText =
receipt.bookingId;

// =========================
// FLIGHT INFO
// =========================

document.getElementById("depAirport").innerText =
cityMap[flight.dep_iata] || flight.dep_iata;

document.getElementById("arrAirport").innerText =
cityMap[flight.arr_iata] || flight.arr_iata;

document.getElementById("depTime").innerText =
dep.time;

document.getElementById("arrTime").innerText =
arr.time;

document.getElementById("depDate").innerText =
dep.date;

document.getElementById("arrDate").innerText =
arr.date;

// =========================
// PASSENGER
// =========================

document.getElementById("fullname").innerText =
passenger.fullname || "--";

document.getElementById("phone").innerText =
passenger.phone || "--";

document.getElementById("email").innerText =
passenger.email || "--";

document.getElementById("ticketCount").innerText =
passenger.ticketCount || 1;

// =========================
// BLOCKCHAIN
// =========================

document.getElementById("wallet").innerText =
receipt.wallet || "--";

document.getElementById("txHash").innerText =
receipt.txHash || "--";

// =========================
// PRICE
// =========================

document.getElementById("price").innerText =
(receipt.totalPrice || 0)
.toLocaleString() + "đ";

document.getElementById("ethPrice").innerText =
(receipt.ethPrice || "0") + " ETH";

// =========================
// DURATION
// =========================

document.getElementById("duration").innerText =
calculateDuration(
    dep.time,
    arr.time
);

// =========================
// CALCULATE DURATION
// =========================

function calculateDuration(dep, arr){

    if(dep === "--:--" || arr === "--:--"){
        return "--";
    }

    const [dh, dm] =
    dep.split(":").map(Number);

    const [ah, am] =
    arr.split(":").map(Number);

    let depMin =
    dh * 60 + dm;

    let arrMin =
    ah * 60 + am;

    // qua ngày
    if(arrMin < depMin){
        arrMin += 24 * 60;
    }

    const total =
    arrMin - depMin;

    const h =
    Math.floor(total / 60);

    const m =
    total % 60;

    return `${h}h ${m}m`;
}

// =========================
// HISTORY PAGE
// =========================

function goHistory(){

    window.location.href =
    "history.html";
}

// =========================
// QR BOARDING PASS
// =========================

const qrElement =
document.getElementById("qrcode");

if(qrElement){

    const qrData =
    `BOOKING:${receipt.bookingId}
    NAME:${passenger.fullname}
    SEAT:${passenger.selectedSeats?.join(",") || "N/A"}`;

    new QRCode(
        document.getElementById("qrcode"),
        {
            text: receipt.bookingId,
            width:180,
            height:180
        }
    );
}