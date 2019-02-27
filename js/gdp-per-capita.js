const loadGraphGDP = (data) => {

  let marginGDP = {
    left: 90,
    right: 20,
    top: 50,
    bottom: 100
  };
  let heightGDP = 600 - marginGDP.top - marginGDP.bottom;
  let widthGDP = 800 - marginGDP.left - marginGDP.right;
  let nestedData;

  let svgGDP = d3.select('#chart-area-3')
    .append('svg')
    .attr('width', widthGDP + marginGDP.left + marginGDP.right)
    .attr('height', heightGDP + marginGDP.top + marginGDP.bottom)

  let gGDP = svgGDP.append('g')
    .attr('transform', 'translate(' + marginGDP.left + ', ' + marginGDP.top + ')')

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
      return "$" + +d;
    })

  let line = d3.line()
    .x(function(d) {
      return x(d.year);
    })
    .y(function(d) {
      return y(+d.gdp_capita);
    })


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
    .attr('x', -(heightGDP / 2))
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
  }

  //////////// EVENT HANDLERS ///////////

  function setLegendDisplay() {
    $('.Australia').css('display', 'none');
    $('.Brazil').css('display', 'none');
    $('.Canada').css('display', 'none');
    $('.China').css('display', 'none');
    $('.France').css('display', 'none');
    $('.India').css('display', 'none');
    $('.Ireland').css('display', 'none');
    $('.Italy').css('display', 'none');
    $('.Mexico').css('display', 'none');
    $('.Nigeria').css('display', 'none');
    $('.Netherlands').css('display', 'none');
    $('.New-Zealand').css('display', 'none');
    $('.Thailand').css('display', 'none');
    $('.United-Kingdom').css('display', 'none');
    $('.United-States').css('display', 'none');
    for (var i = 0; i < legendCountries.length; i++) {
      $('.' + legendCountries[i]).css('display', 'inline')
    }
  }

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

  $('.country-boxes').on('change', 'input', function(e) {
    e.preventDefault;
    if (this.checked) {
      removeAll();
      countriesGlobal.push(this.value);
      legendCountries.push(this.value);
      allSelectedGlobal = false

      $('.' + this.value).css('display', 'inline')
      setLegendDisplay();
    } else {
      let index = countriesGlobal.indexOf(this.value);
      countriesGlobal.splice(index, 1);
      $('.' + this.value).css('display', 'none');
    }
    update(data);
  });

};
