(function () {
  var currPos;        // track the current postion of the mouse;
  var radius = 150;   // radius of the circle
  var runNumber = 0;  // how many tries
  if (localStorage.getItem('practice') === 'y') {
    runNumber = 1;
  }
  var data = {
    run1: [],
    run2: [],
    run3: []
  }; // store data from 3 runs

  var chart = new D3VizHelper('#canvas', undefined, 520, {
    top: 100,
    left: 100,
    bottom: 20,
    right: 100
  });

  var circleCenter = {
    x: radius + chart.margins.left,
    y: radius + chart.margins.top
  };

  // draw the base circle - the animation path
  chart.canvas.append('circle')
    .attr('cx', circleCenter.x)
    .attr('cy', circleCenter.y)
    .attr('r', radius)
    .attr('fill', 'white')
    .attr('stroke', '#ddd');

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
          return function (t) {
            var x = (circleStart.x - radius) + radius * Math.cos (2*Math.PI * t);
            // store the circles x position and the mouses x position
            offsx.push([x, currPos.x]);
            return x;
          };
        })
        .attrTween('cy', function (t) {
          return function (t) {
            var y = circleStart.y + radius * Math.sin (2 * Math.PI * t);
            // store the circles y position and the mouses y position
            offsy.push([y, currPos.y]);
            return y;
          };
        })
        .duration(5000)
        .ease (d3.easePolyInOut)
        .on('end', function () {
          runNumber ++;
          if (runNumber === 1) {
            showMessage('right that was your practice, the next 3 tries are for real');
            localStorage.setItem('practice', 'y');
          } else {
            var run = 'run' + (runNumber -1);
            console.log(run);
            data[run] = [];

            for(var i = 0; i < offsx.length; i++) {
              var circlePos = {x: offsx[i][0], y:offsy[i][0]};
              var mousePos  = {x: offsx[i][1], y:offsy[i][1]};
              data[run].push({
                circlePos: circlePos,
                mousePos: mousePos
              });
            }
            if (run === 'run1') {
              // store the data in localStorage
              // todo put it on the window or offer to
              data.circle = circleCenter;
              data.circle.radius = radius;
              data.target = {};
              data.target.radius = 20;
              window.localStorage.setItem('mouseMoves2Data', JSON.stringify(data));
              showMessage('you can now go to the next page to see the data');
            }
          }
        });

    });

  // calc the distance between 2 points
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

  }

  var isInitModalInit = false;

  function showMessage (msg) {
    bus.$emit('showMessage', {
      message: msg
    });
  }

})();
