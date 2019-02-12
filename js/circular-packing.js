const width = window.innerWidth;
const height = window.innerHeight;

const margin = {
  left: 150,
  right: 150,
  top: 150,
  bottom: 150
}

const svg = d3.select('#ds1')
  .append("svg")
  .attr('class', 'svg-graph1')
  .attr('width', width)
  .attr('height', height)

svg.append("html")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style('color', 'black')
          .style('padding', '25px')
          .style("text-decoration", "underline")
          .text("World Population 2017");

d3.csv("../resources/alldata_flat.csv").then(function(data) {
  // console.log(data);
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

  // scale for countries
  let size = d3.scaleLog()
    .domain([4793900, 1400000000])
    .range([0, 120])
    .base(2)

// Tooltips

  const tooltip = d3.select('#ds1')
    .append('div')
    .data(year2017)
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .text(function(year2017) {
      // console.log(year2017.Country);
      // console.log(year2017['Total Population']);
      return `Country: ${year2017.Country}, Population: ${year2017['Total Population']}`;
    })

console.log(year2017);

// http://bl.ocks.org/biovisualize/1016860

// mouseover tooltips
const tooltip_mouseover = function(year2017) {
  tooltip.style('visibility', 'visible')
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

  const node = svg.append('g')
    .selectAll('circle')
    .data(year2017)
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr("r", function(year2017){ return size(year2017['Total Population'])})
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .style('fill', function(d){ return color(d.Country)}) //come back to for colours
    .style('fill-opacity', 0.8)
    .attr('stroke', 'black')
    .style("stroke-width", 1)
    .on("mouseover", tooltip_mouseover) // when hovering
    .on('mousemove', tooltip_mousemove)
    .on('mouseout', tooltip_mouseout)
    .call(d3.drag() // when circle is dragged
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  // features of the force

  const simulation = d3.forceSimulation()
    // .force("x", d3.forceX().strength(0.5).x(width/2))
    // .force("y", d3.forceY().strength(0.1).y( height/2 ))
    .force('center', d3.forceCenter().x(width / 2).y(height / 2)) //attracts to centre of svg
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

});
