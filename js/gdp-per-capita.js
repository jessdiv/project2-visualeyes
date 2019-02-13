let gdp_margin = { left:80, right:100, top:50, bottom:100 };
let gdp_height = 500 - gdp_margin.top - gdp_margin.bottom;
let gdp_width = 800 - gdp_margin.left - gdp_margin.right;
let filteredData;
let nestedData;
let countries = ['all'];
let allSelected = true;

let gdp_svg = d3.select('#chart-area-3')
  .append('svg')
  .attr('width', gdp_width + gdp_margin.left + gdp_margin.right)
  .attr('height', gdp_height + gdp_margin.top + gdp_margin.bottom)

let gdp_g = gdp_svg.append('g')
  .attr('transform', 'translate(' + gdp_margin.left + ', ' + gdp_margin.top + ')')
  .attr('class', 'g-parent')

//////////// Scales ////////////
let x = d3.scaleLinear()
  .range([0, gdp_width])
  .domain([1960, 2017])

let y = d3.scaleLinear()
  .range([gdp_height, 0])
  .domain([60, 70000])

// let colorScale = d3.scaleOrdinal()
//   .domain(['Australia', 'Brazil', 'Canada', 'China', 'France', 'India', 'Ireland', 'Italy', 'Mexico', 'Nigeria', 'Netherlands', 'New Zealand', 'Thailand', 'United Kingdom', 'United States'])
//   .range(['blanchedalmond', 'deeppink', 'lightblue', 'aquamarine', 'deepskyblue', 'coral', 'darkblue', 'thistle', 'darkseagreen', 'darkcyan', 'lightcoral', 'indigo', 'palevioletred', 'crimson', 'steelblue']);

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

    filteredData = data.filter(function(d) {
      if (d.Year !== 2018) {
        return d;
      }
    });

    // Nest data by country
    nestedData = d3.nest()
      .key(function(d) {
        return d.Country;
      })
      .entries(filteredData)

    console.log(nestedData);

    //////////// Initialise Tooltip ////////////
    // const tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .html(function(d) {
    //     // console.log(d);
    //     let text = "<strong>Country</strong>: " + d.key + "<br />";
    //     text += "<strong>Year</strong>: " + this.Year + "<br />";
    //     text += "<strong>GDP Per Capita</strong>: " + d['GDP/Capita'] + "<br />";
    //     return text;
    //   })
    // svg.call(tip);

    let xAxis = gdp_g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + gdp_height + ')')
      .call(xAxisCall.scale(x))

    let yAxis = gdp_g.append('g')
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
    gdp_g.append('text')
      .attr('class', 'axis-label')
      .attr('x', gdp_width / 2)
      .attr('y', '400')
      .attr('fill', 'white')
      .attr('font-family', 'Raleway')
      .attr('font-size', '18px')
      .attr('text-anchor', 'middle')
      .text('Year')

    let lines = gdp_g.selectAll('.line')
      .data(nestedData)
      .enter()
        .append('path')
          .attr('class', 'line')
          // .attr('stroke', function(d) {
          //   return colorScale(d.key);
          // })
          // .on('mouseover', tip.show)
          // .on('mouseout', tip.hide)
          .attr('d', function(d) {
            return line(d.values)
          });


    function update(data) {
      // country = $('#country-select').val();
      // console.log(country);

      let updatedData = data.filter(function(d) {
        if (countries.indexOf('all') !== -1) {
          return true;
        } else {
          for (var i = 0; i < countries.length; i++) {
            let currentCountry = countries[i]
            return d.Country === currentCountry;
          }
          // return d.Country === country;
        }
      });
      console.log("nested data", updatedData);

      updatedData = updatedData.filter(function(d) {
        if (d.Year !== 2018) {
          return d;
        }
      });
      console.log(updatedData);

      gdp_g.selectAll('.line')
        .remove();

      gdp_g.selectAll('.line')
        .data(function() {
          if (allSelected === true || countries.length > 1) {
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
            if (allSelected === true) {
              return line(d.values);
            } else if (countries.length > 1) {
              return line(d.values);
            } else if (countries.length === 1) {
              return line(d);
            }
          });
    }

    $('#country-select').on('change', function() {
      update(data);
    })

    $('#all').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = true
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
        allSelected = false;
      }
      update(data)
    })

    $('#Australia').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data);
    })

    $('#Brazil').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#Canada').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#China').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#France').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#India').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#Ireland').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#Italy').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#Mexico').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#Nigeria').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#Netherlands').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#New Zealand').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#Thailand').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#United Kingdom').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

    $('#United States').on('change', function() {
      if (this.checked) {
        countries.push(this.value);
        allSelected = false
      } else {
        let index = countries.indexOf(this.value);
        countries.splice(index, 1);
      }
      update(data)
    })

});
