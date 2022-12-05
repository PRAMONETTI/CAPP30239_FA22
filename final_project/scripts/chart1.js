const files = ["gender/female.csv","gender/male.csv"] // The files used for the chart

const chart = document.getElementById('chart1');
const height = 500;
const width = 700;
const margin = ({top: 25, right: 30, bottom: 35, left:50});

const svg = d3.select("#chart1") // Create the svg object as a chart
    .append("svg")
    .attr("viewbox", [0,0,width,height]);

const x = d3.scaleBand()    
    .range([margin.left, width - margin.right])
    .padding(0.1);


// The axis are created only once
const xAxis = svg.append("g")  
    .attr("transform", `translate ( 0, ${height - margin.bottom +5})`)

const y = d3.scaleLinear()   
    .range([height - margin.bottom, margin.top]);

const yAxis = svg.append("g") 
    .attr("transform", `translate (${margin.left -5}, 0)`) 


function UpdateChart(file) {
    svg.selectAll(".bar").remove() // If previous bars exist, I remove them and append new ones.
    d3.csv(file).then(data => {  
    for (let d of data) {
    d.Percentage= +d.Percentage;
    }

    x.domain(data.map(d => d.Possibility));

    xAxis.call(d3.axisBottom(x));

    y.domain([0, d3.max(data, d => d.Percentage)]).nice()  

    yAxis.call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // Create the bar objects to append to the chart
    .data(data)
    .join("g")
    .attr("class","bar");

    bar.append("rect") 
    .attr("fill", "#bcb1d7")
    .attr("x", d => x(d.Possibility))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.Percentage)).transition().duration(1500)
    .attr("height", d => y(0) - y(d.Percentage));

    bar.append("text") // Append the tag of the number of visits above each bar
    .text(d => d.Percentage)
    .attr('x', d => x(d.Possibility) + (x.bandwidth()/2))
    .attr('y', d => y(d.Percentage) - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white');
});

}

UpdateChart(files[0]); // I call the first file of the array to display when the page is opened

const select = document.getElementById('select'); // Event listener to change the bar chart
select.addEventListener('change', function handleChange(event) {
    const index = parseInt(event.target.value);
    UpdateChart(files[index])
  });