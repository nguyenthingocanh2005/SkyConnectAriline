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
// LOAD HISTORY
// =========================

const history = JSON.parse(
    localStorage.getItem("bookingHistory") || "[]"
);

const container =
document.getElementById("historyContainer");

// =========================
// EMPTY
// =========================

if(history.length === 0){

    container.innerHTML = `

    <div class="empty">

        <h2>
            Chưa có lịch sử đặt vé
        </h2>

        <p class="mt-3">
            Các giao dịch thanh toán sẽ hiển thị ở đây
        </p>

    </div>

    `;

}else{

    renderHistory(history);
}

// =========================
// RENDER
// =========================

function renderHistory(data){

    let html = "";

    data.forEach(item => {

        const flight = item.flight;
        const passenger = item.passenger;

        html += `

        <div class="ticket-card">

            <div class="row align-items-center">

                <div class="col-lg-8">

                    <div class="status mb-3">

                        <div class="dot"></div>

                        Đã thanh toán Blockchain

                    </div>

                    <div class="route mb-2">

                        ${cityMap[flight.dep_iata] || flight.dep_iata}

                        ✈️

                        ${cityMap[flight.arr_iata] || flight.arr_iata}

                    </div>

                    <div class="time mb-3">

                        ${formatDateTime(flight.dep_time)}

                    </div>

                    <div class="row">

                        <div class="col-md-6 mb-3">

                            <div class="label">
                                Hành khách
                            </div>

                            <div>
                                ${passenger.fullname}
                            </div>

                        </div>

                        <div class="col-md-6 mb-3">

                            <div class="label">
                                Số vé
                            </div>

                            <div>
                                ${passenger.ticketCount}
                            </div>

                        </div>

                        <div class="col-md-12">

                            <div class="label">
                                Transaction Hash
                            </div>

                            <div class="hash">
                                ${item.txHash}
                            </div>

                        </div>

                    </div>

                </div>

                <div class="col-lg-4 text-lg-end mt-4 mt-lg-0">

                    <div class="price mb-2">

                        ${item.totalPrice.toLocaleString()}đ

                    </div>

                    <div class="mb-4">

                        ${item.ethPrice} ETH

                    </div>

                    <button
                        class="btn-custom btn-detail"
                        onclick="viewReceipt('${item.bookingId || item.id}')"
                    >
                        🎫 Xem biên lai
                    </button>

                </div>

            </div>

        </div>

        `;
    });

    container.innerHTML = html;
}

// =========================
// FORMAT DATETIME
// =========================

function formatDateTime(dateTime){

    if(!dateTime){
        return "--";
    }

    const parts = dateTime.split("T");

    const date = parts[0];

    const time =
    parts[1]
        ? parts[1].substring(0,5)
        : "--:--";

    return `${date} • ${time}`;
}

// =========================
// VIEW RECEIPT
// =========================

function viewReceipt(bookingId){

    const history = JSON.parse(
        localStorage.getItem("bookingHistory") || "[]"
    );

    const found =
    history.find(
        item => item.bookingId === bookingId
    );

    if(!found){

        alert("Không tìm thấy biên lai");
        return;
    }

    localStorage.setItem(
        "latestReceipt",
        JSON.stringify(found)
    );

    window.location.href =
    "receipt.html";
}

// =========================
// HOME
// =========================

function goHome(){

    window.location.href =
    "Home.html";
}