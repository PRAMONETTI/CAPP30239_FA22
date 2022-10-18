/* Bar chart of visits to libraries*/

d3.csv("library_visits_jan22.csv").then(data => { // We begin by reading the data and transforming our
                                                // num variable into a number
    for (let d of data) {
        d.num= +d.num;
    }
    console.log(data);  // Establish the dimensions of the chart
    const height = 400,
        width = 600,
        margin = ({top: 25, right: 30, bottom: 35, left:50});

    let div = d3.select("#chart") // Create the svg object as a chart
                .append("svg")
                .attr("viewbox", [0,0,width,height]);

    const x = d3.scaleBand()      // Establish the constant x (the branch), its domain and the range of the margins of the axis
                .domain(data.map(d => d.branch)) 
                .range([margin.left, width - margin.right])
                .padding(0.1);

    const y = d3.scaleLinear()    //Establish the constant y (the number of visits), its domain and the range of the axis
                .domain([0, d3.max(data, d => d.num)]).nice()  
                .range([height - margin.bottom, margin.top]);
    
    const xAxis = g => g  // Create the actual axis X and call the constant x
        .attr("transform", `translate ( 0, ${height - margin.bottom +5})`)
        .call(d3.axisBottom(x));

    const yAxis = g => g  // Create the actual axis Y and call the constant y
        .attr("transform", `translate (${margin.left -5}, 0)`)
        .call(d3.axisLeft(y));

    div.append("g") // Append the X axis into our svg object
        .call(xAxis);

    div.append("g") // Append the Y axis into our svg object
        .call(yAxis);

    let bar = div.selectAll(".bar") // Create the bar objects to append to the chart
        .append("g")
        .data(data)
        .join("g")
        .attr("class","bar");
    
    bar.append("rect") // Append the bars into the chart, and establish their color and measures
        .attr("fill", "maroon")
        .attr("x", d => x(d.branch))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.num))
        .attr("height", d => y(0) - y(d.num));

    bar.append("text") // Append the tag of the number of visits above each bar
        .text(d => d.num)
        .attr('x', d => x(d.branch) + (x.bandwidth()/2))
        .attr('y', d => y(d.num) - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', 'steelgray');
        
});