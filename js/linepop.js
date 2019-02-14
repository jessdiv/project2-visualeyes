$(document).ready(function(){
  let marginPop = {top: 20, right: 50, bottom: 100, left: 100};
  let widthPop = 800 - marginPop.left - marginPop.right;
  let heightPop = 500 - marginPop.top - marginPop.bottom;
  // let filteredDataPop;
  // let nestedDataPop;
  // let countryPop = ['all'];
  // let allSelected = true;

  let svgPop = d3.select('#chart-area-4')
    .append('svg')
    .attr('width', widthPop + marginPop.left + marginPop.right)
    .attr('height', heightPop + marginPop.top + marginPop.bottom)
    //.style('background-color', 'pink')

  let gPop = svgPop.append('g')
    .attr('transform', 'translate(' + marginPop.left + ', ' + marginPop.top + ')')
    .attr('class', 'g-parent')

  //////////// Scales ////////////
  let xPop = d3.scaleLinear()
    .range([0, widthPop])
    .domain([1960, 2017])

  let yPop = d3.scaleLog()
    .range([heightPop, 2])
    .domain([1500000, 1400000000])
    .base(5)

  let xAxisCallPop = d3.axisBottom()
    .ticks(15)
    .tickFormat(function(d) {
      return +d
    })

    let yAxisCallPop = d3.axisLeft()
      .ticks(8)


  let linePop = d3.line()
    .x(function(d) { return xPop(d.year); })
    .y(function(d) { return yPop(+d.population);})

  //////////// IMPORT CSV ////////////
  d3.csv("https://visualeyes-server.herokuapp.com/statistics.csv").then(function(data) {
    data.forEach(function(d) {
      d.year = +d.year;
      d.population = +d.population;
      //d.Total_Population = +d.Total_Population.split(',').join('');
    });

    filteredDataPop = data.filter(function(d) {
      if (d.year !== 2018) {
        // console.log(d);
        return d;
      }
    });

    // Nesteed data by country
    nestedDataPop = d3.nest()
      .key(function(d) {
        return d.country_name;
      })
       .entries(filteredDataPop)

//////////// Color ////////////
    let colorScalePop = d3.scaleOrdinal()
      .domain(nestedDataPop.map(function(d) {
          console.log(d.key);
          return d.key;
        }))
        .range(['#ffba49', '#20a39e', '#ef5b5b', '#6A5ACD', '#f2e3bc', '#ff8552', '#f76f8e', '#14cc60', '#931621', '#87CEEB', '#40434e', '#d1f5ff', '#7d53de', '#e5446d', '#BC8F8F'])

  //////////// Initialise Tooltip ////////////
  const tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) {
          // console.log(d);
          let text = d.key + "<br />";
          // text += "<strong>Year</strong>: " + this.year + "<br />";
          // text += "<strong>Total Population</strong>: " + d.population + "<br />";
          return text;
        })
      svgPop.call(tip);

  let xAxisPop = gPop.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + heightPop + ')')
        .call(xAxisCallPop.scale(xPop))

      let yAxisPop = gPop.append('g')
        .attr('class', 'y axis')
        .call(yAxisCallPop.scale(yPop))

      // Y Axis Label
      yAxisPop.append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .attr('fill', 'black')
        .attr('font-family', 'Raleway')
        .style('text-anchor', 'end')
        .text('Population')

      // X Axis Label
      gPop.append('text')
        .attr('class', 'axis-label')
        .attr('x', widthPop / 2)
        .attr('y', '440')
        .attr('fill', 'black')
        .attr('font-family', 'Raleway')
        .attr('font-size', '18px')
        .attr('text-anchor', 'middle')
        .text('Year')

      let pathPop = gPop.selectAll('.line2')
        .data(nestedDataPop)
        .enter()
          .append('path')
          .attr('stroke', 'black')
          .attr('stroke-width', '2px')
          .attr('class', 'line2')
          .attr('stroke', function(d) {
            return colorScalePop(d.key);
          })
          .attr('fill', 'none')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr('d', function(d) {
              return linePop(d.values)
            });

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
      // function update(data) {
      //   //country = $('#country-select').val();
      //   //console.log(country);
      //
      //   let updatedDataPop = data.filter(function(d) {
      //     if (country === 'all') {
      //       return true;
      //     } else {
      //       return d.Country === country;
      //     }
      //   });
      //
      //   updatedDataPop = updatedDataPop.filter(function(d) {
      //     if (d.Year !== 2018) {
      //       return d;
      //     }
      //   });
      //   //console.log(updatedDataPop);
      //
      //   gPop.selectAll('.line2')
      //     .remove();
      //
      //   gPop.selectAll('.line2')
      //     .data(function() {
      //       if (country === 'all') {
      //         return nestedDataPop;
      //       } else {
      //         return updatedDataPop;
      //       }
      //     })
      //     .enter()
      //       .append('path')
      //       .attr('class', 'line2')
      //       .attr('fill', 'none')
      //       .attr('d', function(d) {
      //         if (country === 'all') {
      //           return line2(d.values);
      //         } else {
      //           return line2(d);
      //         }
      //       });
      // }
  });
});
