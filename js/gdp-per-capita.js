let countries = ['all'];
$(document).ready(function(){

  let marginGDP = { left:90, right:20, top:50, bottom:100 };
  let heightGDP = 600 - marginGDP.top - marginGDP.bottom;
  let widthGDP = 800 - marginGDP.left - marginGDP.right;
  let nestedData;
  let allSelected = true;

  let svgGDP = d3.select('#chart-area-3')
    .append('svg')
    .attr('width', widthGDP + marginGDP.left + marginGDP.right)
    .attr('height', heightGDP + marginGDP.top + marginGDP.bottom)

  let gGDP = svgGDP.append('g')
    .attr('transform', 'translate(' + marginGDP.left + ', ' + marginGDP.top + ')')
    // .attr('class', 'g-parent')

  //////////// Scales ////////////
  let x = d3.scaleLinear()
    .range([0, widthGDP])
    .domain([1960, 2017])

  let y = d3.scaleLinear()
    .range([heightGDP, 0])
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
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(+d.gdp_capita); })

  //////////// IMPORT CSV ////////////
  d3.csv('https://visualeyes-server.herokuapp.com/statistics.csv').then(function(data) {

    // Format year and GDP as integers
    data.forEach(function(d) {
      d.year = +d.year;
      d.gdp_capita = +d.gdp_capita;
    });

    // Nest data by country
    nestedData = d3.nest()
      .key(function(d) {
        return d.country_name;
      })
      .entries(data)

    //////////// Colours ////////////
    let colorScaleGDP = d3.scaleOrdinal()
      .domain(nestedData.map(function(d) {
        return d.key;
      }))
      .range(['#e5446d', '#BC8F8F', '#ffba49', '#20a39e', '#DC143C', '#663399', '#f2e3bc', '#ff8552', '#f76f8e', '#14cc60', '#931621', '#87CEEB', '#C0C0C0', '#d1f5ff', '#7d53de'])

    //////////// TOOLTIP ////////////
    let tooltipGDP = d3.select('#chart-area-3')
      .append('div')
      .data(nestedData)
      .attr('class', 'd3-tip')
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
    let xAxis = gGDP.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + heightGDP + ')')
      .call(xAxisCall.scale(x))

    let yAxis = gGDP.append('g')
      .attr('class', 'y axis')
      .call(yAxisCall.scale(y))

    // Y Axis Label
    yAxis.append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', -70)
      .attr('x', - (heightGDP / 2))
      .attr('font-size', '18px')
      .attr('fill', 'black')
      .attr('font-family', 'Raleway')
      .style('text-anchor', 'middle')
      .text('GDP per Capita (USD)')

    // X Axis Label
    gGDP.append('text')
      .attr('class', 'axis-label')
      .attr('x', widthGDP / 2)
      .attr('y', heightGDP + 50)
      .attr('fill', 'black')
      .attr('font-family', 'Raleway')
      .attr('font-size', '18px')
      .attr('text-anchor', 'middle')
      .text('Year')

    let lines = gGDP.selectAll('.line')
      .data(nestedData)
      .enter()
        .append('path')
          .attr('class', 'line')
          .attr('stroke', function(d) {
            return colorScaleGDP(d.key);
          })
          .attr('d', function(d) {
            return line(d.values)
          })
          .on('mouseover', tooltip_mouseoverGDP)
          .on('mouseout', tooltip_mouseoutGDP)
          .on('mousemove', tooltip_mousemoveGDP)

    //////////// UPDATE DATA FUNCTION ////////////
    function update(data) {
      let updatedData = nestedData.filter(function(d) {
        if (allSelected) {
          return true;
        } else {
          for (var i = 0; i < countries.length; i++) {
            if (d.key === countries[i]) {
              return d.values;
            }
          }
        }
      });

      gGDP.selectAll('.line')
        .remove();

      gGDP.selectAll('.line')
        .data(function() {
          if (allSelected) {
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
          .attr('stroke', function(d) {
            return colorScaleGDP(d.key);
          })
          .attr('d', function(d) {
            return line(d.values);
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
    $('#all').on('change', function() {
      if (this.checked) {
        countries = ['all'];
        allSelected = true;
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
