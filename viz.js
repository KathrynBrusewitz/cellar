var data;

var margin = { top: 20, right: 20, bottom: 50, left: 50 },
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var chart = d3
  .select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var slider = d3.select("#priceSlider").attr("class", "slider"),
  infoSingle = d3.select("#info-single");

var dotColorDefault = "black",
  dotColorHover = "red",
  dotOpacityDefault = 0.2,
  dotOpacityHover = 1;

// read in data
//   load "wine-data-simple" for first 300 rows
//   load "wine-data" for entire dataset (130k rows)
d3.csv(
  "wine-data-simple.csv",
  function(w) {
    return {
      country: w.country,
      description: w.description,
      designation: w.designation,
      points: +w.points,
      price: +w.price,
      province: w.province,
      region_1: w.region_1,
      region_2: w.region_2,
      taster_name: w.taster_name,
      taster_twitter_handle: w.taster_twitter_handle,
      title: w.title,
      variety: w.variety,
      winery: w.winery
    };
  },
  function(dataset) {
    data = dataset;
    buildViz();
  }
);

function buildViz() {
  // Mins and maxes of data range (for domain)
  var xMin = d3.min(data, d => d.price), // 4
    xMax = d3.max(data, d => d.price), // 3300
    yMin = d3.min(data, d => d.points), // 80
    yMax = d3.max(data, d => d.points); // 100

  // Map data to the pixel range (for drawing)
  //  .nice() rounds the domain to 'nice' round values
  var xScale = d3
      .scaleLinear() // scaleSqrt
      .domain([xMin, xMax])
      .range([0, width])
      .nice(),
    yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0])
      .nice();

  // Draw dots
  var dot = chart
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("fill", dotColorDefault)
    .attr("opacity", dotOpacityDefault)
    .attr("cx", function(d) {
      return xScale(d.price);
    })
    .attr("cy", function(d) {
      return yScale(d.points);
    })
    .attr("r", 5)
    .on("mouseover", function(d) {
      this.setAttribute("fill", dotColorHover);
      this.setAttribute("opacity", dotOpacityHover);
      infoSingle.html(
        "<h1>" +
          d.title +
          "</h1>" +
          "<p>" +
          d.description +
          "</p>" +
          "<p><b>Points: </b>" +
          d.points +
          "</p>" +
          "<p><b>Price: </b>" +
          d.price +
          "</p>"
      );
    })
    .on("mouseout", function(d) {
      this.setAttribute("fill", dotColorDefault);
      this.setAttribute("opacity", dotOpacityDefault);
    });

  // Horizontal Axis
  //   transform translates the axis to bottom of chart
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // Vertical Axis
  //   tickFormat removes float values (points are whole numbers)
  chart.append("g").call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

  // Horizontal Axis Label
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Price (USD)");

  // Vertical Axis Label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Points");
}
