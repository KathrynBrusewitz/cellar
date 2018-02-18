// Format based on https://blog.webkid.io/responsive-chart-usability-d3/
// Slider from https://github.com/bobhaslett/d3-v4-sliders

var Chart = (function(d3) {
  // Globals
  var data, xMin, xMax, yMin, yMax, xScale, yScale, chart, infoSingle;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var dotColorDefault = "black",
    dotColorHover = "red",
    dotOpacityDefault = 0.2,
    dotOpacityHover = 1;

  // Load data, then initialize chart
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
    init
  );

  // Called once the data is loaded
  function init(csv) {
    data = csv;

    infoSingle = d3.select("#info-single");
    chart = d3.select("#chart");

    // Data domain range
    xMin = d3.min(data, d => d.price);
    xMax = d3.max(data, d => d.price);
    yMin = d3.min(data, d => d.points);
    yMax = d3.max(data, d => d.points);

    // Initialize Scales
    xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([0, width])
      .nice();
    yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0])
      .nice();

    // Initialize main svg
    chart = chart
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Axis
    chart
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));
    chart.append("g").call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

    // Axis Labels
    chart
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
      )
      .style("text-anchor", "middle")
      .text("Price (USD)");
    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Points");

    // Render the chart
    render();
  }

  function render() {
    // Data Join
    dots = chart.selectAll("circle").data(data);

    // Data Update
    dots.attr("class", "update");

    // Data Enter
    dots
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

    // Data Exit
    dots.exit().remove();
  }

  return {
    render: render
  };
})(d3);
