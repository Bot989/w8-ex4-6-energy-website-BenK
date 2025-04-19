// Select the SVG element for the line chart (you may need to add this to your HTML)
// If you don't have a dedicated SVG for the line chart, you'll need to add one to your HTML
const lineChartSvg = d3.select("#line-chart")
  .attr("width", 800)
  .attr("height", 500)
  .attr("viewBox", "0 0 800 500")
  .style("border", "1px solid black");

// Try to load the data
d3.csv("data/data.csv")
  .then(loadedData => {
    // Process the data
    const processedData = loadedData.map(d => {
      return {
        Submit_ID: d.Submit_ID,
        Brand_Reg: d.Brand_Reg,
        Model_No: d.Model_No,
        Family_Name: d["Family Name"],
        screensize: +d.screensize,
        Labelled_energy_consumption: +d["Labelled energy consumption (kWh/year)"]
      };
    });
    
    // For line chart, we need data in a different format
    // Here we'll show the relationship between screen size and energy consumption
    
    // Sort data by screen size for a proper line chart
    processedData.sort((a, b) => a.screensize - b.screensize);
    
    // Group by screen size and calculate average energy consumption
    const sizeGroups = d3.group(processedData, d => Math.floor(d.screensize));
    
    const lineData = Array.from(sizeGroups, ([key, value]) => {
      return {
        screensize: +key,
        avgEnergy: d3.mean(value, d => d.Labelled_energy_consumption),
        count: value.length // Number of TVs in this size group
      };
    });
    
    // Success message
    d3.select("#chart-message")
      .append("p")
      .text("Line chart data loaded successfully.")
    
    // Create line chart visualization
    createLineChart(lineData);
  })
  .catch(error => {
    
    // Error message
    d3.select("#chart-message")
      .append("p")
      .text("Unable to load data file for the line chart")
  });

// Define the createLineChart function
const createLineChart = (data) => {
  // Clear any existing elements
  lineChartSvg.selectAll("*").remove();
  
  // Calculate dimensions with margins
  const margin = { top: 40, right: 50, bottom: 60, left: 70 };
  const width = +lineChartSvg.attr("width") - margin.left - margin.right;
  const height = +lineChartSvg.attr("height") - margin.top - margin.bottom;
  
  // Create chart group with margins
  const chart = lineChartSvg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Set up scales
  const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.screensize) * 0.9, d3.max(data, d => d.screensize) * 1.1])
    .range([0, width]);
    
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.avgEnergy) * 1.1])
    .range([height, 0]);
  
  // Create the line generator
  const line = d3.line()
    .x(d => xScale(d.screensize))
    .y(d => yScale(d.avgEnergy))
    .curve(d3.curveMonotoneX); // Smoother curve
  
  // Add grid lines for y-axis
  chart.selectAll("line.grid")
    .data(yScale.ticks())
    .enter()
    .append("line")
    .attr("class", "grid")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", d => yScale(d))
    .attr("y2", d => yScale(d))
    .attr("stroke", "#e0e0e0")
    .attr("stroke-dasharray", "3,3");
  
  // Add the line path
  chart.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);
  
  // Add data points with size based on count
  chart.selectAll(".data-point")
    .data(data)
    .join("circle")
    .attr("class", "data-point")
    .attr("cx", d => xScale(d.screensize))
    .attr("cy", d => yScale(d.avgEnergy))
    .attr("r", d => Math.min(Math.max(3, d.count / 2), 8)) // Size based on count, with min/max limits
    .attr("fill", "steelblue")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5);
  
  // Add tooltip functionality
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#f9f9f9")
    .style("border", "1px solid #333")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("box-shadow", "2px 2px 6px rgba(0, 0, 0, 0.3)")
    .style("opacity", 0);
  
  chart.selectAll("circle")
    .on("mouseover", function(event, d) {
      d3.select(this)
        .attr("r", d => Math.min(Math.max(5, d.count / 2), 10))
        .attr("stroke-width", 2);
      
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      
      tooltip.html(`<strong>Screen Size:</strong> ${d.screensize}"<br>` +
                  `<strong>Avg Energy:</strong> ${d.avgEnergy.toFixed(2)} kWh/year<br>` +
                  `<strong>Number of Models:</strong> ${d.count}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .attr("r", d => Math.min(Math.max(3, d.count / 2), 8))
        .attr("stroke-width", 1.5);
      
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
  
  // Add axes
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d => `${d}"`);
  
  const yAxis = d3.axisLeft(yScale)
    .ticks(8);
  
  chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);
    
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);
  
  // Add axis labels
  chart.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Screen Size (inches)");
  
  chart.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Average Energy Consumption (kWh/year)");
  
  // Add title
  lineChartSvg.append("text")
    .attr("class", "chart-title")
    .attr("x", +lineChartSvg.attr("width") / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("TV Screen Size vs. Energy Consumption");
    
  // Add trend line annotation if there's a clear trend
  if (data.length > 3) {
    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];
    
    // Only add if there's a significant difference
    if (Math.abs(lastPoint.avgEnergy - firstPoint.avgEnergy) > 20) {
      // Draw trend line
      chart.append("line")
        .attr("class", "trend-line")
        .attr("x1", xScale(firstPoint.screensize))
        .attr("y1", yScale(firstPoint.avgEnergy))
        .attr("x2", xScale(lastPoint.screensize))
        .attr("y2", yScale(lastPoint.avgEnergy))
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5");
        
      // Add annotation
      chart.append("text")
        .attr("class", "trend-annotation")
        .attr("x", width / 2)
        .attr("y", yScale((firstPoint.avgEnergy + lastPoint.avgEnergy) / 2) - 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "red")
        .text("Energy consumption trend");
    }
  }
};