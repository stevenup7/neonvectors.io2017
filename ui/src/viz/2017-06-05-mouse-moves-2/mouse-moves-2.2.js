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

// console.log([chart.availableWidth, chart.margins.left, chart.availableHeight, chart.margins.top]);

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
var bucketedLeadLag = [];

var stepSize = 22.5;
var llAvg = 0
var llCount = 0;
var stepNumber = 1;
var currTotal = 0;
var count = 0;

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
  leadLag = -leadLag;
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
    'Distance': dist,
    distActual: actualDist,
    'Lead/Lag': leadLag,
    'Radius': radius,
    actualRadius: actualRadius
  });

  maxDist = Math.max(leadLag, dist, maxDist, actualDist, radius, actualRadius);
  minDist = Math.min(leadLag, dist, minDist, actualDist, radius, actualRadius);

  // console.log(stepNumber * stepSize);
  if (mAngle < stepNumber * stepSize) {
    currTotal += leadLag;
    count ++;
  } else {
    //console.log(count);
    stepNumber ++;
    bucketedLeadLag.push(currTotal/count);
    currTotal = 0;
    count = 0;
  }

});
bucketedLeadLag.push(currTotal/count);

xScale.domain([0, 360]);
yScale.domain([minDist, maxDist]);

var props =  ['Distance', 'distActual', 'Lead/Lag', 'Radius', 'actualRadius'];
var labels = [
  'Distance from edge of circle (pixels)',
  'Distance from center of circle (pixels)',
  'Leading or Lagging the circle (degrees)',
  'Radius accuracy from edge of circle (pixels)',
  'Radius accuracy for center of circle (pixels)'
]
//var props = ['Distance', 'Lead/Lag', 'Radius'];
var c = chart.nvcolors10();
var k = new D3VizKey('#key');

props.forEach( (p, i) => {
  var valueline = getLineFn('angle', p);
  var col = c();
  k.addLine(labels[i], col, 2);
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


var chart2 = new D3VizHelper('#canvas2', undefined, 520, {
  top: 100,
  left: 100,
  bottom: 20,
  right: 100
});


// draw the base circle - the animation path
chart2.canvas.append("text")
  .attr('class', 'viz-title viz-title-centered')
  .text('Your circle')
  .attr('transform', 'translate('+ (chart2.margins.left + 50) + ', 70)')

chart2.canvas.append('circle')
  .attr('cx', chart2.margins.left + 50)
  .attr('cy', chart2.margins.top + 50)
  .attr('r', 50)
  .attr('fill', 'white')
  .attr('stroke', '#ddd');

// build a data set to represent the shape of circle actually drawn

var data = [];
rawData.run1.forEach(function (d, i) {
  data.push({
    x: +d.mousePos.x,
    y: +d.mousePos.y
  });
})

var valueline = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) {
      return d.x / 3 + 68
    })
    .y(function(d) {
      return d.y / 3 + 68
    });

chart2.canvas.append("path")
  .data([data])
  .attr("class", "line")
  .style("stroke", function () {
    return c(0)
  })
  .attr("d", valueline);


// console.log(bucketedLeadLag);



chart2.canvas.append("text")
  .attr('class', 'viz-title viz-title-centered')
  .text('Lead Lag')
  .attr('transform', 'translate(' + (chart2.margins.left + 250) + ', 70)')

// draw the base circle - the animation path
chart2.canvas.append('circle')
  .attr('cx', chart2.margins.left + 250)
  .attr('cy', chart2.margins.top + 50)
  .attr('r', 50)
  .attr('fill', 'white')
  .attr('stroke', '#ddd');


var ang = 22.5/1;

bucketedLeadLag.forEach((ll, i) => {
  console.log(ll);

  var p = new Point(chart2.margins.left + 250, chart2.margins.top + 50);
  var p1 = p.pointAtAngleDeg(ang, 50);
  var p2 = p.pointAtAngleDeg(ang, 50 + ll);
  var color = c(1);
  if (ll > 0) {
    color = c(0);
  }
  chart2.canvas.append('line')
    .attr('x1', p1.x)
    .attr('y1', p1.y)
    .attr('x2', p2.x)
    .attr('y2', p2.y)
    .attr('stroke-width', 2)
    .attr('stroke', color);

  ang += 22.5;
});
