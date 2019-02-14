let stopTime = document.getElementById('scatter_pause');
let startTime = document.getElementById('scatter_start');

let Smargin = { left: 80, right: 20, top: 50, bottom: 100 };
var time = 0;
let Swidth = 800 - Smargin.left - Smargin.right;
let Sheight = 600 - Smargin.top - Smargin.bottom;

// Append Canvas to ds1
var g = d3.select('#ds2')
    .append('svg')
        .attr('width', Swidth + Smargin.left + Smargin.right)
        .attr('height', Sheight + Smargin.top + Smargin.bottom)
    .append('g')
        .attr('transform', 'translate(' + Smargin.left + ', ' + Smargin.top + ')');

var tip = d3.tip().attr('class', 'd3-tip')
    .html(function (d) {
      return `${d.country_name}`;
    });

g.call(tip);

// X Scale
var X = d3.scaleLinear()
    .range([0, Swidth])
    .domain([-5000, 69331]);

// Y Scale
var Y = d3.scaleLinear()
    .range([Sheight, 0])
    .domain([20, 82]);

// Area
var area = d3.scaleLinear()
    .range([25 * Math.PI, 1500 * Math.PI])
    .domain([0, 1500000000]);

// Assign A Color to Continent
var continentColor = d3.scaleOrdinal()
  .domain(['Thailand', 'United States', 'Australia', 'Brazil', 'Canada', 'China', 'France', 'United Kingdom', 'India', 'Ireland', 'Italy', 'Mexico', 'Nigeria', 'Netherlands', 'New Zealand'])
  .range(['#e5446d', '#BC8F8F', '#ffba49', '#20a39e', '#DC143C', '#663399', '#f2e3bc', '#ff8552', '#f76f8e', '#14cc60', '#931621', '#87CEEB', '#C0C0C0', '#d1f5ff', '#7d53de']);

// X Axis
var scatter_xAxisCall = d3.axisBottom(X)
    .tickValues([0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000])
    .tickFormat(d3.format('$'))
    .ticks(16);
g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + Sheight + ')')
    .call(scatter_xAxisCall);

// Y Axis
var scatter_yAxisCall = d3.axisLeft(Y)
    .tickFormat(function (d) { return +d; })
g.append('g')
    .attr('class', 'y axis')
    .call(scatter_yAxisCall);

// X Label
g.append('text')
    .attr('y', Sheight + 50)
    .attr('x', Swidth / 2)
    .attr('font-size', '20px')
    .attr('class', 'axis-title')
    .attr('color', 'black')
    .attr('text-anchor', 'middle')
    .text('GDP/Capita');

// Y Label
g.append('text')
    .attr('y', -60)
    .attr('x', -(Sheight / 2))
    .attr('font-size', '20px')
    .attr('class', 'axis-title')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Life Expectancy');

// Time Label
var timeLabel = g.append('text')
    .attr('y', Sheight - (Sheight / 2))
    .attr('x', Swidth - (Swidth / 2))
    .attr('font-size', '120px')
    .attr('opacity', '0.2')
    .attr('text-anchor', 'middle')
    .text('1960');

// Load CSV Data
d3.csv('https://visualeyes-server.herokuapp.com/statistics.csv').then(function (data) {
    const dataByYear = [];
    for (let i = 0; i < data.length; i += 15) {
      dataByYear.push(data.slice(i, i + 15));
    }

    // Clean data
    dataByYear.forEach(function (year) {
      year.forEach(function (d) {
        d.life_expectancy = +d.life_expectancy;
        d.population = +d.population.replace(/,/g, '');
        d.gdp_capita = +d.gdp_capita.replace(/,/g, '');
      });
    });

    let update = function (data) {
      // console.log('update', data);
      let updatedData = data.filter(function(d) {
        if (allSelectedGlobal) {
          return true;
        } else {
          for (var i = 0; i < countriesGlobal.length; i++) {
            if (d.country_name === countriesGlobal[i]) {
              return d;
            }
          }
        }
      })

      updatedData.forEach(function (d) {
        // console.log('iterating', d);
        if (! d.population) return;
        let t = d3.transition()
            .duration(250);

        var circles = g.selectAll('circle').data(updatedData, function (d) {
          return d.country_name;
        });

        circles.enter()
            .append('circle')
            .attr('class', 'enter')
            .attr('fill', function (d) { return continentColor(d.country_name); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .merge(circles)
            .transition(t)
                .attr('cy', function (d){ return Y(d.life_expectancy); })
                .attr('cx', function (d) { return X(d.gdp_capita); })
                .attr('r', function (d){ return Math.sqrt(area(d.population) / Math.PI); })
                .style('opacity', '0.8')

        circles.exit()
            .remove();

        timeLabel.text(+(time + 1960));
      });
    };

    startTime.addEventListener('click', setTime);
    stopTime.addEventListener('click', killTimer);

    let timerId;

    function setTime() {
      timerId = setInterval(function () {
        time = (time < 58) ? time + 1 : 0;
        update(dataByYear[time]);
        if(time === 0) {
        }
      }, 500);
    } // End Timer function

    function killTimer() {
      clearInterval(timerId);
    }

    update(dataByYear[0]);
  });
