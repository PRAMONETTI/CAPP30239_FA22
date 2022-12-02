files = ["tools/desktop_map.csv","tools/laptop_map.csv","tools/tv_map.csv",
"tools/tablet_map.csv","tools/smartphone_map.csv","tools/internet_map.csv"]

const tooltip = d3.select("body").append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 550,
  width = 975;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

Promise.all([
  d3.csv("tools/desktop_map.csv"),
  d3.json("jsons/mexico.json")
]).then(([data, mx]) => {
  const dataById = {};

  for (let d of data) {
    d.percentage = +d.percentage;
    //making a lookup table from the array (unemployment data)
    dataById[d.NAME_1] = d;
  }

  const states = topojson.feature(mx, mx.objects.MEX_adm1);

  // Quantize evenly breakups domain into range buckets
  const color = d3.scaleQuantize()
    .domain([0, 100]).nice()
    .range(d3.schemeReds[5]);

  const projection = d3.geoMercator()
    .scale(1300)
    .center([-102, 26]);

  const path = d3.geoPath()
  .projection(projection);

  d3.select("#legend")
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ["50", "60", "70", "80", "90+"],
          d3.schemeReds[5]
        ),
        { title: "(%)" }
      ));
console.log(states.features)
  svg.append("g")
    .selectAll("path")
    .data(states.features)
    .join("path")
    .attr("fill", d => (d.properties.NAME_1 in dataById) ? color(dataById[d.properties.NAME_1].percentage) : '#ccc')
    .attr("d", path)
    .on("mousemove", function (event, d) {
      let info = dataById[d.properties.NAME_1];
      tooltip
        .style("visibility", "visible")
        .html(`${info.NAME_1}<br>${info.percentage}%`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "green");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => (d.properties.NAME_1 in dataById) ? color(dataById[d.properties.NAME_1].percentage) : '#ccc');
    });
});

//UpdateMap(files[0])

const select = document.getElementById('select');
select.addEventListener('change', function handleChange(event) {
    const index = parseInt(event.target.value);
    UpdateMap(files[index])
  });