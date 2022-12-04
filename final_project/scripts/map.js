files = ["tools/desktop_map.csv","tools/laptop_map.csv","tools/tv_map.csv",
"tools/tablet_map.csv","tools/smartphone_map.csv","tools/internet_map.csv"]

const tooltip = d3.select("body").append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 550,
  width = 975;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);
  
function UpdateMap(file) {
    svg.selectAll(".g").remove();
    const legend = document.getElementById("legend");
    if (legend.firstElementChild) {
      legend.removeChild(legend.firstElementChild);
    };

    Promise.all([
    d3.csv(file),
    d3.json("jsons/mexico.json")
    ]).then(([data, mx]) => {
        const dataById = {};
    
    let values = []
    
    for (let d of data) {
        d.percentage = +d.percentage;
        values.push(d.percentage);
        //making a lookup table from the array (unemployment data)
        dataById[d.NAME_1] = d;
    }

    const states = topojson.feature(mx, mx.objects.MEX_adm1);

    const max_value = Math.max(...values);
    const min_value = Math.min(...values);

    const range_values = max_value-min_value
    const cuts = (range_values / 4)

  // Quantize evenly breakups domain into range buckets
    const color = d3.scaleQuantize()
      .domain([min_value, max_value]).nice()
      .range(d3.schemeBuPu[5]);

    const projection = d3.geoMercator()
      .scale(1300)
      .center([-102, 26]);

    const path = d3.geoPath()
      .projection(projection);

    const legend_values = [min_value.toFixed(2), (min_value + cuts).toFixed(2),
      (min_value + 2* cuts).toFixed(2), (max_value-cuts).toFixed(2), max_value.toFixed(2)]
    
    d3.select("#legend")
      .node()
      .appendChild(
        Legend(
          d3.scaleOrdinal(
            legend_values,
            d3.schemeBuPu[5]
          ),
          { title: "(%) of households with access to the tool" }
        ));
   
    svg.append("g")
      .selectAll("path")
      .data(states.features)
      .join("path")
      .attr("fill", d => (d.properties.NAME_1 in dataById) ? color(dataById[d.properties.NAME_1].percentage) : '#ccc')
      .attr("d", path)
      .on("mousemove", function (event, d) {
        let info = dataById[d.properties.NAME_1];
        tooltip
          .style("visibility", "visible")
          .html(`${info.NAME_1}<br>${info.percentage}%`)
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
        d3.select(this).attr("fill", "lightyellow");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", d => (d.properties.NAME_1 in dataById) ? color(dataById[d.properties.NAME_1].percentage) : '#ccc');
      });
  });
}

function UpdateDescription(index) {
  console.log(index)
  const description = document.getElementById("map_description")
  if (index == 0) {
    description.innerHTML = "In the best cases, the Southcenter of Mexico shows that around 3 out of 10 households have a desktop. For the Southwest region, is barely 1 out of 10 households."
  }
  else if (index == 1) {
    description.innerHTML = "The access to a laptop ranges from 20 to 50%. Again, the Southwest region shows less access to a laptop than the rest of the country."
  }
  else if (index == 2) {
    description.innerHTML = "As an alternative to school attendance, the government offered a series of classes via national TV. However, again, a good share of households do not have access to a TV."
  }
  else if (index == 3) {
    description.innerHTML = "Tablets, while useful for education, might be the less common type of IT to be found in households. In a couple of states of the Northeast, we can see that 3 out of 10 households have a tablet. For the rest of the country, the percentage is much lower."
  }
  else if (index == 4) {
    description.innerHTML = "Smartphone is the most common type of IT to which Mexican households have access. However, we have to consider that there are some limitations in terms of it's use as a tool to attend to virtual classes, compared to a laptop or even a tablet."
  }
  else if (index == 5) {
  description.innerHTML = "Internet, which is an essential tool on these days, shows the biggest breach among states. While some states are mostly covered, in other states only 1 out of 3 households has acces to internet."
  }
}

UpdateMap(files[0])
UpdateDescription(0)

const select = document.getElementById('select');
select.addEventListener('change', function handleChange(event) {
    const index = parseInt(event.target.value);
    console.log(index)
    UpdateMap(files[index]);
    UpdateDescription(index);
  });
