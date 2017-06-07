console.log('2.2 loaded');

var chart = new D3VizHelper('#canvas', undefined, 520, {
  top: 100,
  left: 100,
  bottom: 20,
  right: 100
});
var radius = 100;

// draw the base circle - the animation path
chart.canvas.append('circle')
  .attr('cx', radius + chart.margins.left)
  .attr('cy', radius + chart.margins.top)
  .attr('r', radius)
  .attr('fill', 'white')
  .attr('stroke', '#ddd');
