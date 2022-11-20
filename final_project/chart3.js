const files = ["tools/desktop.csv","tools/laptop.csv","tools/tv.csv", "tools/tablet.csv",
"tools/smartphone.csv","tools/internet.csv"]


function UpdateChart(file) {
    const chart = document.getElementById('chart3');
    chart.replaceChildren();
    d3.csv(file).then(data => { // We begin by reading the data and transforming our
        // num variable into a number
    for (let d of data) {
    d.Percentage= +d.Percentage;
    }
    console.log(data);  // Establish the dimensions of the chart
    const height = 500,
    width = 700,
    margin = ({top: 25, right: 30, bottom: 35, left:50});

    let div = d3.select("#chart3") // Create the svg object as a chart
    .append("svg")
    .attr("viewbox", [0,0,width,height]);

    const x = d3.scaleBand()      // Establish the constant x (the branch), its domain and the range of the margins of the axis
    .domain(data.map(d => d.Region)) 
    .range([margin.left, width - margin.right])
    .padding(0.1);

    const y = d3.scaleLinear()    //Establish the constant y (the number of visits), its domain and the range of the axis
    .domain([0, d3.max(data, d => d.Percentage)]).nice()  
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
    .attr("fill", "green")
    .attr("x", d => x(d.Region))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.Percentage))
    .attr("height", d => y(0) - y(d.Percentage));

    bar.append("text") // Append the tag of the number of visits above each bar
    .text(d => d.Percentage)
    .attr('x', d => x(d.Region) + (x.bandwidth()/2))
    .attr('y', d => y(d.Percentage) - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', 'red');
});

}

UpdateChart(files[0]);

const select = document.getElementById('select');
select.addEventListener('change', function handleChange(event) {
    const index = parseInt(event.target.value)
    UpdateChart(files[index])
  });