let menuButton = document.getElementById('hamburger');
let sidebar = document.getElementById('sidebar');
let dataBody = document.getElementById('data-main');
let scrollHandler = document.getElementById('scrollHandler');


$(window).scroll(function () {
  if ($(window).scrollTop() > 700) {
    $('#sidebar').addClass('navbar-fixed')
    $('#legend').addClass('navbar-fixed')
  }
  if ($(window).scrollTop() < 700) {
    $('#sidebar').removeClass('navbar-fixed');
  }
});


let toggleClass = function () {
  menuButton.classList.toggle('is-active');
  sidebar.classList.toggle('open');
  dataBody.style.marginLeft.toggle = '300px';

  if (dataBody.style.marginLeft != '300px') {
    dataBody.style.width = 'Calc(100vw - 75px)';
  }
};

let scrollDown = function () {
  window.scrollTo(0, 700);
};

menuButton.addEventListener('click', toggleClass);
scrollHandler.addEventListener('click', scrollDown);
