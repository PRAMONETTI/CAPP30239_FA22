d3.json("jsons/df_chart2.json").then((data) => {

    console.log(data);
  
    const height = 500,
          width = 500,
          innerRadius = 50, // if 0, full pie
          outerRadius = 175,
          labelRadius = 200;
   
      let newData = [
        {
          "category": "Yes",
          "amount": 0
        },
        {
          "category": "No",
          "amount": 0
        },
      ]
  
      for (let d of data) {
        if (d.P3_8_Y !== null) {
            newData[0].amount += d.P3_8_Y;
        }
        if (d.P3_8_N !== null) {
            newData[1].amount += d.P3_8_N;
        }
      };
  
      let total_obs = 0
  
      for (let d of newData) {
        total_obs += d.amount
      };
  
      for (let d of newData) {
          d.share = ((d.amount / total_obs) * 100).toFixed(1)
      }
      
      console.log(newData)
  
    const arcs = d3.pie().value(d => d.share)(newData);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
    const scale = ["#8e7cc3", "#bcb1d7"];
  
    const svg = d3.select("#chart2")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
      .attr("stroke", "white") //all 3 make the spaces between colors
      .attr("stroke-width", 10)
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d, i) => scale[i]) // automated colors
      .attr("d", arc); // this is the path 'd' and we are passing the arc
  
     svg.append("g") // text around the pie
      .attr("font-size", 16)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`) // at center of the arc
      .selectAll("tspan")
      .data(d => {return [d.data.category, d.data.share];})
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i) => `${i * 1.2}em`)
      .attr("fill", "white")
      .text(d => d);
  
  });