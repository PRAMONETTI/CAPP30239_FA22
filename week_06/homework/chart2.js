d3.csv("mental_illness.csv").then((data) => {
  const height = 400,
    width = 600,
    innerRadius = 80, // if 0, full pie
    outerRadius = 175,
    labelRadius = 200;

    for (let d of data) {
      d.count = +d.count; //force a number
      d.count = d.count.toFixed(2);
    };

  // To group and count data
  // data = d3.rollup(data_raw, v => v.length, d => d.Mental_illness)
  // console.log(data)

  const arcs = d3.pie().value(d => d.count)(data); // jalo codigo para media luna
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
    .attr("stroke", "white") //all 3 make the spaces between colors
    .attr("stroke-width", 4)
    .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("fill", (d, i) => d3.schemeSet2[i]) // automated colors
    .attr("d", arc); // this is the path 'd' and we are passing the arc

   svg.append("g") // text around the pie
     .attr("font-size", 15)
     .attr("text-anchor", "middle")
     .selectAll("text")
     .data(arcs)
     .join("text")
     .attr("transform", d => `translate(${arcLabel.centroid(d)})`) // at center of the arc
     .selectAll("tspan")
     .data(d => {
       return [d.data.mental_illness, d.data.count];
     })
     .join("tspan")
     .attr("x", 0)
     .attr("y", (d, i) => `${i * 1.1}em`)
     .attr("font-weight", (d, i) => i ? null : "bold") // (i = iterator) make it bold for first round
     .text(d => d);

   svg.append("text") // text in the center
     .attr("font-size", 30)
     .attr("font-weight", "bold")
     .attr("text-anchor", "middle")
     .attr("alignment-baseline", "middle")
     .text("Mental Illness")
     .style("font-size", 20);
});