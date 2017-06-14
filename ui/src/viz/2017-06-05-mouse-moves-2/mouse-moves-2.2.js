console.log('2.2 loaded');

var chart = new D3VizHelper('#canvas', undefined, 520, {
  top: 100,
  left: 100,
  bottom: 20,
  right: 100
});
var radius = 100;

var xScale = d3.scaleLinear()
      .range([chart.availableHeight, 0]);

var yScale = d3.scaleLinear()
      .range([chart.availableHeight, 0]);


function getLineFn (xprop, yprop) {
  return d3.line()
    .x(function(d) {
      return xScale(d[xprop]);
    })
    .y(function(d) {
      return yScale(d[yprop]);
    });

}

var rawData = JSON.parse(localStorage.getItem('mouseMoves2Data'));
var data = [];
var maxDist = 0;
var minDist = 0;

rawData.run1.forEach(function (d, i) {
  data.push({
    x: i,
    y: d.dist
  });

  maxDist = Math.max(d.dist, maxDist);
  minDist = Math.min(d.dist, minDist);
});

xScale.domain([0, data.length]);
yScale.domain([minDist, maxDist]);
console.log(data);
var valueline = getLineFn('x', 'y');

chart.canvas.append("path")
  .data([data])
  .attr("class", "line")
  .attr("d", valueline);
