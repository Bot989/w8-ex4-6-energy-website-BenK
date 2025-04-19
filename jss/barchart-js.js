// Select h1 and style it
d3.select("h1")
  .style("color", "red");  

// Select the correct SVG element from the HTML and resize it
const svg = d3.select("#bar-chart")
  .attr("width", 800)
  .attr("height", 700) // Increased height for better spacing
  .attr("viewBox", "0 0 800 700") 
  .style("border", "1px solid black");

// Try to load the real data
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
    
    // Filter and prepare data for visualization
    // 1. Group by brand to get one representative per brand
    const brandGroups = d3.group(processedData, d => d.Brand_Reg);
    
    // 2. Get the largest screen model for each brand
    const brandsData = Array.from(brandGroups, ([key, value]) => {
      // Find max screensize for this brand
      const maxModel = d3.max(value, d => d.screensize);
      // Return the model with the max screensize
      return value.find(d => d.screensize === maxModel);
    });
    
    // 3. Sort by screensize descending
    brandsData.sort((a, b) => b.screensize - a.screensize);
    
    // 4. Limit to top 20 brands for readability
    const topBrands = brandsData.slice(0, 20);
    
    // Display success message
    d3.select("#chart-message")
      .append("p")
      .text("Data loaded successfully! Showing largest model for top 20 brands.")
      .style("color", "green");
    
    // Create visualization with processed data
    createBarChart(topBrands);
  })
  .catch(error => {
    // Log the error
    console.error("Error loading CSV:", error);
    
    // Display error message
    d3.select("#chart-message")
      .append("p")
      .text("Unable to load data file. Please check the console for details.")
      .style("color", "red");
  });

// Define the improved createBarChart function
const createBarChart = (data) => {
  // Clear any existing elements
  svg.selectAll("*").remove();
  
  // Calculate dimensions with more generous margins
  const margin = { top: 40, right: 30, bottom: 60, left: 150 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;
  
  // Create chart group with margins
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Set up scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.screensize) * 1.1]) // Add 10% padding
    .range([0, width]);
    
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.Brand_Reg))
    .range([0, height])
    .padding(0.3); // Increased padding between bars
  
  // Add alternating background for readability
  chart.selectAll(".bar-background")
    .data(data)
    .join("rect")
    .attr("class", "bar-background")
    .attr("x", 0)
    .attr("y", (d, i) => yScale(d.Brand_Reg))
    .attr("width", width)
    .attr("height", yScale.bandwidth())
    .attr("fill", (d, i) => i % 2 === 0 ? "#f8f8f8" : "#ffffff")
    .attr("opacity", 0.5);
  
  // Create and style the bars
  chart.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", d => `bar bar-${d.Brand_Reg}`)
    .attr("x", 0)
    .attr("y", d => yScale(d.Brand_Reg))
    .attr("width", d => xScale(d.screensize))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5);
  
  // Add data labels on the bars
  chart.selectAll(".size-label")
    .data(data)
    .join("text")
    .attr("class", "size-label")
    .attr("x", d => xScale(d.screensize) - 5)
    .attr("y", d => yScale(d.Brand_Reg) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text(d => `${d.screensize}"`)
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
  
  // Add brand labels - moved outside for clarity
  chart.selectAll(".brand-label")
    .data(data)
    .join("text")
    .attr("class", "brand-label")
    .attr("x", -10)
    .attr("y", d => yScale(d.Brand_Reg) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .attr("font-size", "12px")
    .text(d => d.Brand_Reg)
    .style("font-weight", d => d.screensize > 75 ? "bold" : "normal");
  
  // Add axes
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d => `${d}"`);
  
  const yAxis = d3.axisLeft(yScale);
  
  chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);
    
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "11px"); // Make y-axis text smaller for better fit
  
  // Add axis labels
  chart.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .text("Screen Size (inches)");
  
  // Add title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", +svg.attr("width") / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Largest TV Screen Size by Brand");
};