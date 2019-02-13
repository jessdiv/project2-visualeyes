$(document).ready(function(){

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
      let tooltipGDP = d3.select('#chart-area-3')
        .append('div')
        .data(nestedData)
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')

      let tooltip_mouseoverGDP = function(e) {
        tooltipGDP.style('visibility', 'visible')
          .text(function() {
            return `Country: ${ e.key }`
          })
      }

      let tooltip_mouseoutGDP = function() {
        tooltipGDP.style('visibility', 'hidden')
      }

      let tooltip_mousemoveGDP = function() {
        tooltipGDP.style('top', ( event.pageY - 10) + 'px')
          .style('left', ( event.pageX + 10) + 'px')
      }

      //////////// AXES ////////////
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
        .attr('fill', 'black')
        .attr('font-family', 'Raleway')
        .style('text-anchor', 'end')
        .text('GDP per Capita (USD)')

      // X Axis Label
      gdp_g.append('text')
        .attr('class', 'axis-label')
        .attr('x', gdp_width / 2)
        .attr('y', '400')
        .attr('fill', 'black')
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
            .attr('d', function(d) {
              return line(d.values)
            })
            .on('mouseover', tooltip_mouseoverGDP)
            .on('mouseout', tooltip_mouseoutGDP)
            .on('mousemove', tooltip_mousemoveGDP)


      function update(data) {

        let updatedData = nestedData.filter(function(d) {
          if (countries.indexOf('all') !== -1) {
            return true;
          } else {
            for (var i = 0; i < countries.length; i++) {
              if (d.key === countries[i]) {
                console.log(`${countries[i]} is in the selected array`);
                // console.log(d.values);
                return d.values;
              }
            }
            // return d.Country === country;
          }
        });

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
            if (allSelected === true) {
              return nestedData;
            } else {
              return updatedData;
            }
          })
          .enter()
            .append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .on('mouseover', tooltip_mouseoverGDP)
            .on('mouseout', tooltip_mouseoutGDP)
            .on('mousemove', tooltip_mousemoveGDP)
            .attr('d', function(d) {
              if (countries.length === 1) {
                return line(d.values);
              } else {
                return line(d.values);
              }
            });
      }

      function removeAll() {
        let index = countries.indexOf('all');
        if (index !== -1) {
          countries.splice(index, 1);
        }
        $('#all').prop('checked', false);
      }

      //////////// EVENT HANDLERS ////////////

      $('#country-select').on('change', function() {
        update(data);
      })

      $('#all').on('change', function() {
        if (this.checked) {
          countries = ['all']
          allSelected = true
          $('#Australia').prop('checked', false);
          $('#Brazil').prop('checked', false);
          $('#Canada').prop('checked', false);
          $('#China').prop('checked', false);
          $('#France').prop('checked', false);
          $('#India').prop('checked', false);
          $('#Ireland').prop('checked', false);
          $('#Italy').prop('checked', false);
          $('#Mexico').prop('checked', false);
          $('#Nigeria').prop('checked', false);
          $('#Netherlands').prop('checked', false);
          $('#New-Zealand').prop('checked', false);
          $('#Thailand').prop('checked', false);
          $('#United-Kingdom').prop('checked', false);
          $('#United-States').prop('checked', false);
        } else {
          let index = countries.indexOf(this.value);
          countries.splice(index, 1);
          allSelected = false;
        }
        update(data)
      })

      $('#Australia').on('change', function() {
        if (this.checked) {
          removeAll();
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
          removeAll();
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
          removeAll();
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
          removeAll();
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
          removeAll();
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
          removeAll();
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
          removeAll();
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
          removeAll();
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
          removeAll();
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
          removeAll();
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
          removeAll();
          countries.push(this.value);
          allSelected = false
        } else {
          let index = countries.indexOf(this.value);
          countries.splice(index, 1);
        }
        update(data)
      })

      $('#New-Zealand').on('change', function() {
        if (this.checked) {
          removeAll();
          countries.push('New Zealand');
          allSelected = false
        } else {
          let index = countries.indexOf(this.value);
          countries.splice(index, 1);
        }
        update(data)
      })

      $('#Thailand').on('change', function() {
        if (this.checked) {
          removeAll();
          countries.push(this.value);
          allSelected = false
        } else {
          let index = countries.indexOf(this.value);
          countries.splice(index, 1);
        }
        update(data)
      })

      $('#United-Kingdom').on('change', function() {
        if (this.checked) {
          removeAll();
          countries.push('United Kingdom');
          allSelected = false
        } else {
          let index = countries.indexOf(this.value);
          countries.splice(index, 1);
        }
        update(data)
      })

      $('#United-States').on('change', function() {
        if (this.checked) {
          removeAll();
          countries.push('United States');
          allSelected = false
        } else {
          let index = countries.indexOf(this.value);
          countries.splice(index, 1);
        }
        update(data)
      })

  });
});
