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

const params = new URLSearchParams(window.location.search);

const from = params.get("from");
const to = params.get("to");
const date = params.get("date");

// header
document.getElementById("searchInfo").innerText =
`${cityMap[from]} ➜ ${cityMap[to]} | ${date}`;

// lấy dữ liệu từ localStorage
const stored = JSON.parse(
    localStorage.getItem("searchFlights") || "[]"
);

const box = document.getElementById("resultArea");

// không có data
if (!stored.length) {

    box.innerHTML = `
        <div class="alert alert-warning">
            Không tìm thấy chuyến bay phù hợp.
        </div>
    `;

} else {

    renderFlights(stored);

}

function renderFlights(data) {

    let html = "";

    data.forEach(f => {

        // dep_time dạng:
        // 2026-05-24T04:16:00

        let depDate = "--";
        let depTime = "--:--";

        if (f.dep_time) {

            // tách theo T
            const parts = f.dep_time.split("T");

            depDate = parts[0];

            if (parts[1]) {
                depTime = parts[1].substring(0, 5);
            }
        }

        // tạo giờ đến
        const arrTime = calculateArrivalTime(depTime);

        // giá ổn định
        const price = generateStablePrice(
            f.flight_iata || f.dep_iata + f.arr_iata
        );

        html += `

        <div class="flight-card row align-items-center">

            <!-- hãng -->
            <div class="col-md-2">

                <div class="code">
                    ${f.airline_iata || "VN"}
                </div>

                <div>
                    ${f.flight_iata || generateFlightCode(f)}
                </div>

            </div>

            <!-- điểm đi -->
            <div class="col-md-3">

                <div>
                    <strong>
                        ${cityMap[f.dep_iata] || f.dep_iata}
                    </strong>
                </div>

                <div class="time">
                    ${depTime}
                </div>

                <div>
                    ${depDate}
                </div>

            </div>

            <!-- icon -->
            <div class="col-md-1 text-center">
                ✈️
            </div>

            <!-- điểm đến -->
            <div class="col-md-3">

                <div>
                    <strong>
                        ${cityMap[f.arr_iata] || f.arr_iata}
                    </strong>
                </div>

                <div class="time">
                    ${arrTime}
                </div>

                <div>
                    ${depDate}
                </div>

            </div>

            <!-- giá -->
            <div class="col-md-3 text-end">

                <div class="price">
                    ${price.toLocaleString()}đ
                </div>

                <button
                    class="btn btn-danger btn-book mt-2"
                    onclick='selectFlight(${JSON.stringify(f)})'
                >
                    Đặt vé
                </button>
            </div>

        </div>

        `;
    });

    box.innerHTML = html;
}

// tạo giờ đến ổn định
function calculateArrivalTime(depTime) {

    if (!depTime || depTime === "--:--") {
        return "--:--";
    }

    let [hour, minute] = depTime.split(":").map(Number);

    // cộng 1h45
    minute += 45;
    hour += 1;

    if (minute >= 60) {
        minute -= 60;
        hour += 1;
    }

    if (hour >= 24) {
        hour -= 24;
    }

    return `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
}

// tạo giá ổn định theo mã chuyến bay
function generateStablePrice(flightCode) {

    if (!flightCode) {
        return 2500000;
    }

    let sum = 0;

    for (let i = 0; i < flightCode.length; i++) {
        sum += flightCode.charCodeAt(i);
    }

    return (sum % 8 + 2) * 1000000;
}

function generateFlightCode(f) {

    const text =
        (f.dep_iata || "") +
        (f.arr_iata || "") +
        (f.dep_time || "");

    let sum = 0;

    for (let i = 0; i < text.length; i++) {
        sum += text.charCodeAt(i);
    }

    return "VN" + (sum % 900 + 100);
}

window.selectFlight = function(flight){

    localStorage.setItem(
        "selectedFlight",
        JSON.stringify(flight)
    );

    window.location.href =
    "flight-detail.html";
}