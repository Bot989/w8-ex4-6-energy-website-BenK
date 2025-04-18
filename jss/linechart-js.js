// Set dimensions and margins
const margin = { top: 20, right: 30, bottom: 30, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// Append SVG to body (or change selector as needed)
const svg = d3.select("body")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse date function
const parseDate = d3.timeParse("%Y-%m-%d");

// Load data
d3.csv("data/data.csv", d => {
  return {
    date: parseDate(d.date),
    value: +d.value
  };
}).then(data => {
  // Scales
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Line generator
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  // Draw line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);
});
