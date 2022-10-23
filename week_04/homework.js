/* D3 Line Chart */

const height = 500, //Start by creating the space of the chart
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")  // We create our chart svg object
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('long-term-interest-canada.csv').then(data => { // Loading the data
    let timeParse = d3.timeParse("%Y-%m")

    for (let d of data) {    // Modify the format of our variables according to what we need
        d.Num = +d.Num;
        d.Month = timeParse(d.Month);
    }
    console.log(data);

    let x = d3.scaleTime()  // X must have a domain defined as a time scale.
        .domain(d3.extent(data, d => d.Month))
        .range([margin.left, width-margin.right]);

    let y = d3.scaleLinear()  // For y, the domain is a linear scale
        .domain([0, d3.max(data, d => d.Num)])
        .range([height - margin.bottom, margin.top]);
    
    svg.append("g")  // Append the x axis
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));
    
    svg.append("g") // Append the y axis
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y)
       .tickSizeOuter(0)
       .tickFormat(d => d + "%")
       .tickSize(-width));

     svg.append("text") // Append all text and labels of x-axis.
       .attr("class", "x-label")
       .attr("text-anchor", "end")
       .attr("x", width - margin.right)
       .attr("y", height)
       .attr("dx", "0.5em")
       .attr("dy", "-0.5em") 
       .text("Month");
    
     svg.append("text") // Append all text and labels of y-axis.
       .attr("class", "y-label")
       .attr("text-anchor", "end")
       .attr("x", -margin.top/2)
       .attr("dx", "-0.5em")
       .attr("y", 10)
       .attr("transform", "rotate(-90)")
       .text("Interest rate");

    let line = d3.line()  // We create the line to be added to the chart
        .x(d => x(d.Month))
        .y(d => y(d.Num));
    
    svg.append("path") // Append the line to the chart
        .datum(data)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red");

  });