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
  window.scrollTo(0, 750);
};

menuButton.addEventListener('click', toggleClass);
scrollHandler.addEventListener('click', scrollDown);

let countriesGlobal = ['all'];
let allSelectedGlobal = true;

d3.csv('https://visualeyes-server.herokuapp.com/statistics.csv').then(function(data) {

  // Format data as integers
  data.forEach(function(d) {
    d.year = +d.year;
    d.gdp_capita = +d.gdp_capita;
    d.population = +d.population;
    d.life_expectancy = +d.life_expectancy;
    d.area = +d.area;
  });

  loadGraphGDP(data);
  loadScatterplot(data);
  loadPopulationBubbles(data);
  loadGraphPopulation(data);
  loadAreaBubbles(data);
});
