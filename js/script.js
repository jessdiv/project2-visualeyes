let menuButton = document.getElementById('hamburger');
let sidebar = document.getElementById('sidebar')
let dataBody = document.getElementById("data-main");

let toggleClass = function () {
  menuButton.classList.toggle("is-active");
  sidebar.classList.toggle("open");
  dataBody.style.marginLeft.toggle = "275px";

  if(dataBody.style.marginLeft != "275px") {
    dataBody.style.width = 'Calc(100vw - 75px)';
  }
};

menuButton.addEventListener('click', toggleClass);
