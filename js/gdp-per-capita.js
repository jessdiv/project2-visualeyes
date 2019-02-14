let countriesGlobal = ['all'];
let allSelectedGlobal = true;

$(document).ready(function(){

  let marginGDP = { left:90, right:20, top:50, bottom:100 };
  let heightGDP = 600 - marginGDP.top - marginGDP.bottom;
  let widthGDP = 800 - marginGDP.left - marginGDP.right;
  let nestedData;

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
    // let tooltipGDP = d3.select('#ds3')
    //   .append('div')
    //   .data(nestedData)
    //   .attr('class', 'd3-tip')
    //   .style('position', 'absolute')
    //   .style('z-index', '10')
    //   .style('visibility', 'hidden')
    //
    // let tooltip_mouseoverGDP = function(e) {
    //   tooltipGDP.style('visibility', 'visible')
    //     .text(function() {
    //       return `Country: ${ e.key }`
    //     })
    // }
    //
    // let tooltip_mouseoutGDP = function() {
    //   tooltipGDP.style('visibility', 'hidden')
    // }
    //
    // let tooltip_mousemoveGDP = function() {
    //   tooltipGDP.style('top', ( event.windowY - 10) + 'px')
    //     .style('left', ( event.windowX + 10) + 'px')
    // }

    const tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
        return d.key;
      })
    svgGDP.call(tip);

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
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .attr('d', function(d) {
            return line(d.values)
          })
          // .on('mouseover', tooltip_mouseoverGDP)
          // .on('mouseout', tooltip_mouseoutGDP)
          // .on('mousemove', tooltip_mousemoveGDP)

    //////////// UPDATE DATA FUNCTION ////////////
    function update(data) {
      let updatedData = nestedData.filter(function(d) {
        if (allSelectedGlobal) {
          return true;
        } else {
          for (var i = 0; i < countriesGlobal.length; i++) {
            if (d.key === countriesGlobal[i]) {
              return d.values;
            }
          }
        }
      });

      gGDP.selectAll('.line')
        .remove();

      gGDP.selectAll('.line')
        .data(function() {
          if (allSelectedGlobal) {
            return nestedData;
          } else {
            return updatedData;
          }
        })
        .enter()
          .append('path')
          .attr('class', 'line')
          .attr('fill', 'none')
          // .on('mouseover', tooltip_mouseoverGDP)
          // .on('mouseout', tooltip_mouseoutGDP)
          // .on('mousemove', tooltip_mousemoveGDP)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .attr('stroke', function(d) {
            return colorScaleGDP(d.key);
          })
          .attr('d', function(d) {
            return line(d.values);
          });
    }

    let legendCountries = []

    function removeAll() {
      let index = countriesGlobal.indexOf('all');
      if (index !== -1) {
        countriesGlobal.splice(index, 1);
      }
      $('#all').prop('checked', false);
      // if ($('#Australia').prop('checked', false)) {
      //   $('.aus').css('display', 'none');
      // }
      // if ($('#Brazil').prop('checked', false)) {
      //   $('.bra').css('display', 'none');
      // }
      // if ($('#Canada').prop('checked', false)) {
      //   $('.can').css('display', 'none');
      // }
      // if ($('#China').prop('checked', false)) {
      //   $('.chn').css('display', 'none');
      // }
      // if ($('#France').prop('checked', false)) {
      //   $('.fra').css('display', 'none');
      // }
      // if ($('#India').prop('checked', false)) {
      //   $('.ind').css('display', 'none');
      // }
      // if ($('#Ireland').prop('checked', false)) {
      //   $('.irl').css('display', 'none');
      // }
      // if ($('#Italy').prop('checked', false)) {
      //   $('.ita').css('display', 'none');
      // }
      // if ($('#Mexico').prop('checked', false)) {
      //   $('.mex').css('display', 'none');
      // }
      // if ($('#Nigeria').prop('checked', false)) {
      //   $('.nig').css('display', 'none');
      // }
      // if ($('#Netherlands').prop('checked', false)) {
      //   $('.net').css('display', 'none');
      // }
      // if ($('#New-Zealand').prop('checked', false)) {
      //   $('.nzl').css('display', 'none');
      // }
      // if ($('#Thailand').prop('checked', false)) {
      //   $('.tha').css('display', 'none');
      // }
      // if ($('#United-Kingdom').prop('checked', false)) {
      //   $('.gbr').css('display', 'none');
      // }
      // if ($('#United-States').prop('checked', false)) {
      //   $('.usa').css('display', 'none');
      // }
    }

    //////////// EVENT HANDLERS ////////////
    $('#all').on('change', function() {
      if (this.checked) {
        countriesGlobal = ['all'];
        allSelectedGlobal = true;
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
        $('.aus').css('display', 'inline');
        $('.bra').css('display', 'inline');
        $('.can').css('display', 'inline');
        $('.chn').css('display', 'inline');
        $('.fra').css('display', 'inline');
        $('.ind').css('display', 'inline');
        $('.irl').css('display', 'inline');
        $('.ita').css('display', 'inline');
        $('.mex').css('display', 'inline');
        $('.nig').css('display', 'inline');
        $('.net').css('display', 'inline');
        $('.nzl').css('display', 'inline');
        $('.tha').css('display', 'inline');
        $('.gbr').css('display', 'inline');
        $('.usa').css('display', 'inline');
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        allSelectedGlobal = false;
      }
      update(data)
    })

    function setLegendDisplay() {
      $('.aus').css('display', 'none');
      $('.bra').css('display', 'none');
      $('.can').css('display', 'none');
      $('.chn').css('display', 'none');
      $('.fra').css('display', 'none');
      $('.ind').css('display', 'none');
      $('.irl').css('display', 'none');
      $('.ita').css('display', 'none');
      $('.mex').css('display', 'none');
      $('.nig').css('display', 'none');
      $('.net').css('display', 'none');
      $('.nzl').css('display', 'none');
      $('.tha').css('display', 'none');
      $('.gbr').css('display', 'none');
      $('.usa').css('display', 'none');
      for (var i = 0; i < legendCountries.length; i++) {
        $('.' + legendCountries[i]).css('display', 'inline')
      }
    }

    $('#Australia').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('aus');
        allSelectedGlobal = false
        $('.aus').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.aus').css('display', 'none');
      }
      update(data);
    })

    $('#Brazil').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('bra');
        allSelectedGlobal = false
        $('.bra').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.bra').css('display', 'none')
      }
      update(data)
    })

    $('#Canada').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('can');
        allSelectedGlobal = false
        $('.can').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.can').css('display', 'none')
      }
      update(data)
    })

    $('#China').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('chn');
        allSelectedGlobal = false
        $('.chn').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.chn').css('display', 'none')
      }
      update(data)
    })

    $('#France').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('fra');
        allSelectedGlobal = false
        $('.fra').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.fra').css('display', 'none')
      }
      update(data)
    })

    $('#India').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('ind');
        allSelectedGlobal = false
        $('.ind').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.ind').css('display', 'none')
      }
      update(data)
    })

    $('#Ireland').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('irl');
        allSelectedGlobal = false
        $('.irl').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.irl').css('display', 'none')
      }
      update(data)
    })

    $('#Italy').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('ita');
        allSelectedGlobal = false
        $('.ita').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.ita').css('display', 'none')
      }
      update(data)
    })

    $('#Mexico').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('mex');
        allSelectedGlobal = false
        $('.mex').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.mex').css('display', 'none')
      }
      update(data)
    })

    $('#Nigeria').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('nig');
        allSelectedGlobal = false
        $('.nig').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.nig').css('display', 'none')
      }
      update(data)
    })

    $('#Netherlands').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('net');
        allSelectedGlobal = false
        $('.net').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.net').css('display', 'none')
      }
      update(data)
    })

    $('#New-Zealand').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push('New Zealand');
        legendCountries.push('nzl');
        allSelectedGlobal = false
        $('.nzl').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.nzl').css('display', 'none')
      }
      update(data)
    })

    $('#Thailand').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push(this.value);
        legendCountries.push('tha');
        allSelectedGlobal = false
        $('.tha').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.tha').css('display', 'none')
      }
      update(data)
    })

    $('#United-Kingdom').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push('United Kingdom');
        legendCountries.push('gbr');
        allSelectedGlobal = false
        $('.gbr').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.gbr').css('display', 'none')
      }
      update(data)
    })

    $('#United-States').on('change', function() {
      if (this.checked) {
        removeAll();
        countriesGlobal.push('United States');
        legendCountries.push('usa');
        allSelectedGlobal = false
        $('.usa').css('display', 'inline')
        setLegendDisplay();
      } else {
        let index = countriesGlobal.indexOf(this.value);
        countriesGlobal.splice(index, 1);
        $('.usa').css('display', 'none')
      }
      update(data)
    })

  });
});
