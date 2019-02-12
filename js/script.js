let menuButton = document.getElementById('hamburger');
let sidebar = document.getElementById('sidebar')
let dataBody = document.getElementById('data-main');
let scrollHandler = document.getElementById('scrollHandler');

let toggleClass = function () {
  menuButton.classList.toggle('is-active');
  sidebar.classList.toggle('open');
  dataBody.style.marginLeft.toggle = '300px';

  if(dataBody.style.marginLeft != '300px') {
    dataBody.style.width = 'Calc(100vw - 75px)';
  }
};

let scrollDown = function () {
  window.scrollTo(0, 800);
}

menuButton.addEventListener('click', toggleClass);
scrollHandler.addEventListener('click', scrollDown);


// ----------------------- Start Scatter Plot  ----------------------- \\

/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var g = d3.select("#ds1")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr('color', 'black')
    .attr("text-anchor", "middle")
    .text("Country");

// Y Label
g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy");

d3.csv("../resources/flat_data.csv").then(function(data){
  let newArr = data.slice(0, 15);
    console.log(newArr);

    // Clean data
    newArr.forEach(function(d) {
        d['Life Expectancy'] = +d['Life Expectancy'];
    });

    // X Scale
    var x = d3.scaleBand()
        .domain(newArr.map(function(d){ return d.Country }))
        .range([0, width])
        .padding(0.2);

    // Y Scale
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d['Life Expectancy'] })])
        .range([height, 0]);

    var area = d3.scaleLinear()
        .range([15*Math.PI, 800*Math.PI])
        .domain([0, 100]);

    var continentColor = d3.scaleOrdinal().range(['#ffba49', '#20a39e', '#ef5b5b', '#912f56', '#f2e3bc', '#ff8552', '#f76f8e', '#14cc60', '#931621', '#b33951', '#40434e', '#d1f5ff', '#7d53de', '#e5446d', '#000']);

    // X Axis
    var xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height +")")
        .call(xAxisCall);

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return d; });
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    // Bars
    var circle = g.selectAll("circle")
        .data(newArr)

    circle.enter()
        .append("circle")
            .attr("cy", function(d){ return y(d['Life Expectancy']); })
            .attr("cx", function(d){ return x(d.Country) + x.bandwidth() /2 })
            .attr("r", function(d){ return Math.sqrt(area(d['Life Expectancy']) / Math.PI) })
            .attr("fill", function(d) { return continentColor(d.Country); })

})
