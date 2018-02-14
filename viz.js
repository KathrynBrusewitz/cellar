var dataset;

// read in data
d3.csv(
  "wine-data.csv",
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
  function(data) {
    dataset = data;
    vizReady();
  }
);

function vizReady() {
  console.log("loaded dataset");
  console.log(dataset[0]);
}
