const width = 800;
const height = 500;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 50;
const marginLeft = 60;

const svg = d3.select("body").
append("svg").
attr("width", width).
attr("height", height);

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').
then(response => response.json()).
then(data => {
  const dataset = data.data;

  const x = d3.scaleUtc().
  domain(d3.extent(dataset, d => new Date(d[0]))).
  range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear().
  domain([0, d3.max(dataset, d => d[1])]).
  range([height - marginBottom, marginTop]);

  svg.append("g").
  attr("transform", `translate(0,${height - marginBottom})`).
  attr("id", "x-axis").
  call(d3.axisBottom(x));

  svg.append("g").
  attr("transform", `translate(${marginLeft},0)`).
  attr("id", "y-axis").
  call(d3.axisLeft(y));

  svg.selectAll(".bar").
  data(dataset).
  enter().append("rect").
  attr("class", "bar").
  attr("x", d => x(new Date(d[0]))).
  attr("y", d => y(d[1])).
  attr("height", d => height - marginBottom - y(d[1])).
  attr("width", (width - marginLeft - marginRight) / dataset.length).
  attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]);

  const tooltip = d3.select("body").append("div").
  attr("id", "tooltip").
  style("position", "absolute").
  style("visibility", "hidden");

  svg.selectAll(".bar").
  on("mouseover", (event, d) => {
    tooltip.style("visibility", "visible").
    attr("data-date", d[0]).
    html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`).
    style("top", `${event.pageY - 10}px`).
    style("left", `${event.pageX + 10}px`);
  }).
  on("mouseout", () => tooltip.style("visibility", "hidden"));
});