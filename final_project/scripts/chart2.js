d3.json("jsons/df_chart2.json").then((data) => { // Beginning with the pie chart

    console.log(data);
  
    const height = 500,
          width = 500,
          innerRadius = 30, 
          outerRadius = 165,
          labelRadius = 200;
    
    // Transforming the data into the required format 

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
  
    const arcs = d3.pie().value(d => d.share)(newData);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
    const scale = ["#8e7cc3", "#bcb1d7"];
  
    const svg = d3.select("#chart2") // Creating the svg
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
      .attr("fill", (d, i) => scale[i]) 
      .attr("d", arc); 
  
     svg.append("g") 
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

  // Second chart

  d3.csv("motives/motives.csv").then(data => {

    for (let d of data) {
        d.percentage = +d.percentage;
    };

    const tooltip = d3.select("body").append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 55, left: 65 });

    let svg = d3.select("#chart2_2")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.percentage)]).nice()
        .range([margin.left, width - margin.right]);
    
    let y = d3.scaleBand()
        .domain(data.map(d => d.motive))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar")
        .on("mousemove", function (event, d) {
          let info = d.motive;
          tooltip // Mouse effect - Labels did not look that good, so I prefer to show them when the user points a bar
            .style("visibility", "visible")
            .html(`${info}`)
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
          d3.select(this).attr("fill", "lightyellow");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
        });

    bar.append("rect") // add rect to bar group
        .attr("fill", "#8e7cc3")
        .attr("x", margin.left)
        .attr("width", d => x(d.percentage))
        .attr("y", d => y(d.motive))
        .attr("height", y.bandwidth());
    
    bar.append('text')
        .text(d => d.percentage)
        .attr('x', d => margin.left + x(d.percentage) - 10)
        .attr('y', d => y(d.motive) + (y.bandwidth()/2))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('fill', 'white');

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em") 
      .attr("dy", "-0.5em") 
      .attr('fill', 'white')
      .text("Share %");
});