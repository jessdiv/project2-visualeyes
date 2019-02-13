// Define margins, dimensions, and some line colors
let margin = {top: 10, right: 150, bottom: 50, left: 100};
let width = 800 - margin.left - margin.right;
let height = 800 - margin.top - margin.bottom;
let filteredData;
let nestedData;
let country = 'all';

let svg = d3.select('#chart-area-3')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .style('background-color', 'pink')
let g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
  .attr('class', 'g-parent')

//////////// Scales ////////////
let x = d3.scaleLinear()
  .range([0, width])
  .domain([1960, 2017])

let y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 1500000000])

let xAxisCall = d3.axisBottom()
  .ticks(15)
  // .tickFormat(function(d) {
  //   return +d
  // })

  let yAxisCall = d3.axisLeft()
    .ticks(15)


let line = d3.line()
  .x(function(d) { return x(d.Year); })
  .y(function(d) { return y(+d['Total_Population']);})

//////////// IMPORT CSV ////////////
d3.csv("../resources/alldata_flat.csv").then(function(data) {
  data.forEach(function(d) {
    d.Year = +d.Year;
    d.Total_Population = +d.Total_Population.split(',').join('');
  });

  filteredData = data.filter(function(d) {
    if (d.Year !== 2018) {
      console.log(d);
      return d;
    }
  });

  // Nesteed data by country
  nestedData = d3.nest()
    .key(function(d) {
      return d.Country;
    })
     .entries(filteredData)

//////////// Initialise Tooltip ////////////
const tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
        // console.log(d);
        let text = "<strong>Country</strong>: " + d.key + "<br />";
        text += "<strong>Year</strong>: " + this.Year + "<br />";
        text += "<strong>Total Population</strong>: " + d['Total_Population'] + "<br />";
        return text;
      })
    svg.call(tip);

let xAxis = g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxisCall.scale(x))

    let yAxis = g.append('g')
      .attr('class', 'y axis')
      .call(yAxisCall.scale(y))

    // Y Axis Label
    yAxis.append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .attr('fill', 'white')
      .attr('font-family', 'Raleway')
      .style('text-anchor', 'end')

    // X Axis Label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', width / 2)
      .attr('y', '400')
      .attr('fill', 'white')
      .attr('font-family', 'Raleway')
      .attr('font-size', '18px')
      .attr('text-anchor', 'middle')

    let lines = g.selectAll('.line')
      .data(nestedData)
      .enter()
        .append('path')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .attr('class', 'line')
        .attr('fill', 'none')
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .attr('d', function(d) {
            return line(d.values)
          });

    function update(data) {
      country = $('#country-select').val();
      console.log(country);

      let updatedData = data.filter(function(d) {
        if (country === 'all') {
          return true;
        } else {
          return d.Country === country;
        }
      });

      updatedData = updatedData.filter(function(d) {
        if (d.Year !== 2018) {
          return d;
        }
      });
      console.log(updatedData);

      g.selectAll('.line')
        .remove();

      g.selectAll('.line')
        .data(function() {
          if (country === 'all') {
            return nestedData;
          } else {
            return [updatedData];
          }
        })
        .enter()
          .append('path')
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('d', function(d) {
            if (country === 'all') {
              return line(d.values);
            } else {
              return line(d);
            }
          });
    }
});
