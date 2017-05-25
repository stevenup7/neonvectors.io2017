(function () {
  var interval = false;
  var intervalTime = 50; // ms
  var lastPos = false; // the last mouse position
  var currPos = false; // the current mouse postion
  var data = [];
  var turnCounter = 0;
  var dataLength;

  var chart = new D3VizHelper('#canvas', elWidth, 100, {
    top: 0,
    left: 100,
    bottom: 0,
    right: 100
  });

  var canvas = chart.canvas;
  var elWidth = chart.width;
  dataLength = Math.floor((chart.width - chart.margins.left * 2) / 12);

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
          .range([0, chart.height]);

    var barList = canvas.selectAll('.bar')
          .data(data);

    var barY = function (d){
      return chart.height - barScale(d);
    };

    var barX = function (d, i) {
      return i * 12 + chart.margins.left;
    };

    var blue = 'rgb(119, 222, 253)';
    var pink = 'rgb(242, 94, 237)';

    var co = d3.scaleLinear()
          .domain([0,max])
          .range([blue, pink]);

    barList
      .attr('height', chart.height)
      .attr('y', barY)
      .attr('x', barX)
      .transition()
      .duration(intervalTime)
      .ease(d3.easeLinear)
      .style('fill', co)
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
      .attr('y', chart.height)
      .attr('height', 0)
      .attr('x' , function (d, i) {
          return barX(d, i);
      })
      .transition()
      .duration(intervalTime)
      .ease(d3.easeLinear)
      .attr('y', barY)
      .attr('height', chart.height)
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
