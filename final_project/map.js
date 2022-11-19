const height = 610,
  width = 975;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.json("mexico.json").then(mx => {
    console.log(mx)

  const states = topojson.feature(mx, mx.objects.MEX_adm1); // Map simple geometries
  console.log(states)

  const path = d3.geoPath();

  svg.append("g")
    .selectAll("path")
    .data(states.features)
    .join("path")
    .attr("stroke", "#999")
    .attr("fill", "red")
    // .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc')
    .attr("d", path);

});