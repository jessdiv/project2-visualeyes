let margin = { left:80, right:100, top:50, bottom:100 };
let height = 500 - margin.top - margin.bottom;
let width = 800 - margin.left - margin.right;
let filteredData;
let nestedData;
let countries = ['all'];

$('#Australia').on('select', function() {
  countries.push(this.val());
})

let svg = d3.select('#chart-area-3')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

let g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
  .attr('class', 'g-parent')

//////////// Scales ////////////
let x = d3.scaleLinear()
  .range([0, width])
  .domain([1960, 2017])

let y = d3.scaleLinear()
  .range([height, 0])
  .domain([60, 70000])

let xAxisCall = d3.axisBottom()
  .ticks(10)
  .tickFormat(function(d) {
    return +d
  })

let yAxisCall = d3.axisLeft()
  .ticks(6)
  .tickFormat(function(d) {
    return "$" + d;
  })

let line = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(+d['GDP/Capita']); })

//////////// IMPORT CSV ////////////
  d3.csv('../resources/alldata_flat.csv').then(function(data) {

    // Format year and GDP as integers
    data.forEach(function(d) {
      d.Year = +d.Year;
      d['GDP/Capita'] = +d['GDP/Capita'];
      // console.log(`The GDP per Capita in ${d['Year']} for ${d['Country']} was ${d['GDP/Capita']}.`);
    });

    // console.log(data);
    filteredData = data.filter(function(d) {
      if (d.Year !== 2018) {
        return d;
      }
    });

    // console.log(filteredData);

    // Nest data by country
    nestedData = d3.nest()
      .key(function(d) {
        return d.Country;
      })
      .entries(filteredData)

    console.log(nestedData);

    //////////// Initialise Tooltip ////////////
    const tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
        // console.log(d);
        let text = "<strong>Country</strong>: " + d.key + "<br />";
        text += "<strong>Year</strong>: " + this.Year + "<br />";
        text += "<strong>GDP Per Capita</strong>: " + d['GDP/Capita'] + "<br />";
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
      .text('GDP per Capita')

    // X Axis Label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', width / 2)
      .attr('y', '400')
      .attr('fill', 'white')
      .attr('font-family', 'Raleway')
      .attr('font-size', '18px')
      .attr('text-anchor', 'middle')
      .text('Year')

    let lines = g.selectAll('.line')
      .data(nestedData)
      .enter()
        .append('path')
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
          // .on('mouseover', tip.show)
          // .on('mouseout', tip.hide)
          .attr('d', function(d) {
            if (country === 'all') {
              return line(d.values);
            } else {
              return line(d);
            }
          });

    }
    $('#country-select').on('change', function() {
      update(data);
    })

});
