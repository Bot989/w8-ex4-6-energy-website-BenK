// Create a pie chart visualization for the screen size distribution
// Select the SVG element - using Piechart SVG
const pieChartSvg = d3.select("#pie-chart");

//  Load the data
d3.csv("data/data.csv")
  .then(loadedData => {
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
    
    // Group the data by screen size ranges for better visualization
    const sizeRanges = [
      { min: 0, max: 32, label: "Small (≤ 32\")" },
      { min: 32, max: 43, label: "Medium (33-43\")" },
      { min: 43, max: 55, label: "Large (44-55\")" },
      { min: 55, max: 65, label: "Extra Large (56-65\")" },
      { min: 65, max: 1000, label: "Super Size (> 65\")" }
    ];
    
    // Count TVs in each category
    const pieData = sizeRanges.map(range => {
      const count = processedData.filter(
        d => d.screensize > range.min && d.screensize <= range.max
      ).length;
      
      return {
        category: range.label,
        count: count,
        minSize: range.min,
        maxSize: range.max
      };
    }).filter(d => d.count > 0); // Remove empty categories
    
    // Display success message
    d3.select("#chart-message")
      .append("p")
      .text("Pie chart data loaded successfully! Showing distribution of TV screen sizes.")
      .style("color", "green");
    
    // Create pie chart visualization
    createPieChart(pieData);
  })
  .catch(error => {
    // Log the error
    console.error("Error loading CSV for pie chart:", error);
    
    // Display error message
    d3.select("#chart-message")
      .append("p")
      .text("Unable to load data file for pie chart. Please check the console for details.")
      .style("color", "red");
  });

// Define the createPieChart function
const createPieChart = (data) => {
  // Clear any existing elements
  pieChartSvg.selectAll("*").remove();
  
  // Calculate dimensions
  const width = +pieChartSvg.attr("width");
  const height = +pieChartSvg.attr("height");
  const radius = Math.min(width, height) / 2 * 0.7; // 70% of the minimum dimension
  
  // Create chart group
  const chart = pieChartSvg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
  // Set up color scale - using a categorical color scheme
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.category))
    .range(d3.schemeCategory10);
  
  // Create pie layout
  const pie = d3.pie()
    .value(d => d.count)
    .sort(null); // Don't sort, preserve original order
  
  // Create arc generator
  const arc = d3.arc()
    .innerRadius(0) // No inner radius for a pie chart (not a donut)
    .outerRadius(radius);
  
  // Create outer arc for labels
  const outerArc = d3.arc()
    .innerRadius(radius * 1.1)
    .outerRadius(radius * 1.1);
  
  // Generate pie chart segments
  const segments = chart.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");
  
  // Add colored segments
  segments.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.category))
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("opacity", 0.8)
    // Add hover effects
    .on("mouseover", function() {
      d3.select(this)
        .style("opacity", 1)
        .attr("stroke-width", 3);
    })
    .on("mouseout", function() {
      d3.select(this)
        .style("opacity", 0.8)
        .attr("stroke-width", 2);
    });
  
  // Add percentage labels inside the pie
  segments.append("text")
    .attr("transform", d => {
      // Only show label if segment is large enough
      if (d.endAngle - d.startAngle < 0.3) return "";
      return `translate(${arc.centroid(d)})`;
    })
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text(d => {
      const percent = (d.data.count / d3.sum(data, d => d.count) * 100).toFixed(1);
      // Only show percentage if segment is large enough
      if (d.endAngle - d.startAngle < 0.3) return "";
      return `${percent}%`;
    });
  
  // Add lines to external labels
  segments.append("polyline")
    .attr("points", d => {
      // Only add lines for segments large enough to need external labels
      if (d.endAngle - d.startAngle < 0.3) {
        const pos = outerArc.centroid(d);
        return [arc.centroid(d), pos, pos];
      }
      const pos = outerArc.centroid(d);
      const midAngle = (d.startAngle + d.endAngle) / 2;
      pos[0] = radius * 1.15 * (midAngle < Math.PI ? 1 : -1);
      return [arc.centroid(d), outerArc.centroid(d), pos];
    })
    .attr("stroke", d => color(d.data.category))
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .style("opacity", d => (d.endAngle - d.startAngle < 0.3) ? 0 : 0.8);
  
  // Add external labels
  segments.append("text")
    .attr("transform", d => {
      const pos = outerArc.centroid(d);
      const midAngle = (d.startAngle + d.endAngle) / 2;
      pos[0] = radius * 1.2 * (midAngle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .attr("dy", "0.35em")
    .attr("text-anchor", d => {
      const midAngle = (d.startAngle + d.endAngle) / 2;
      return midAngle < Math.PI ? "start" : "end";
    })
    .attr("fill", d => color(d.data.category))
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text(d => `${d.data.category} (${d.data.count})`);
  
  // Add title
  pieChartSvg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("Distribution of TV Screen Sizes");
    
  // Add subtitle
  pieChartSvg.append("text")
    .attr("class", "chart-subtitle")
    .attr("x", width / 2)
    .attr("y", 55)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text(`Total: ${d3.sum(data, d => d.count)} TVs`);
  
  // Add legend
  const legendSpacing = 20;
  const legendRectSize = 15;
  const legendX = width - 170;
  const legendY = height - data.length * (legendSpacing + 5) - 20;
  
  const legend = pieChartSvg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${legendX}, ${legendY})`);
  
  const legendItems = legend.selectAll(".legend-item")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * legendSpacing})`);
  
  legendItems.append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .attr("fill", d => color(d.category))
    .attr("stroke", "white");
  
  legendItems.append("text")
    .attr("x", legendRectSize + 5)
    .attr("y", legendRectSize - 3)
    .attr("font-size", "12px")
    .text(d => d.category);
    
  // Add interactive tooltip
  const tooltipId = "pie-chart-tooltip";
  
  // Remove any existing tooltip div with the same ID
  d3.select(`#${tooltipId}`).remove();
  
  // Create a new tooltip div
  const tooltip = d3.select("body").append("div")
    .attr("id", tooltipId)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#f9f9f9")
    .style("border", "1px solid #333")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("box-shadow", "2px 2px 6px rgba(0, 0, 0, 0.3)")
    .style("opacity", 0)
    .style("pointer-events", "none") // This ensures the tooltip doesn't interfere with mouse events
    .style("z-index", 1000); // Keep it above other elements
  
  segments.on("mouseover", function(event, d) {
    // Highlight the segment
    d3.select(this).select("path")
      .style("opacity", 1)
      .attr("stroke-width", 3);
    
    // Show tooltip
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    
    // Calculate percentage
    const percent = (d.data.count / d3.sum(data, d => d.count) * 100).toFixed(1);
    
    // Format tooltip content
    tooltip.html(`
      <strong>${d.data.category}</strong><br>
      <span>Count: ${d.data.count} TVs</span><br>
      <span>Percentage: ${percent}%</span><br>
      <span>Size Range: ${d.data.minSize}" to ${d.data.maxSize}"</span>
    `)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseout", function() {
    // Restore segment appearance
    d3.select(this).select("path")
      .style("opacity", 0.8)
      .attr("stroke-width", 2);
    
    // Hide tooltip
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });
};