d3.csv("race.csv").then(data => {

    for (let d of data) {
        d.count = +d.count;
				d.count = d.count.toFixed(2);
    };

    // sort alphabetically
    data.sort((a, b) => d3.ascending(a.race, b.race));

    const height = 400,
          width = 500,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#chart1")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.race)) // data, returns array
        .range([margin.left, width - margin.right]) // pixels on page
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice() // nice rounds the top num
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed
    
    /* Update: simplfied axes */
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y)
				.tickFormat(d => d + "%"));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "maroon")
        .attr("x", d => x(d.race)) // x position attribute
        .attr("width", x.bandwidth()) // this width is the width attr on the element
        .attr("y", d => y(d.count)) // y position attribute
        .attr("height", d => y(0) - y(d.count)); // this height is the height attr on element
    
    bar.append('text') // add labels
        .text(d => d.count)
        .attr('x', d => x(d.race) + (x.bandwidth()/2))
        .attr('y', d => y(d.count) - 10)
        .attr('text-anchor', 'middle')
        .style('fill', 'black');

});
