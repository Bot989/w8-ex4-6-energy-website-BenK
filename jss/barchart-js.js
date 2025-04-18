d3.select("h1")
  .style("color", "purple");  

  // An SVG element within the responsive container
const svg = d3.select(".responsive-svg-container")
.append("svg")
.attr("viewBox", "0 0 200 600")
.style("border", "1px solid black");

//  Rectangle SVG
svg
.append("rect")
.attr("x", 10)
.attr("y", 10)
.attr("width", 416)
.attr("height", 30)
.attr("fill", "green");