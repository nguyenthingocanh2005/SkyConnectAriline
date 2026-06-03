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

// lấy chuyến bay
const flight = JSON.parse(
    localStorage.getItem("selectedFlight")
);

// check
if(!flight){

    alert("Không tìm thấy chuyến bay");

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

// render UI
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

const basePrice =
flight.price || 2500000;

const seatGrid =
document.getElementById("seatGrid");

const selectedSeatText =
document.getElementById("selectedSeat");

let selectedSeats = [];

// ghế đã đặt
const occupiedSeats = [
    "A2","B3","C4",
    "D5","E2","F1"
];

/* ==========================
   UPDATE PRICE
========================== */
function updateTotalPrice(){

    const count =
    selectedSeats.length || 1;

    const total =
    basePrice * count;

    document.getElementById(
        "price"
    ).innerText =
    total.toLocaleString()
    + "đ";
}

/* ==========================
   CREATE SEATS
========================== */
function createSeats(){

    const rows = 8;
    const cols = [
        "A","B","C",
        "D","E","F"
    ];

    seatGrid.innerHTML = "";

    for(let row = 1; row <= rows; row++){

        cols.forEach(col=>{

            const seatCode =
            col + row;

            const seat =
            document.createElement("div");

            seat.innerText =
            seatCode;

            seat.classList.add(
                "seat"
            );

            // ghế đã đặt
            if(
                occupiedSeats.includes(
                    seatCode
                )
            ){

                seat.classList.add(
                    "occupied"
                );

            }else{

                seat.classList.add(
                    "free"
                );

                seat.onclick = ()=>{

                    // bỏ chọn
                    if(
                        selectedSeats.includes(
                            seatCode
                        )
                    ){

                        selectedSeats =
                        selectedSeats.filter(
                            s => s !== seatCode
                        );

                        seat.classList.remove(
                            "selected"
                        );

                        seat.classList.add(
                            "free"
                        );

                    }else{

                        // chọn ghế
                        selectedSeats.push(
                            seatCode
                        );

                        seat.classList.remove(
                            "free"
                        );

                        seat.classList.add(
                            "selected"
                        );
                    }

                    updateSeatUI();
                };
            }

            seatGrid.appendChild(
                seat
            );
        });
    }
}

/* ==========================
   UPDATE UI
========================== */
function updateSeatUI(){

    selectedSeatText.innerText =

        selectedSeats.length > 0

        ? selectedSeats.join(", ")

        : "Chưa chọn";

    document.getElementById(
        "ticketCount"
    ).value =

        selectedSeats.length || 1;

    updateTotalPrice();
}

/* ==========================
   INIT
========================== */
createSeats();
updateSeatUI();

// submit
document.getElementById("passengerForm")
.onsubmit = function(e){

    e.preventDefault();

        const passenger = {

        fullname:
        document.getElementById("fullname").value,

        cccd:
        document.getElementById("cccd").value,

        phone:
        document.getElementById("phone").value,

        email:
        document.getElementById("email").value,

        birthday:
        document.getElementById("birthday").value,

        gender:
        document.getElementById("gender").value,

        ticketCount:
        selectedSeats.length || 1,

        selectedSeats:
        selectedSeats,

        totalPrice:
        basePrice *
        (selectedSeats.length || 1)
    };

    // lưu passenger
    localStorage.setItem(
        "passengerInfo",
        JSON.stringify(passenger)
    );

    window.location.href = "payment.html";
};

