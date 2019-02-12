
    const width = 800;
    const height = 600;
    const margin = { left: 150, right: 150, top: 150, bottom: 150};

    let g = d3.select(".graph1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

      g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 80)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Country")

      g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (height / 2))
        .attr("y", -80)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Population")


$.get( "https://visualeyes-server.herokuapp.com/populations.json", function( data ) {
  $( ".result" ).html( data );
  console.log(data);
});

      data.forEach(function(d) {
        d.country_code = +d.country_code;
      });

      let x = d3.scaleBand()
        .domain(data.map(function(d) {
          return d.country_name;
        }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3)

      let y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
          return Number(d['2017']);
        })])
        .range([height, 10])

      let xAxisCall = d3.axisBottom(x);
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxisCall)
        .selectAll("text")
          .attr("y", "10")
          .attr("x", "-5")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-40)")
          .on('mouseover', function(d) {
            d3.select(this)
            .transition()
            .duration(400)
            div.transition()
              .duration(400)
              .style("opacity", .9)
            div.text(d.population)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px")
              .style("text-align", "center")
              .style("line-height", "30px")
          })
          .on('mouseout', function() {
            div.transition()
              .duration(400)
              .style("opacity", 0);
          })

      let yAxisCall = d3.axisLeft(y)
        .ticks(10)
      g.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall)

      let rects = g.selectAll("rect")
        .data(data)

      let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      rects.enter()
        .append("rect")
          .attr("y", function(d) {
            return y(d.population);
          })
          .attr("x", function(d) {
            return x(d.name);
          })
          .attr("width", x.bandwidth)
          .attr("height", function(d) {
            return height - y(d.population);
          })
          .attr("fill", "mistyrose")
          .on('mouseover', function(d) {
            d3.select(this)
            .transition()
            .duration(400)
            .attr("fill", "darkblue");
            div.transition()
              .duration(400)
              .style("opacity", .9)
            div.text(d.population)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px")
              .style("text-align", "center")
              .style("line-height", "30px")

          })
          .on('mouseout', function() {
            d3.select(this)
            .transition()
            .duration(400)
            .attr("fill", "mistyrose");
            div.transition()
              .duration(400)
              .style("opacity", 0);
          })
