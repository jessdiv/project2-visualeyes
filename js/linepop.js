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
    .range([heightPop, 5])
    .domain([1300000, 1400000000])
    .base(2)

  let xAxisCallPop = d3.axisBottom()
    .ticks(15)
    .tickFormat(function(d) {
      return +d
    })

    let yAxisCallPop = d3.axisLeft()
      .ticks(15)


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

  //////////// Initialise Tooltip ////////////
  const tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) {
          // console.log(d);
          let text = "<strong>Country</strong>: " + d.key + "<br />";
          // text += "<strong>Year</strong>: " + this.Year + "<br />";
          // text += "<strong>Total Population</strong>: " + d['Total Population'] + "<br />";
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
          .attr('fill', 'none')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr('d', function(d) {
              return linePop(d.values)
            });

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
