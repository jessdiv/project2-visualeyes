const loadGraphPopulation = (data) => {

  let marginPop = {
    top: 50,
    right: 20,
    bottom: 100,
    left: 80
  };
  let widthPop = 800 - marginPop.left - marginPop.right;
  let heightPop = 600 - marginPop.top - marginPop.bottom;
  let countries = ['all'];

  let svgPop = d3.select('#chart-area-4')
    .append('svg')
    .attr('width', widthPop + marginPop.left + marginPop.right)
    .attr('height', heightPop + marginPop.top + marginPop.bottom)

  let gPop = svgPop.append('g')
    .attr('transform', 'translate(' + marginPop.left + ', ' + marginPop.top + ')')
    .attr('class', 'g-parent')

  //////////// Scales ////////////
  let xPop = d3.scaleLinear()
    .range([0, widthPop])
    .domain([1960, 2017])

  let yPop = d3.scaleLinear()
    .range([heightPop, 20])
    .domain([0, 1300000000])
  //.base(5)

  let xAxisCallPop = d3.axisBottom()
    .ticks(15)
    .tickFormat(function(d) {
      return +d
    })

  let yAxisCallPop = d3.axisLeft()
    .ticks(10)


  let linePop = d3.line()
    .x(function(d) {
      return xPop(d.year);
    })
    .y(function(d) {
      return yPop(+d.population);
    })



  filteredDataPop = data.filter(function(d) {
    if (d.year !== 2018) {
      // console.log(d);
      return d;
    }
  });

  nestedDataPop = d3.nest()
    .key(function(d) {
      return d.country_name;
    })
    .entries(filteredDataPop)

  //////////// Color ////////////
  let colorScalePop = d3.scaleOrdinal()
    .domain(nestedDataPop.map(function(d) {
      //console.log(d.key);
      return d.key;
    }))
    .range(['#e5446d', '#BC8F8F', '#ffba49', '#20a39e', '#DC143C', '#663399', '#f2e3bc', '#ff8552', '#f76f8e', '#14cc60', '#931621', '#87CEEB', '#C0C0C0', '#d1f5ff', '#7d53de'])

  //////////// Initialise Tooltip ////////////
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {

      let text = d.key + "<br />";
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
    .attr('y', '500')
    .attr('fill', 'black')
    .attr('font-family', 'Raleway')
    .attr('font-size', '18px')
    .attr('text-anchor', 'middle')
    .text('Year')

  let pathPop = gPop.selectAll('.line')
    .data(nestedDataPop)
    .enter()
    .append('path')
    .attr('stroke', 'black')
    .attr('stroke-width', '2px')
    .attr('class', 'line')
    .attr('stroke', function(d) {
      return colorScalePop(d.key);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .attr('d', function(d) {
      return linePop(d.values)
    });

  function update(data) {
    let updatedData = nestedDataPop.filter(function(d) {
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

    gPop.selectAll('.line').remove();

    gPop.selectAll('.line')
      .data(function() {
        if (allSelected) {
          return nestedDataPop;
        } else {
          return updatedData;
        }
      })
      .enter()
      .append('path')
      .attr('class', 'line')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .attr('stroke', function(d) {
        return colorScalePop(d.key);
      })
      .attr('d', function(d) {
        return linePop(d.values);
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

  $('#country-boxes').on('change', 'input', function(e) {
    e.preventDefault;
    if (this.checked) {
      removeAll();
      countries.push(this.value);
      allSelected = false
    } else {
      let index = countries.indexOf(this.value);
      countries.splice(index, 1);
    }
    update(data);
  });


};
