(function () {
  var interval = false;
  var intervalTime = 50; // ms
  var lastPos = false; // the last mouse position
  var currPos = false; // the current mouse postion
  var marginLeft = 100;
  var data = [];
  var graphHeight = 400;
  var turnCounter = 0;
  var elWidth = document.getElementById('canvas').offsetWidth;

  var dataLength = Math.floor((elWidth - marginLeft) / 12);

  var canvas = d3.select('#canvas').append('svg')
        .attr('width', elWidth)
        .attr('height', graphHeight);


  // track the mouse movement every (intervalTime)ms
  function doIt () {
    if (lastPos && currPos) {
      var distTravelled = Math.floor(linearDist(lastPos, currPos) * 100) / 100;
      if (data.length > dataLength) {
        // if we have enough data shift off the extra element
        data.shift();
      }
      // track the distance travelled
      data.push (distTravelled);
      makeBars();
    } else {
      setTimeout(doIt, 0);
    }
    lastPos = currPos;
  }

  doIt();

  function makeBars () {
    var max = d3.max(data);

    var barScale = d3.scaleLinear()
          .domain([0, max])
          .range([0, graphHeight]);

    var barList = canvas.selectAll('.bar')
          .data(data);

    var barY = function (d){
      return graphHeight - barScale(d);
    };

    var barX = function (d, i) {
      return i * 12 + marginLeft;
    };

    var co = function () {
      return 'rgb(242, 94, 237)';
    };

    barList
      .attr('height', graphHeight)
      .attr('y', barY)
      .attr('x', barX)
      .transition()
      .duration(intervalTime)
      .ease(d3.easeLinear)
      .attr ('width', function (d, i) {
        if (i == 0 && data.length > dataLength){
          return 0;
        } else {
          return 10;
        }
      })
      .attr('x' , function (d, i) {
        if (data.length > dataLength) {
          if (i === 0) {
            return barX(d, i) - 6;
          } else {
            return barX(d, i -1);
          }
        } else {
          return barX(d, i);
        }
      })
      .on('end', function (d, i) {
        if (i == 0 && data.length > dataLength){
          this.remove();
        }
      });

    barList.enter()
      .append('rect')
      .style('fill', co)
      .attr('class', 'bar')
      .attr('width' , 10)
      .attr('x', function (d, i) {
        return barX(d, i);
      })
      .attr('y', graphHeight)
      .attr('height', 0)
      .attr('x' , function (d, i) {
          return barX(d, i);
      })
      .transition()
      .duration(intervalTime)
      .ease(d3.easeLinear)
      .attr('y', barY)
      .attr('height', graphHeight)
      .attr('x' , function (d, i) {
        if (data.length > dataLength) {
          return barX(d, i -1);
        } else {
          return barX(d, i);
        }
      })
      .on('end', function () {
        doIt();
        //setTimeout(doIt, 0);
      });

    barList.exit()
      .remove();
  }


  function linearDist(p1, p2 ){
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  }

  //  document.getElementById('start').onclick = toggleRunning;

  // function toggleRunning (e) {
  //   console.log('toggle', interval);
  //   if (interval === false) {
  //     interval = setInterval(doIt, intervalTime);
  //   } else {
  //     clearInterval(interval);
  //     interval = false;
  //   }
  // }

  // set up the mouse position tracker
  document.onmousemove = handleMouseMove;

  // stack overflow http://stackoverflow.com/questions/7790725/javascript-track-mouse-position
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
    currPos = {x: event.pageX,y: event.pageY};
  }


})();
