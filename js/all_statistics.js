
  let all_stats_width = window.innerWidth;
  let all_stats_height = window.innerHeight;

  let all_stats_margin = {
    left:80,
    right:100,
    top:50,
    bottom:100
  }

  const all_stats_svg = d3.select('#chart-area-5')
    .append("svg")
      .attr('class', 'svg-1')
      .attr('width', all_stats_width/1.2)
      .attr('height', all_stats_height/1.2)
      .style('background-color', 'pink')

  const stat_g = d3.select('.svg-1')
    .append('g')
    .attr('width', gdp_width + gdp_margin.left + gdp_margin.right)
    .attr('height', gdp_height + gdp_margin.top + gdp_margin.bottom)

  const svg_population = all_stats_svg.append('svg')
        .attr('class', 'svg-population')
        .attr('x', '200')
        .attr('y', '200')
        .attr('width', (all_stats_width/2))
        .attr('height', (all_stats_height/2))
        .attr('z-index', '10')
        .style('background-color', 'black')
        .text('Population');

const svg_area = all_stats_svg.append('svg')
