const airports = [
  ["HAN", "Hà Nội"],
  ["SGN", "Hồ Chí Minh"],
  ["DAD", "Đà Nẵng"],
  ["CXR", "Nha Trang"],
  ["PQC", "Phú Quốc"],
  ["HPH", "Hải Phòng"],
  ["BMV", "Buôn Ma Thuột"],
  ["PXU", "Pleiku"],
  ["DLI", "Đà Lạt"],
  ["VCA", "Cần Thơ"]
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
|--------------------------------------------------------------------------
| FIX 1:
| Database chỉ reset khi qua ngày
|--------------------------------------------------------------------------
*/

const todayKey = new Date().toISOString().split("T")[0];

const savedDate = localStorage.getItem("fakeFlightDBDate");
const savedDB = localStorage.getItem("fakeFlightDB");

/*
|--------------------------------------------------------------------------
| FIX 2:
| Random time ổn định
|--------------------------------------------------------------------------
*/

function randomTime(seed) {

  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash += seed.charCodeAt(i);
  }

  const hour = (hash % 18) + 5; // 05h -> 22h
  const minute = (hash * 7) % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

/*
|--------------------------------------------------------------------------
| FIX 3:
| Ngày bay KHÔNG nhỏ hơn ngày tìm kiếm
|--------------------------------------------------------------------------
*/

function generateDate(searchDate, index) {

  // ví dụ: 2026-05-10
  const base = new Date(searchDate);

  // random từ 0 -> 20 ngày sau
  const addDays = index % 20;

  base.setDate(base.getDate() + addDays);

  return base.toISOString().split("T")[0];
}

function randomPrice(seed) {

  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash += seed.charCodeAt(i);
  }

  return ((hash % 8) + 2) * 1000000;
}

function generateFlights(count = 5000) {

  const flights = [];

  /*
  |--------------------------------------------------------------------------
  | lấy ngày user search
  |--------------------------------------------------------------------------
  */

  const searchDate =
    localStorage.getItem("searchDate") ||
    new Date().toISOString().split("T")[0];

  for (let i = 0; i < count; i++) {

    let from = airports[randomInt(0, airports.length - 1)];
    let to = airports[randomInt(0, airports.length - 1)];

    while (to[0] === from[0]) {
      to = airports[randomInt(0, airports.length - 1)];
    }

    /*
    |--------------------------------------------------------------------------
    | ngày bay luôn >= ngày tìm
    |--------------------------------------------------------------------------
    */

    const date = generateDate(searchDate, i);

    /*
    |--------------------------------------------------------------------------
    | giờ cố định theo route
    |--------------------------------------------------------------------------
    */

    const seed =
      from[0] +
      to[0] +
      i;

    const depClock = randomTime(seed);

    /*
    |--------------------------------------------------------------------------
    | giờ đến
    |--------------------------------------------------------------------------
    */

    const depHour = Number(depClock.substring(0, 2));
    const depMinute = Number(depClock.substring(3, 5));

    let arrHour = depHour + 1;
    let arrMinute = depMinute + 45;

    if (arrMinute >= 60) {
      arrMinute -= 60;
      arrHour += 1;
    }

    if (arrHour >= 24) {
      arrHour -= 24;
    }

    const arrClock =
      `${String(arrHour).padStart(2, "0")}:${String(arrMinute).padStart(2, "0")}:00`;

    const depTime = `${date}T${depClock}`;
    const arrTime = `${date}T${arrClock}`;

    const flightCode = `VN${1000 + i}`;

    flights.push({

      id: flightCode,

      airline_iata: "VN",

      flight_iata: flightCode,

      dep_iata: from[0],
      dep_city: from[1],

      arr_iata: to[0],
      arr_city: to[1],

      dep_time: depTime,
      arr_time: arrTime,

      price: randomPrice(flightCode)
    });
  }

  return flights;
}

/*
|--------------------------------------------------------------------------
| CACHE DATABASE
|--------------------------------------------------------------------------
*/

let flightsDB = [];

if (savedDate === todayKey && savedDB) {

  flightsDB = JSON.parse(savedDB);

} else {

  flightsDB = generateFlights(5000);

  localStorage.setItem(
    "fakeFlightDB",
    JSON.stringify(flightsDB)
  );

  localStorage.setItem(
    "fakeFlightDBDate",
    todayKey
  );
}

export { flightsDB };