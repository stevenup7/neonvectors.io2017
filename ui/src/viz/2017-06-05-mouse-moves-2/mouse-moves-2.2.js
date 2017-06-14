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
    .curve(d3.curveBasis)
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
    y: d.dist,
    yx: d.pos.x,
    yy: d.pos.y
  });

  maxDist = Math.max(d.pos.x, d.pos.y, d.dist, maxDist);
  minDist = Math.min(d.pos.x, d.pos.y, d.dist, minDist);
});

xScale.domain([0, data.length]);
yScale.domain([minDist, maxDist]);
console.log(data);

var props = ['y', 'yx', 'yy'];

var c = chart.nvcolors10();

props.forEach( (p) => {
  var valueline = getLineFn('x', p);
  chart.canvas.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", function () {
      var col = c();
      console.log(col);
      return col;
    })
    .attr("d", valueline);

});
