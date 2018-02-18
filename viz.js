// Format based on https://blog.webkid.io/responsive-chart-usability-d3/
// Slider from https://github.com/bobhaslett/d3-v4-sliders

var Chart = (function(d3) {
  var data, xMin, xMax, yMin, yMax, xScale, yScale, chart, width, height;
  var dotColorDefault, dotColorHover, dotOpacityDefault, dotOpacityHover;
  var margin = {};
  var infoSingle, priceSlider, sliderValue;

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

    margin = { top: 20, right: 20, bottom: 50, left: 50 };
    width = 1000 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;

    dotColorDefault = "black";
    dotColorHover = "red";
    dotOpacityDefault = 0.2;
    dotOpacityHover = 1;
    sliderValue = 100;

    // Mins and maxes of data domain range
    xMin = d3.min(data, d => d.price);
    xMax = d3.max(data, d => d.price);
    yMin = d3.min(data, d => d.points);
    yMax = d3.max(data, d => d.points);

    infoSingle = d3.select("#info-single");
    priceSlider = d3
      .select("#price-slider")
      .attr("min", xMin)
      .attr("max", xMax)
      .property("value", sliderValue)
      .on("input", function() {
        // Update the value on slider movement
        updateSlider(+this.value);
      });

    // Initialize Y Scale
    yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0])
      .nice();

    // Initialize svg
    chart = d3
      .select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

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

    // Vertical Axis
    //   tickFormat removes float values (points are whole numbers)
    chart.append("g").call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

    // Render the chart
    render();
  }

  function render() {
    // Redraw X Scale
    xScale = d3
      .scaleLinear()
      .domain([xMin, sliderValue])
      .range([0, width])
      .nice();

    // Data Join
    dots = chart.selectAll("circle").data(data);

    // Update
    dots.attr("class", "update");

    // Enter
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

    dots.exit().remove();

    // Redraw Horizontal Axis
    chart
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));
  }

  function updateSlider(value) {
    sliderValue = value;
    render();
  }

  return {
    render: render
  };
})(d3);
