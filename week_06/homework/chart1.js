d3.json("a3cleanedonly2015.json").then(data => {
    let raceData = [
        {
            "race": "White",
            "count": 0
        },
        {
            "race": "Black",
            "count": 0
        },
        {
            "race": "Hispanic",
            "count": 0
        },
        {
            "race": "Asian",
            "count": 0
        },
        {
            "race": "Native",
            "count": 0
        },
        {
            "race": "Other",
            "count": 0
        },
    ]

    for (let d of data) {
        if (d.Race === "White") {
            raceData[0].count += 1; 
        } else if (d.Race === "Black") {
            raceData[1].count += 1; 
        } else if (d.Race === "Hispanic") {
            raceData[2].count += 1; 
        } else if (d.Race === "Asian") {
            raceData[3].count += 1; 
        } else if (d.Race === "Native") {
            raceData[4].count += 1; 
        } else if (d.Race === "Other"){
            raceData[5].count += 1; 
        }
    };

    let total_race_murders = 0

    for (let d of raceData) {
        total_race_murders += d.count
    };

    for (let d of raceData) {
        d.count = ((d.count / total_race_murders) * 100).toFixed(1)
    }

    raceData.sort((a, b) => d3.ascending(a.race, b.race));

    const height = 400,
          width = 500,
          margin = ({ top: 50, right: 50, bottom: 50, left: 80 })
          padding = 10;

    let svg = d3.select("#chart1")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser
    
    let x = d3.scaleBand()
        .domain(raceData.map(d => d.race)) // data, returns array
        .range([margin.left, width - margin.right]) // pixels on page
        .padding(0.4);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(raceData, d => d.count), 100]) // nice rounds the top num
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed
    
    /* Update: simplfied axes */
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x))
        .call(g => g.select(".domain")
                    .remove())
        .style("font-size","15px");
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y)
				.tickFormat(d => d + "%"))
        .call(g => g.select(".domain")
                    .remove())
        .style("font-size","15px");

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(raceData)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") 
        .attr("fill", "maroon")
        .attr("x", d => x(d.race))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count))
        .style("fill", "steelblue");
    
    bar.append('text') // add labels
        .text(d => d.count)
        .attr('x', d => x(d.race) + (x.bandwidth() / 2))
        .attr('y', d => y(d.count) - 10)
        .attr('text-anchor', 'middle')
        .style('fill', 'steelblue')
        .style("font-size","14px");

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right - 30)
      .attr("y", height + 5)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em")
      .style("font-size", "18px")
      .style("fill", "#004669")
      .style("font-weight", "bold")
      .text("Race");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", 5)
      .attr("dx", "-0.5em")
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .style("font-size", "18px")
      .style("fill", "#004669")
      .style("font-weight", "bold")
      .text("Percentage");

});
