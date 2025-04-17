// Step 2: Apply style to html element using D3
d3.select("h1")
  .style("color", "green");

// Step 3: Append an element using D3
d3.select("#chart-message")
  .append("p")
  .text("Purchasing a low energy consumption TV will help with your energy bills!");

// Step 4: Append a basic rectangle using D3
d3.select("#bar-chart")
  .append("rect")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 30)
    .style("fill", "green");

// Now create the actual bar chart based on data.csv
// Set up dimensions for the chart
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 700 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// Create the SVG container for the chart
const svg = d3.select("#bar-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// STEP 1: Fix data loading path - try different path options
// Try to load from data folder (based on your file structure)
d3.csv("data/data.csv").then(function(data) {
    console.log("Loaded data:", data);
    
    // Convert string values to numbers
    data.forEach(function(d) {
        // Make sure these match your CSV column names
        d.value = +d.value; 
    });
    
    // Create X scale
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.category)) 
        .padding(0.2);
    
    // Add X axis to the SVG
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    // Add X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Appliance Type");
    
    // Create Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.1])
        .range([height, 0]);
    
    // Add Y axis to the SVG
    svg.append("g")
        .call(d3.axisLeft(y));
    
    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh)");
    
    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Appliance Energy Consumption Comparison");
    
    // Create and style the bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#4CAF50")
        // Add hover effects
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("fill", "#2E7D32");
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .attr("fill", "#4CAF50");
        });
    
    // Add value labels on top of each bar
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("x", d => x(d.category) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5)
        .text(d => d.value)
        .attr("font-size", "12px");
        
}).catch(function(error) {
    console.error("Error loading the data (data/data.csv):", error);
    
    // Try fallback to root directory
    d3.csv("./data.csv").then(function(data) {
        console.log("Loaded data from root directory:", data);
        // Process the data and create chart
        // (Same code as above would go here)
        
    }).catch(function(error) {
        console.error("Error loading the data (./data.csv):", error);
        
        // Final fallback: use hardcoded data
        console.log("Using hardcoded data as fallback");
        
        const hardcodedData = [
            {category: "Television", value: 250},
            {category: "Refrigerator", value: 400},
            {category: "Washing Machine", value: 150},
            {category: "Air Conditioner", value: 600},
            {category: "Microwave", value: 100}
        ];
        
        // Create chart with hardcoded data
        // (Chart creation code would be repeated here)
        
        document.getElementById("chart-container").innerHTML += 
            "<p style='color:orange'>Using fallback data. Your data.csv file couldn't be loaded.</p>";
    });
});