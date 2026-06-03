const cityMap = {
    HAN: "Hà Nội",
    SGN: "Hồ Chí Minh",
    DAD: "Đà Nẵng",
    CXR: "Nha Trang",
    PQC: "Phú Quốc",
    HUI: "Huế",
    VCA: "Cần Thơ",
    HPH: "Hải Phòng",
    VII: "Vinh",
    THD: "Thanh Hóa",
    DLI: "Đà Lạt",
    PXU: "Pleiku"
};

// lấy chuyến bay đã chọn
const flight = JSON.parse(
    localStorage.getItem("selectedFlight")
);

// không có data
if (!flight) {

    alert("Không tìm thấy dữ liệu chuyến bay");

    window.location.href = "ketqua.html";
}

// split datetime
function splitDateTime(dateTime){

    if(!dateTime){

        return {
            date:"--",
            time:"--:--"
        };
    }

    const parts = dateTime.split("T");

    return {

        date: parts[0],

        time: parts[1]
            ? parts[1].substring(0,5)
            : "--:--"
    };
}

const dep = splitDateTime(flight.dep_time);
const arr = splitDateTime(flight.arr_time);

// render
document.getElementById("airlineName").innerText =
flight.airline_iata || "Vietnam Airlines";

document.getElementById("flightCode").innerText =
flight.flight_iata || "VN245";

document.getElementById("price").innerText =
(flight.price || 2500000).toLocaleString() + "đ";

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

// duration
document.getElementById("duration").innerText =
calculateDuration(dep.time, arr.time);

// tính thời lượng
function calculateDuration(dep, arr){

    const [dh, dm] = dep.split(":").map(Number);
    const [ah, am] = arr.split(":").map(Number);

    let depMin = dh * 60 + dm;
    let arrMin = ah * 60 + am;

    if(arrMin < depMin){
        arrMin += 24 * 60;
    }

    const total = arrMin - depMin;

    const h = Math.floor(total / 60);
    const m = total % 60;

    return `${h}h${m}m`;
}

// button
document.getElementById("btnBook").onclick = () => {

    window.location.href = "passenger.html";
}