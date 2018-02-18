// Format based on https://blog.webkid.io/responsive-chart-usability-d3/

var Chart = (function(d3) {
  // Globals
  var dataset, chart, infoSingle;
  var xMin, xMax, yMin, yMax, xScale, yScale;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var dotColorDefault = "black",
    dotColorHover = "red",
    dotOpacityDefault = 0.2,
    dotOpacityHover = 1,
    patt = new RegExp("All");
  var varietyFilter = document.getElementById("variety-filter"),
    countryFilter = document.getElementById("country-filter");

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
    dataset = csv;

    infoSingle = d3.select("#info-single");
    chart = d3.select("#chart");

    // The following filters could be refactored into a function,
    //   but I don't really have time right now...

    // give function a filter
    createFilter(varietyFilter, "variety");
    createFilter(countryFilter, "country");

    // Data domain range
    xMin = d3.min(dataset, d => d.price);
    xMax = d3.max(dataset, d => d.price);
    yMin = d3.min(dataset, d => d.points);
    yMax = d3.max(dataset, d => d.points);

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
    render(dataset);
  }

  function render(data) {
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
            "<h2>" +
            d.variety +
            "</h2>" +
            "<p>" +
            d.description +
            "</p>" +
            "<p><b>Country: </b>" +
            d.country +
            " " +
            "<b>Province: </b>" +
            " " +
            d.province +
            " " +
            "<b>Region: </b>" +
            " " +
            d.region_1 +
            " " +
            "<b>Winery: </b>" +
            d.winery +
            "</p>" +
            "<p><b>Points: </b>" +
            d.points +
            " " +
            "<b>Price: </b>$" +
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

  function createFilter(filter, property) {
    var array = [];
    filter.onchange = function() {
      filterData();
    };
    dataset.forEach(function(d) {
      if (!array.includes(d[property])) {
        array.push(d[property]);
      }
    });
    _.sortBy(array).forEach(function(v) {
      var el = document.createElement("option");
      el.textContent = v;
      el.value = v;
      filter.appendChild(el);
    });
  }

  function filterData() {
    var res1 = patt.test(varietyFilter.value);
    var res2 = patt.test(countryFilter.value);
    var filtered = dataset;

    if (!res1) {
      filtered = filtered.filter(function(d) {
        return d.variety == varietyFilter.value;
      });
    }

    if (!res2) {
      filtered = filtered.filter(function(d) {
        return d.country == countryFilter.value;
      });
    }

    render(filtered);
  }

  return {
    render: render
  };
})(d3);
