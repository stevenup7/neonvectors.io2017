(function () {
  var interval = false;
  var intervalTime = 50; // ms
  var lastPos = false; // the last mouse position
  var currPos = false; // the current mouse postion
  var data = [];
  var turnCounter = 0;
  var dataLength;
  var max;
  var barHeight;
  var barY = function () {return 0;};

  var yLabels = {
    ya: {
      value: -1
    },
    yb: {
      value: -1
    },
    current: "ya",
    other: "yb",
    switchCurrent: () => {
      var t = this.other;
      this.other = this.current;
      this.current = t;
    }
  };

  var chart = new D3VizHelper('#canvas', elWidth, 300, {
    top: 20,
    left: 100,
    bottom: 20,
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

  drawAxis();
  doIt();


  function setLabelPos () {
    var labelText = get1SigFig(max);
    canvas.selectAll('#' + yLabels.current + ' .axis-label').text(labelText + 'px');
    // we want to move the label to the right spot as the scale changes
    canvas.selectAll('#' + yLabels.current)
      .transition()
      .duration(200)
      .attr('transform', function () {

        var t = chart.height - chart.margins.bottom - barY(labelText);
        var l = 0;
        return 'translate(' + l + ',' + t + ')';
      });

  }

  drawYLabel('ya');
  //drawYLabel('yb');

  function drawYLabel (label) {
    var l = 0; //chart.margins.left;
    var t = 20;

    var g = chart.canvas.append('g')
          .attr('id', label)
          .attr('transform', 'translate(' + l + ',' + t + ')');

    g.append('line')
      .attr('x1', chart.margins.left - 20)
      .attr('x2', chart.margins.left - 6)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('class', 'axis');

    g.append('text')
      .attr('x', chart.margins.left - 25)
      .attr('y', 5)
      .attr('width', 100)
      .attr('text-anchor', 'end')
      .attr('class', 'axis-label')
      .text('1px');

    window.g = g;

  }


  function drawAxis () {
    chart.canvas.append('line')
      .attr('x1', chart.margins.left - 6)
      .attr('x2', chart.margins.left - 6)
      .attr('y1', 0)
      .attr('y2', chart.height)
      .attr('class', 'axis');

    chart.canvas.append('line')
      .attr('x1', chart.margins.left - 12)
      .attr('x2', chart.width - chart.margins.right)
      .attr('y1', chart.height - chart.margins.bottom)
      .attr('y2', chart.height - chart.margins.bottom)
      .attr('class', 'axis');

  }

  function makeBars () {
    max = d3.max(data);
    setLabelPos();

    barHeight = d3.scaleLinear()
          .domain([0, max])
          .range([chart.availableHeight, chart.margins.top]);

    // get the y pos for the bar
    barY = function (d){
      return chart.availableHeight - barHeight(d);
    };

    // calc the x position of a bar
    var barX = function (d, i) {
      return i * 12 + chart.margins.left;
    };

    // define the neon vectors blue and pink
    const blue = 'rgb(119, 222, 253)';
    const pink = 'rgb(242, 94, 237)';

    var getColor = d3.scaleLinear()
          .domain([0,max])
          .range([blue, pink]);

    var barList = canvas.selectAll('.bar')
          .data(data);

    barList
      .attr('height',barY)
      .attr('y', function (d) {
        return chart.height - chart.margins.bottom - barY(d);
      })
      .attr('x', barX)
      .transition()
      .duration(intervalTime)
      .ease(d3.easeLinear)
      .style('fill', getColor)
      .attr ('width', function (d, i) {
        if (i == 0 && data.length > dataLength){
          return 0;
        } else {
          return 10;
        }
      })
      .attr('x' , function (d, i) {
        // is the data array full ?
        if (data.length > dataLength) {
          if (i === 0) {
            // transition the 0th bar off
            return barX(d, i) - 6;
          } else {
            // move left one space
            return barX(d, i -1);
          }
        } else {
          // stay still
          return barX(d, i);
        }
      })
      .on('end', function (d, i) {
        if (i == 0 && data.length > dataLength){
          // done with the transition so remove this bar.
          this.remove();
        }
      });

    barList.enter()
      .append('rect')
      .style('fill', getColor)
      .attr('class', 'bar')
      .attr('width' , 10)
      .attr('x', function (d, i) {
        return barX(d, i);
      })
      .attr('y', function (d) {
        return chart.height - chart.margins.bottom ;
      })
      .attr('height', 0)
      .attr('x' , function (d, i) {
          return barX(d, i);
      })
      .transition()
      .duration(intervalTime)
      .ease(d3.easeLinear)
      .attr('height',barY)
      .attr('y', function (d) {
        return chart.height - chart.margins.bottom - barY(d);
      })
      .attr('x' , function (d, i) {
        // is the data array full ?
        if (data.length > dataLength) {
          // move left one space
          return barX(d, i -1);
        } else {
          // stay still
          return barX(d, i);
        }
      })
      .on('end', function () {
        // when the new element (only one) finishes collect data and redraw ... forever
        doIt();
      });

    barList.exit()
      .remove();
  }

  /// calc the distance between 2 points
  function linearDist(p1, p2 ){
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  }

  // set up the mouse position tracker
  document.onmousemove = handleMouseMove;

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
    currPos = {x: event.pageX,y: event.pageY};
  }


})();
