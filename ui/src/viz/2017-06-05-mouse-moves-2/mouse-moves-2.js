(function () {
  console.log('mouse moves 2');
  var currPos;
  var radius = 150;
  var runNumber = 0;

  var data = {
    run1: [],
    run2: [],
    run3: []
  };
  window.data = data;

  var chart = new D3VizHelper('#canvas', undefined, 520, {
    top: 100,
    left: 100,
    bottom: 20,
    right: 100
  });

  chart.canvas.append('circle')
    .attr('cx', radius + chart.margins.left)
    .attr('cy', radius + chart.margins.top)
    .attr('r', radius)
    .attr('fill', 'white')
    .attr('stroke', 'gray');


  var mouseCircle = chart.canvas.append('circle');
  mouseCircle
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 5)
    .attr('fill', '#fcc');

  var circle = chart.canvas.append('circle');
  var circleStart = {
    x: radius * 2 + chart.margins.left,
    y: chart.margins.top + radius
  };

  circle.attr('cx', circleStart.x)
    .attr('cy', circleStart.y)
    .attr('r', 20)
    .attr('fill', '#cfc')
    .attr('stroke', 'gray')
    .on('mouseup', function () {
      var offsx = [];
      var offsy = [];
      circle.transition()
        .attrTween ('cx', function (d, i, a) {
          offsx = [];
          return function (t) {
            var x = (circleStart.x - radius) + radius * Math.cos (2*Math.PI * t);
            offsx.push(x - currPos.x);
            return x;
          };
        })
        .attrTween('cy', function (t) {
          offsy = [];
          return function (t) {
            var y = circleStart.y + radius * Math.sin (2 * Math.PI * t);
            offsy.push(y - currPos.y);
            return y;
          };
        })
        .duration(5000)
        .ease (d3.easePolyInOut)
        .on('end', function () {
          runNumber ++;
          if (runNumber === 1) {
            alert('right that was your practice, the next 3 tries are for real');

          } else {
            var run = 'run' + (runNumber -1);
            console.log(run);
            window.data[run] = [];
            for(var i = 0; i < offsx.length; i++) {
              var pos = {x:offsx[i], y:offsy[i]};
              var dist = linearDist({x:0, y:0},pos);
              window.data[run].push({
                pos: pos,
                dist: dist
              });
            }
          }
        });

    });


  /// calc the distance between 2 points
  function linearDist(p1, p2 ){
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  }


  var canvas = document.getElementById('canvas');
  canvas.onmousemove = handleMouseMove;

  function findPos(obj) {
    // ewk
    // https://stackoverflow.com/questions/5085689/tracking-mouse-position-in-canvas-when-no-surrounding-element-exists
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
    }
    return undefined;
  }

  var canvasPos = findPos(canvas);
  // based on this stack overflow answer
  // http://stackoverflow.com/questions/7790725/javascript-track-mouse-position


  function handleMouseMove(event) {
    var eventDoc, doc, body;
    event = event || window.event; // IE-ism
    if (event.pageX == null && event.clientX != null) {
      eventDoc = (event.target && event.target.ownerDocument) || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;
      event.pageX = event.clientX +
        (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
        (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
        (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    currPos = {
      x: event.pageX - canvasPos.x,
      y: event.pageY - canvasPos.y
    };

    // mouseCircle
    //   .attr('cx', currPos.x)
    //   .attr('cy', currPos.y);


  }


})();
