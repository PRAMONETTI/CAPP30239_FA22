const files = ["gender/female.csv","gender/male.csv"]

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

const xAxis = svg.append("g")  // Create the actual axis X and call the constant x
    .attr("transform", `translate ( 0, ${height - margin.bottom +5})`)

const y = d3.scaleLinear()    //Establish the constant y (the number of visits), its domain and the range of the axis 
    .range([height - margin.bottom, margin.top]);

const yAxis = svg.append("g")  // Create the actual axis Y and call the constant y
    .attr("transform", `translate (${margin.left -5}, 0)`)

function UpdateChart(file) {
    svg.selectAll(".bar").remove()
    d3.csv(file).then(data => { // We begin by reading the data and transforming our
        // num variable into a number
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

UpdateChart(files[0]);

const select = document.getElementById('select');
select.addEventListener('change', function handleChange(event) {
    const index = parseInt(event.target.value);
    UpdateChart(files[index])
  });