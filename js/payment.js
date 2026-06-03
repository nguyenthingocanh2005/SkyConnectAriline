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

// =========================
// LẤY DATA
// =========================

const flight = JSON.parse(
    localStorage.getItem("selectedFlight")
);

const passenger = JSON.parse(
    localStorage.getItem("passengerInfo")
);

if (!flight || !passenger) {

    alert("Thiếu dữ liệu đặt vé");
    window.location.href = "index.html";
}

// =========================
// SPLIT DATETIME
// =========================

function splitDateTime(dateTime) {

    if (!dateTime) {

        return {
            date: "--",
            time: "--:--"
        };
    }

    const parts =
        dateTime.split("T");

    return {

        date: parts[0],

        time: parts[1]
            ? parts[1].substring(0, 5)
            : "--:--"
    };
}

const dep =
    splitDateTime(flight.dep_time);

const arr =
    splitDateTime(flight.arr_time);

// =========================
// RENDER THÔNG TIN VÉ
// =========================

document.getElementById("depAirport")
.innerText =
cityMap[flight.dep_iata];

document.getElementById("arrAirport")
.innerText =
cityMap[flight.arr_iata];

document.getElementById("depTime")
.innerText =
dep.time;

document.getElementById("arrTime")
.innerText =
arr.time;

document.getElementById("depDate")
.innerText =
dep.date;

document.getElementById("arrDate")
.innerText =
arr.date;

// passenger

document.getElementById(
    "passengerInfo"
).innerHTML = `

<div><strong>Họ tên:</strong>
${passenger.fullname}</div>

<div><strong>SĐT:</strong>
${passenger.phone}</div>

<div><strong>Email:</strong>
${passenger.email}</div>

<div><strong>Số vé:</strong>
${passenger.ticketCount}</div>

`;

// =========================
// TỔNG TIỀN
// =========================

const totalPrice =
    passenger.totalPrice
    || 2500000;

document.getElementById(
    "totalPrice"
).innerText =
totalPrice.toLocaleString()
+ "đ";

// fake ETH demo

const ethPrice =
(
    totalPrice / 100000000
).toFixed(5);

document.getElementById(
    "ethPrice"
).innerText =
`${ethPrice} ETH`;

// =========================
// SMART CONTRACT CONFIG
// =========================

// THAY BẰNG CONTRACT ADDRESS
const CONTRACT_ADDRESS =
"0xd9145CCE52D386f254917e481eB44e9943F39138";

// THAY BẰNG ABI TỪ REMIX
const ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_bookingId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_passengerName",
                "type": "string"
            }
        ],
        "name": "payTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

// =========================
// WALLET
// =========================

let walletAddress = "";

// =========================
// CONNECT METAMASK
// =========================

document.getElementById(
    "btnConnect"
).onclick = async () => {

    try {

        if (!window.ethereum) {

            alert(
                "Vui lòng cài MetaMask"
            );

            return;
        }

        const accounts =
        await window.ethereum
        .request({

            method:
            "eth_requestAccounts"
        });

        walletAddress =
            accounts[0];

        document.getElementById(
            "walletAddress"
        ).style.display =
        "block";

        document.getElementById(
            "walletAddress"
        ).innerText =
        "Wallet: "
        + walletAddress;

        document.getElementById(
            "btnPay"
        ).style.display =
        "block";

    } catch (err) {

        console.log(err);

        alert(
            "Không thể kết nối MetaMask"
        );
    }
};

// =========================
// PAY WITH SMART CONTRACT
// =========================

document.getElementById(
    "btnPay"
).onclick = async () => {

    try {

        if (!window.ethereum) {

            alert(
                "MetaMask chưa được cài"
            );

            return;
        }

        // provider
        const provider =
        new ethers.BrowserProvider(
            window.ethereum
        );

        const signer =
        await provider.getSigner();

        // contract
        const contract =
        new ethers.Contract(

            CONTRACT_ADDRESS,
            ABI,
            signer
        );

        // booking id
        const bookingId =
        "BK"
        + Date.now();

        // call smart contract
        const tx =
        await contract.payTicket(

            bookingId,

            passenger.fullname,

            {

                value:
                ethers.parseEther(
                    ethPrice.toString()
                )
            }
        );

        alert(
            "Đang xử lý giao dịch..."
        );

        await tx.wait();

        // ===================
        // TẠO RECEIPT
        // ===================

        const receipt = {

            bookingId,

            txHash:
            tx.hash,

            wallet:
            walletAddress,

            paymentTime:
            new Date()
            .toLocaleString(),

            flight,

            passenger,

            totalPrice,

            ethPrice
        };

        // receipt hiện tại
        localStorage.setItem(

            "latestReceipt",

            JSON.stringify(
                receipt
            )
        );

        // ===================
        // LỊCH SỬ
        // ===================

        let history =
        JSON.parse(

            localStorage.getItem(
                "bookingHistory"
            ) || "[]"
        );

        history.unshift(
            receipt
        );

        localStorage.setItem(

            "bookingHistory",

            JSON.stringify(
                history
            )
        );

        alert(
            "Thanh toán thành công!"
        );

        window.location.href =
        "receipt.html";

    } catch (err) {

        console.log(err);

        alert(
            "Thanh toán thất bại"
        );
    }
};