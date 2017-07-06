(function () {

  var barHeight = 5;

  var chart = new D3VizHelper('#canvas', undefined, 520, {
    top: 10,
    left: 20,
    bottom: 50,
    right: 20
  });

  function drawTimeline(jobData, educationData) {
    // create the date scale
    var scaleX = d3.scaleTime()
          .range([chart.margins.left, chart.availableWidth])
          .domain([moment('1972-08-05','YYYY-MM-DD')._d, moment()._d])
          .nice();

    // add a axis using scale above
    chart.canvas.append("g")
      .attr("transform", "translate(0," + (chart.height - chart.margins.bottom) + ")")
      .call(d3.axisBottom(scaleX))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");;



    function buildTypeTimeline (data, elClass, labelFunction, colors, yOffset) {
      // calculate the right (width) of a job
      function barRight (d, i) {
        return scaleX(d.endDate) - scaleX(d.startDate);
      }

      var textPositions = [];
      var offsets = [];

      var elSelection = chart.canvas.selectAll('.' + elClass)
            .data(data);

      elSelection.enter()
        .append('g')
        .attr('class', elClass + 'g with-labels')
        .attr('transform', function (d, i){
          var y =(d.type === 'secondary') ? yOffset:yOffset + 8;
          // var y = (i % 2 === 1 ? 197:203);
          textPositions.push(scaleX(d.startDate));
          return 'translate(' +  scaleX(d.startDate) + ',' + y + ')';
        });

      elSelection = chart.canvas.selectAll('.' + elClass + 'g')
        .data(data);

      elSelection
        .append('rect')
        .attr('x', 0)
        .attr('y', 5)
        .attr('class', elClass + '-bar')
        .attr('width', barRight)
        .attr('height', 10)
        .attr('fill', (d,i) => {
          return  d3.rgb(colors(i)).brighter(.5);
        })
        .attr('stroke', (d,i) => { return  colors(i) });

      elSelection
        .append('text')
        .attr('x', 0)
        .attr('y1', 10)
        .attr('class', elClass + '-name is-hideable')
        .text((d, i) => { return labelFunction(d, i); })
        .attr('transform', (d, i) => {
          var offset = 25;
          var midpoint = barRight(d, i) / 2 + 10;
          if (midpoint > offset) {
            offset = midpoint;
          }

          if (i === 0) {
            textPositions[i] += 25;
          } else {
            do {
              var dist = textPositions[i] + offset - textPositions[i - 1];
              console.log(dist);
              offset ++;
            } while (dist < 25 && offset < 100);
            textPositions[i] += offset;
          }
          offsets.push(offset);
          return 'translate(' + offset + ', -15) rotate(-45) ';
          // return 'translate(20, 40) rotate(45)'
        });

      elSelection
        .append('line')
        .attr('class', 'is-hideable')
        .attr('x1', (d, i)=> {
          return barRight(d, i) / 2;
        })
        .attr('x2', (d, i) => {
          return 20 + offsets[i] - 25;
        })
        .attr('y1', 5)
        .attr('y2',  -20)
        .attr('stroke', (d, i) => {return colors(i)});
    }

    jobData.jobs.reverse();
    var jobGroup = buildTypeTimeline(
      jobData.jobs,
      'job',
      function(d,  i) {
        return d.subTitles['Company Name'];
      },
      d3.scaleOrdinal(d3.schemeCategory20),
      150
    );

    educationData.education.reverse();
    var edGroup = buildTypeTimeline(
      educationData.education,
      'ed',
      function(d,  i) {
        return d.institution;
      },
      d3.scaleOrdinal(d3.schemeCategory20),
      400
    );




    // var edList = chart.canvas.selectAll('.ed')
    //   .data(educationData.education);

    // edList.enter()
    //   .append('rect')
    //   .attr('class', 'ed')
    //   .attr('x', (d) => {
    //     return scaleX(d.startDate);
    //   })
    //   .attr('width', (d) => {
    //     return scaleX(d.endDate) - scaleX(d.startDate);
    //   })
    //   .attr('y', (d, i)=> {
    //     if (d.type === 'secondary') {
    //       return 380;
    //     } else {
    //       return 370;
    //     }
    //   })
    //   .attr('height', 10)
    //   .on('mouseover', (d) => {
    //     console.log(d.institution, d.subTitles['Dates attended or expected graduation']);
    //   });

  }


  loadJSON(pageData.id + '/job-data.json').then((data)=> {
    var jobData = {jobs:[]};
    var educationData = {education:[]};
    data.jobs.forEach((job)=>{
      var jobDates = job.subTitles['Dates Employed'].split('-');
      job.startDate = toDate(jobDates[0]);
      job.endDate = toDate(jobDates[1]);
      jobData.jobs.push(job);
    });

    data.education.forEach((education)=>{

      var dates = education.subTitles['Dates attended or expected graduation'].split('-');
      education.startDate = toDate(dates[0]);
      education.endDate = toDate(dates[1]);
      educationData.education.push(education);
    });


    drawTimeline(jobData, educationData);
  });

  function toDate (d) {
    // convert dates from linkedin to js dates
    var date;
    if(d.trim().toLowerCase() === 'present') {
      date = moment();
    } else {
      date = moment(d.trim(), 'MMM-YYYY');
    }
    return date._d;
  }

})();
