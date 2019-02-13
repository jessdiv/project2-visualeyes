$(document).ready(function(){

  let all_stats_width = 800;
  let all_stats_height = 500;

  let all_stats_margin = {
    left: 150,
    right: 150,
    top: 200,
    bottom: 150
  }

  const population_stats_svg = d3.select('#population-chart-area')
    .append("svg")
    .attr('class', 'svg-1')
    .attr('width', all_stats_width)
    .attr('height', all_stats_height)

  d3.csv("../resources/alldata_flat.csv").then(function(data) {
    data.forEach(function(d) {
      d['Total Population'] = +d['Total Population']
    })

    // nesting to allow usage of year as key
    let years = d3.nest()
      .key(function(d) {
        if (d.Year === '2017') {
          return d.Year;
        }
      })
      .entries(data);

    console.log(years);
    console.log(years[1]);
    console.log(years[1].values[0].Country);
    console.log(years[1].values[0]["Total Population"]);

    const year2017 = years[1].values;
    console.log(year2017);

    // color-coding countries
    var color = d3.scaleOrdinal()
      .domain(year2017.map(function(d) {
        return d.Country;
      }))
      .range(['blanchedalmond', 'deeppink', 'lightblue', 'aquamarine', 'deepskyblue', 'coral', 'darkblue', 'thistle', 'darkseagreen', 'darkcyan', 'lightcoral', 'indigo', 'palevioletred', 'crimson', 'steelblue']);
    console.log('**');
    console.log(year2017.map(function(d){ return d.Country}));
    console.log('**');

    // scale for countries
    let size = d3.scaleLog()
      .domain([4793900, 1400000000])
      .range([0, 40])
      .base(2)

  // Tooltips
    const tooltip = d3.select('#ds5')
      .append('div')
      .data(year2017)
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')

  console.log(year2017);

  // http://bl.ocks.org/biovisualize/1016860

  // mouseover tooltips
  const pop_tooltip_mouseover = function(e, year2017) {
    tooltip.style('visibility', 'visible')
    .text(function() {
      return `Country: ${e.Country}, Population: ${e['Total Population']}`;
    })
  }

  const tooltip_mouseout = function(year2017) {
    tooltip.style('visibility', 'hidden')
  }
  const tooltip_mousemove = function(year2017) {
    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
  }

  // checking data
  console.log('////////');
  console.log(years[1].values[0]['Country']);
  console.log(years[1].values[0]['Year']);
  console.log(years[1].values[0]['Total Population']);
  console.log('//////////');

  console.log(((year2017[0]["Total Population"]) / 10000000) * 2);


  // initializing the circle

    const node = population_stats_svg.append('g')
      .selectAll('circle')
      .data(year2017)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr("r", function(year2017){
        return size(year2017['Total Population'])})
      .attr('cx', 250)
      .attr('cy', 150)
      .style('fill', function(d){ return color(d.Country)}) //come back to for colours
      .style('fill-opacity', 0.8)
      .attr('stroke', 'black')
      .style("stroke-width", 1)
      .on("mouseover", pop_tooltip_mouseover) // when hovering
      .on('mousemove', tooltip_mousemove)
      .on('mouseout', tooltip_mouseout)
      .call(d3.drag() // when circle is dragged
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // features of the force

    const simulation = d3.forceSimulation()
      .force("y", d3.forceY().strength(0.1).y( all_stats_height/2 ))
      .force('center', d3.forceCenter().x(population_width / 2).y(population_height / 2)) //attracts to centre of svg
      .force('charge', d3.forceManyBody().strength(.1)) //Nodes are attracted to each other
      .force("collide", d3.forceCollide().strength(.2).radius(function(year2017){ return size(year2017['Total Population']+3) }).iterations(1)) //force avoids circle collision

    simulation
      .nodes(year2017)
      .on('tick', function(year2017) {
        node
          .attr('cx', function(year2017) {
            return year2017.x;
          })
          .attr('cy', function(year2017) {
            return year2017.y;
          })
      })

    function dragstarted(year2017) {
      if (!d3.event.active) simulation.alphaTarget(.03).restart();
      year2017.fx = year2017.x;
      year2017.fy = year2017.y;
    }

    function dragged(year2017) {
      year2017.fx = d3.event.x;
      year2017.fy = d3.event.y;
    }

    function dragended(year2017) {
      if (!d3.event.active) simulation.alphaTarget(.03);
      year2017.fx = null;
      year2017.fy = null;
    }

    // END OF POPULATION BUBBLES

    // START OF AREA BUBBLES /////

    const area_svg = d3.select('#area-chart-area')
      .append('svg')
      .attr('class', 'svg-2')
      .attr('width', all_stats_width)
      .attr('height', all_stats_height)

    let areaSize = d3.scaleLog()
      .domain([40000, 10000000])
      .range([0, 40])
      .base(2)

    // tool tip for area - only need to change the mouseover //

    const area_tooltip_mouseover = function(e, year2017) {
        tooltip.style('visibility', 'visible')
        .text(function() {
          return `Country: ${e.Country}, Area: ${e['Area (km2)']}km2`;
        })
      }


    const areaNode = area_svg.append('g')
      .selectAll('rect')
      .data(year2017)
      .enter()
      .append('circle')
      // .attr('class', 'node')
      .attr('r', function(year2017){
        return areaSize(year2017['Area (km2)'])
      })
      .attr('cx', 250)
      .attr('cy', 150)
      .style('fill', function(d){ return color(d.Country)}) //come back to for colours
      .style('fill-opacity', 0.8)
      .attr('stroke', 'black')
      .style("stroke-width", 1)
      .on("mouseover", area_tooltip_mouseover) // when hovering
      .on('mousemove', tooltip_mousemove)
      .on('mouseout', tooltip_mouseout)
      .call(d3.drag() // when circle is dragged
        .on('start', pop_dragstarted)
        .on('drag', pop_dragged)
        .on('end', pop_dragended));

    const areaSimulation = d3.forceSimulation()
        .force("y", d3.forceY().strength(0.1).y( all_stats_height/2 ))
        .force('center', d3.forceCenter().x(all_stats_width/2).y(all_stats_width / 2))
        .force('charge', d3.forceManyBody().strength(.1))
        .force('collide', d3.forceCollide().strength(.2).radius(function(year2017) { return areaSize(year2017['Area (km2)']+3)}).iterations(1))

    areaSimulation
      .nodes(year2017)
      .on('tick', function(year2017) {
        areaNode
          .attr('cx',
        function(year2017) {
          return year2017.x;
        })
        .attr('cy', function(year2017) {
          return year2017.y
        })
      })

      function pop_dragstarted(year2017) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        year2017.fx = year2017.x;
        year2017.fy = year2017.y;
      }

      function pop_dragged(year2017) {
        year2017.fx = d3.event.x;
        year2017.fy = d3.event.y;
      }

      function pop_dragended(year2017) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        year2017.fx = null;
        year2017.fy = null;
      }

    // END OF AREA BUBBLES /////

    // START OF DENSITY BUBBLES /////

    const density_svg = d3.select('#density-chart-area')
      .append('svg')
      .attr('class', 'svg-3')
      .attr('width', all_stats_width)
      .attr('height', all_stats_height)

    let densitySize = d3.scaleLog()
      .domain([3, 510])
      .range([0, 20])
      .base(2)

    // tool tip for area - only need to change the mouseover //

    const density_tooltip_mouseover = function(e, year2017) {
        tooltip.style('visibility', 'visible')
        .text(function() {
          return `Country: ${e.Country}, Density: ${e['Population Density (/km2)']}km2`;
        })
      }


    const densityNode = density_svg.append('g')
      .selectAll('circle')
      .data(year2017)
      .enter()
      .append('circle')
      // .attr('class', 'node')
      .attr('r', function(year2017){
        return densitySize(year2017['Population Density (/km2)'])
      })
      .attr('cx', 250)
      .attr('cy', 150)
      .style('fill', function(d){ return color(d.Country)}) //come back to for colours
      .style('fill-opacity', 0.8)
      .attr('stroke', 'black')
      .style("stroke-width", 1)
      .on("mouseover", density_tooltip_mouseover) // when hovering
      .on('mousemove', tooltip_mousemove)
      .on('mouseout', tooltip_mouseout)
      .call(d3.drag() // when circle is dragged
        .on('start', density_dragstarted)
        .on('drag', density_dragged)
        .on('end', density_dragended));

    const densitySimulation = d3.forceSimulation()
        .force("y", d3.forceY().strength(0.1).y( all_stats_height/2 ))
        .force('center', d3.forceCenter().x(all_stats_width/2).y(all_stats_width / 2))
        .force('charge', d3.forceManyBody().strength(.1))
        .force('collide', d3.forceCollide().strength(.2).radius(function(year2017) { return areaSize(year2017['Area (km2)']+3)}).iterations(1))

    densitySimulation
      .nodes(year2017)
      .on('tick', function(year2017) {
        densityNode
          .attr('cx',
        function(year2017) {
          return year2017.x;
        })
        .attr('cy', function(year2017) {
          return year2017.y
        })
      })

      function density_dragstarted(year2017) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        year2017.fx = year2017.x;
        year2017.fy = year2017.y;
      }

      function density_dragged(year2017) {
        year2017.fx = d3.event.x;
        year2017.fy = d3.event.y;
      }

      function density_dragended(year2017) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        year2017.fx = null;
        year2017.fy = null;
      }

    // END OF DENSITY BUBBLES /////

    // START OF GDP BUBBLES /////

    const gdp_svg = d3.select('#gdp-chart-area')
      .append('svg')
      .attr('class', 'svg-4')
      .attr('width', all_stats_width)
      .attr('height', all_stats_height)

    let gdpSize = d3.scaleLog()
      .domain([1939329775, 19390604000000])
      .range([0, 50])
      .base(2)

    // tool tip for area - only need to change the mouseover //

    const gdp_tooltip_mouseover = function(e, year2017) {
        tooltip.style('visibility', 'visible')
        .text(function() {
          return `Country: ${e.Country}, TOTAL GDP: ${e['GDP (Current USD)']}`;
        })
      }


    const gdpNode = gdp_svg.append('g')
      .selectAll('circle')
      .data(year2017)
      .enter()
      .append('circle')
      // .attr('class', 'node')
      .attr('r', function(year2017){
        return gdpSize(year2017['GDP (Current USD)'])
      })
      .attr('cx', 250)
      .attr('cy', 150)
      .style('fill', function(d){ return color(d.Country)}) //come back to for colours
      .style('fill-opacity', 0.8)
      .attr('stroke', 'black')
      .style("stroke-width", 1)
      .on("mouseover", gdp_tooltip_mouseover) // when hovering
      .on('mousemove', tooltip_mousemove)
      .on('mouseout', tooltip_mouseout)
      .call(d3.drag() // when circle is dragged
        .on('start', gdp_dragstarted)
        .on('drag', gdp_dragged)
        .on('end', gdp_dragended));

    const gdpSimulation = d3.forceSimulation()
        .force("y", d3.forceY().strength(0.1).y( all_stats_height/2 ))
        .force('center', d3.forceCenter().x(all_stats_width/2).y(all_stats_width / 2))
        .force('charge', d3.forceManyBody().strength(.1))
        .force('collide', d3.forceCollide().strength(.2).radius(function(year2017) { return areaSize(year2017['Area (km2)']+3)}).iterations(1))

    gdpSimulation
      .nodes(year2017)
      .on('tick', function(year2017) {
        gdpNode
          .attr('cx',
        function(year2017) {
          return year2017.x;
        })
        .attr('cy', function(year2017) {
          return year2017.y
        })
      })

      function gdp_dragstarted(year2017) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        year2017.fx = year2017.x;
        year2017.fy = year2017.y;
      }

      function gdp_dragged(year2017) {
        year2017.fx = d3.event.x;
        year2017.fy = d3.event.y;
      }

      function gdp_dragended(year2017) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        year2017.fx = null;
        year2017.fy = null;
      }

  });

})
