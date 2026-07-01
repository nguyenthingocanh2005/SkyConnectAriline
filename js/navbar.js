console.log(window.location.href);
console.log("header url =", new URL("header.html", window.location.href).href);
document.addEventListener("DOMContentLoaded", function () {

    fetch("header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;

            updateDate();
            setInterval(updateDate, 1000);
            navbarScroll();
            checkLoginUI();
        })
        .catch(err => console.log(err));

    // Load footer
    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });    
});

function updateDate() {

    let box = document.getElementById("dateDisplay");

    if (!box) {
        console.log("Không tìm thấy dateDisplay");
        return;
    }

    let currentDate = new Date();

    box.innerHTML =
        "Site of the Day - " +
        currentDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
}

function navbarScroll() {

    let lastScrollTop = 0;
    let navbar = document.querySelector(".navbar");

    if (!navbar) return;

    window.addEventListener("scroll", function () {

        let scrollTop =
            window.pageYOffset ||
            document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            navbar.style.top = "-170px";
        } else {
            navbar.style.top = "0";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

function checkLoginUI() {

    const waitFirebase = setInterval(() => {

        if (window.auth && window.onAuthStateChanged) {

            clearInterval(waitFirebase);

            window.onAuthStateChanged(window.auth, (user) => {

                let box = document.getElementById("userArea");

                if (!box) return;

                if (user) {

                    box.innerHTML = `

                    <div class="user-dropdown">

                        <div class="user-info" onclick="toggleUserMenu()">

                            <img 
                                src="${user.photoURL}" 
                                class="user-avatar"
                            >

                            <span class="user-name">
                                ${user.displayName}
                            </span>

                            <span class="arrow">
                                ▼
                            </span>

                        </div>

                        <div class="user-menu" id="userMenu">

                            <a href="history.html">
                                📜 Lịch sử đặt vé
                            </a>

                            <button onclick="logoutUser()">
                                🚪 Thoát đăng nhập
                            </button>

                        </div>

                    </div>

                    `;

                } else {

                    box.innerHTML = `
                        <a class="nav-link" href="Dangnhap.html">Đăng nhập</a>
                    `;
                }

            });

        }

    }, 300);
}

function logoutUser() {
    window.signOutGoogle(window.auth);
}

function toggleUserMenu(){

    const menu =
    document.getElementById("userMenu");

    if(!menu) return;

    menu.classList.toggle("show-menu");
}

// click ngoài để đóng
document.addEventListener("click", function(e){

    const dropdown =
    document.querySelector(".user-dropdown");

    const menu =
    document.getElementById("userMenu");

    if(!dropdown || !menu) return;

    if(!dropdown.contains(e.target)){

        menu.classList.remove("show-menu");
    }
});
