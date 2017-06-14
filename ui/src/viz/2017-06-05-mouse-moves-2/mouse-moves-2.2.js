console.log('2.2 loaded');

var chart = new D3VizHelper('#canvas', undefined, 520, {
  top: 100,
  left: 100,
  bottom: 20,
  right: 100
});

var radius = 100;

var xScale = d3.scaleLinear()
      .range([chart.margins.left, chart.availableWidth]);

var yScale = d3.scaleLinear()
      .range([chart.availableHeight, chart.margins.top]);

console.log([chart.availableWidth, chart.margins.left, chart.availableHeight, chart.margins.top]);


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
  var cAngle = getAngle(rawData.circle, d.circlePos);
  var mAngle = getAngle(rawData.circle, d.mousePos);
  var dist = linearDist(d.circlePos, d.mousePos);
  var actualDist = dist;
  var leadLag = cAngle - mAngle;
  if (leadLag > 180) {
    leadLag = cAngle - mAngle - 360;
  }
  if (leadLag < -180) {
    leadLag =leadLag = cAngle - mAngle + 360;
  }
  var radius = linearDist(rawData.circle, d.mousePos) - rawData.circle.radius;
  var actualRadius = radius;
  if (radius > 0) {
    radius = Math.max(radius - rawData.target.radius, 0);
  } else {
    radius = Math.min(radius + rawData.target.radius, 0);
  }
  if (i > 100) {
    if (cAngle < 10) {
      cAngle = cAngle + 360;
    }
  }
  dist = Math.max(dist - rawData.target.radius, 0);
  data.push({
    x: i,
    angle: cAngle,
    dist: dist,
    distActual: actualDist,
    leadLag: leadLag,
    radius: radius,
    actualRadius: actualRadius
  });


  maxDist = Math.max(leadLag, dist, maxDist, actualDist, radius, actualRadius);
  minDist = Math.min(leadLag, dist, minDist, actualDist, radius, actualRadius);
});

xScale.domain([0, 360]);
yScale.domain([minDist, maxDist]);

var props = ['dist', 'distActual', 'leadLag', 'radius', 'actualRadius'];
var props = ['dist', 'leadLag', 'radius'];
var c = chart.nvcolors10();
var k = new D3VizKey('#key');
//c();c();c();c();
props.forEach( (p) => {
  var valueline = getLineFn('angle', p);
  var col = c();
  k.addLine(p, '#' + col, 2);
  chart.canvas.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", function () {
      return col;
    })
    .attr("d", valueline);
});

// get the angle that this line is at
function getAngle (c, p) {
  var dy = c.y - p.y;
  var dx = c.x - p.x;
  var theta = Math.atan2(dy, dx);
  return (theta + Math.PI) % (2 * Math.PI) * (180 / Math.PI);;
}

function linearDist(p1, p2 ){
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

chart.addYAxis('y-axis', yScale);
chart.addXAxis('x-axis', xScale);
