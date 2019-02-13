
// ----------------------- Start Scatter Plot  ----------------------- \\

let Smargin = { left: 80, right: 20, top: 50, bottom: 100 };

let Swidth = 800 - Smargin.left - Smargin.right;
let Sheight = 600 - Smargin.top - Smargin.bottom;

// Append Canvas to ds1
var g = d3.select('#ds2')
    .append('svg')
        .attr('width', Swidth + Smargin.left + Smargin.right)
        .attr('height', Sheight + Smargin.top + Smargin.bottom)
    .append('g')
        .attr('transform', 'translate(' + Smargin.left + ', ' + Smargin.top + ')');

var time = 0;

// X Scale
var X = d3.scaleLinear()
    .range([0, Swidth])
    .domain([-5000, 69331]);

// Y Scale
var Y = d3.scaleLinear()
    .range([Sheight, 0])
    .domain([31, 82]);

// Area
var area = d3.scaleLinear()
    .range([25 * Math.PI, 1500 * Math.PI])
    .domain([0, 1500000000]);

var continentColor = d3.scaleOrdinal().range(['#ffba49', '#20a39e', '#ef5b5b', '#912f56', '#f2e3bc', '#ff8552', '#f76f8e', '#14cc60', '#931621', '#b33951', '#40434e', '#d1f5ff', '#7d53de', '#e5446d', '#000']);

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
    .tickFormat(function (d) { return +d; });
g.append('g')
    .attr('class', 'y axis')
    .call(scatter_yAxisCall);

// X Label
g.append('text')
    .attr('y', Sheight + 50)
    .attr('x', Swidth / 2)
    .attr('font-size', '20px')
    .attr('color', 'black')
    .attr('text-anchor', 'middle')
    .text('GDP/Capita');

// Y Label
g.append('text')
    .attr('y', -60)
    .attr('x', -(Sheight / 2))
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Life Expectancy');

// Time Label
var timeLabel = g.append('text')
    .attr('y', Sheight - 10)
    .attr('x', Swidth - 40)
    .attr('font-size', '40px')
    .attr('opacity', '0.4')
    .attr('text-anchor', 'middle')
    .text('1960');

// Load CSV Data
d3.csv('../resources/flat_data.csv').then(function (data) {
    const dataByYear = [];
    for (let i = 0; i < data.length; i += 15) {
      dataByYear.push(data.slice(i, i + 15));
    }

    // console.log(dataByYear);

    // Clean data
    dataByYear.forEach(function (year) {
      year.forEach(function (d) {
        d['Life Expectancy'] = +d['Life Expectancy'];
        d['Total Population'] = +d['Total Population'].replace(/,/g, '');
        d['GPD/Capita'] = +d['GPD/Capita'].replace(/,/g, '');
        d['GDP (Current USD)'] = +d['GDP (Current USD)'].replace(/,/g, '');
      });
    });

    let update = function (data) {
      // console.log('update', data);
      data.forEach(function (d) {
        // console.log('iterating', d);
        if (! d['Total Population']) return;
        let t = d3.transition()
            .duration(1500);

        let circles = g.selectAll('circle').data(data, function (d) {
          return d.Country;
        });

        circles.exit()
            .attr('class', 'exit')
            .remove();

        circles.enter()
            .append('circle')
            .attr('class', 'enter')
            .attr('fill', function (d) { return continentColor(d['GPD/Capita']); })
            .merge(circles)
            .transition(t)
                .attr('cy', function (d){ return Y(d['Life Expectancy']); })
                .attr('cx', function (d) { return X(d['GPD/Capita']); })
                .attr('r', function (d){ return Math.sqrt(area(d['Total Population']) / Math.PI); });

        timeLabel.text(+(time + 1960));
      });

      setTimeout(function () {
        // console.log('setting timeout');
        time = (time < 58) ? time + 1 : 0;
        update(dataByYear[time]);
      }, 500);
    };
    update(dataByYear[0]);
  });
