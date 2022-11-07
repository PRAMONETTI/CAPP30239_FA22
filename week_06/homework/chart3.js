const height = 600,
    width = 700,
    margin = ({ top: 80, right: 80, bottom: 80, left: 80 });
    
const svg = d3.select("#chart3")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.json("a3cleanedonly2015.json").then(data => {
    let newData = [
      {
        "month": "Jan",
        "count": 0
      },
      {
        "month": "Feb",
        "count": 0
      },
      {
        "month": "Mar",
        "count": 0
      },
      {
        "month": "Apr",
        "count": 0
      },
      {
        "month": "May",
        "count": 0
      },
      {
        "month": "Jun",
        "count": 0
      },
      {
        "month": "Jul",
        "count": 0
      },
      {
        "month": "Aug",
        "count": 0
      },
      {
        "month": "Sep",
        "count": 0
      },
      {
        "month": "Oct",
        "count": 0
      },
      {
        "month": "Nov",
        "count": 0
      },
      {
        "month": "Dec",
        "count": 0
      }
]
  
for (let d of data) {
  let m = d.Date.substring(0, 2)
  if (m === "1/") {
      newData[0].count += 1; 
  } else if (m === "2/") {
      newData[1].count += 1; 
  } else if (m === "3/") {
      newData[2].count += 1; 
  } else if (m === "4/") {
      newData[3].count += 1; 
  } else if (m === "5/") {
      newData[4].count += 1; 
  } else if (m === "6/") {
      newData[5].count += 1; 
  } else if (m === "7/") {
      newData[6].count += 1; 
  } else if (m === "8/") {
      newData[7].count += 1; 
  } else if (m === "9/") {
      newData[8].count += 1; 
  } else if (m === "10") {
      newData[9].count += 1; 
  } else if (m === "11") {
      newData[10].count += 1; 
  } else if (m === "12") {
      newData[11].count += 1; 
  }
};
    let timeParse = d3.timeParse("%b");

    for (let d of newData) {
        d.month = timeParse(d.month); // using timeParse function we created above
    }

    let x = d3.scaleTime()
        .domain(d3.extent(newData, d => d.month)) // returns an array
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain([0,d3.max(newData, d => d.count)]).nice() // nice to round up axis tick
        .range([height - margin.bottom, margin.top]);

    //let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthNames = ["", "Feb", "", "Apr", "", "Jun", "", "Aug", "", "Oct", "", "Dec"];

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")
      .call(d3.axisLeft(y)
              .tickSizeOuter(0)
              .tickSize(-width + margin.right + margin.left))
      .call(g => g.select(".domain").remove())
      .style("font-size", "20px");

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
              .tickSizeOuter(0)
              .tickFormat(d => monthNames[d.getMonth()]))
      .call(g => g.select(".domain").remove())
      .style("font-size","20px");

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height + 5)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em")
      .style("font-size", "25px")
      .style("fill", "#004669")
      .style("font-weight", "bold")
      .text("Month");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top / 2)
      .attr("dx", "-0.5em")
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .style("font-size", "25px")
      .style("fill", "#004669")
      .style("font-weight", "bold")
      .text("Total Number of Murders");
    
    let line = d3.line()
      .x(d => x(d.month))
      .y(d => y(d.count));

    svg.append("path")
      .datum(newData)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue");

    svg.selectAll(".dot")
      .data(newData.filter(function(d) { return d; }))
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", line.x())
      .attr("cy", line.y())
      .attr("r", 5);

  });