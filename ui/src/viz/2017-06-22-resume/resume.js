(function () {

  var barHeight = 5;

  var chart = new D3VizHelper('#canvas', undefined, 520, {
    top: 10,
    left: 100,
    bottom: 20,
    right: 100
  });

  function drawTimeline(jobData, educationData) {
    var scaleX = d3.scaleTime()
          .range([chart.margins.left, chart.availableWidth])
          .domain([moment('1992-08-05','YYYY-MM-DD')._d, moment()._d]);

    var jobList = chart.canvas.selectAll('.job')
      .data(jobData.jobs);

    jobList.enter()
      .append('g')
      .attr('class', 'jobg')
      .attr('transform', function (d){
        var y =(d.type === 'secondary') ? 200:200;
        return 'translate(0,' + y + ')';
      })
      .transition()
      .duration(2000)
      .attr('transform', function (d, i){
        var y =(d.type === 'secondary') ? 200:208;
        // var y = (i % 2 === 1 ? 197:203);
        return 'translate(' +  scaleX(d.startDate) + ',' + y + ')';
      })


    jobList = chart.canvas.selectAll('.jobg')
      .data(jobData.jobs);

    function jobRight (d, i) {
      return scaleX(d.endDate) - scaleX(d.startDate);
    }

    function jobY (offSet) {
      return function (d, i) {
        return 10 + offSet;
      }
    }

    var c = chart.nvcolors10();

    // jobList
    //   .append('line')
    //   .attr('x1', 0)
    //   .attr('y1', jobY(0))
    //   .attr('x2', jobRight)
    //   .attr('y2', jobY(0))
    //   .attr('stroke', (d,i) => { return  c(i) });

    // jobList
    //   .append('line')
    //   .attr('x1', 0)
    //   .attr('x2', 0)
    //   .attr('y1', jobY(-5))
    //   .attr('y2', jobY(+5))
    //   .attr('stroke', (d,i) => { return  c(i) });

    // jobList
    //   .append('line')
    //   .attr('x1', jobRight)
    //   .attr('x2', jobRight)
    //   .attr('y1', jobY(-5))
    //   .attr('y2', jobY(+5))
    //   .attr('stroke', (d,i) => { return  c(i) });

    jobList
      .append('rect')
      .attr('x', 0)
      .attr('y', 5)
      .attr('class', 'job-bar')
      .attr('width', jobRight)
      .attr('height', 10)
      .attr('fill', (d,i) => { return  c(i) })
      .attr('stroke', (d,i) => { return  c(i) });

    jobList
      .append('line')
      .attr('x1', (d, i)=> {
        return jobRight(d, i) / 2;
      })
      .attr('x2', 20)
      .attr('y1', (d,i) => {
        if (i % 2 === 1) {
          return jobY(-5)(d,i);
        } else {
          return jobY(+5)(d, i);
        }
      })
      .attr('y2', (d,i) => {
        if (i % 2 === 1) {
          return jobY(-25)(d, i);
        } else {
          return jobY(+25)(d, i);
        }
      })
      .attr('stroke', (d,i) => { return  c(i) });

    jobList
      .append('text')
      .attr('x', 0)
      .attr('y1', jobY(0))
      .attr('class', 'job-name')
      .text((d) => { return d.title })
      .attr('transform', (d,i) => {
        if (i % 2 === 1) {
          return 'translate(25, -15) rotate(-45) '
        } else {
          return 'translate(20, 40) rotate(45)'
        }
      })

    // jobList
    //   .append('circle')
    //   .attr('cx', (d) => {
    //     return scaleX(d.endDate) - scaleX(d.startDate) - 2;
    //   })
    //   .attr('cy', 10)
    //   .attr('r', 2)
    //   .attr('fill', 'white')
    //   .attr('stroke', 'grey');


    // jobList.enter()
    //   .append('rect')
    //   .attr('class', 'job')
    //   .attr('x', (d) => {
    //     return scaleX(d.startDate);
    //   })
    //   .attr('width', (d) => {
    //     return scaleX(d.endDate) - scaleX(d.startDate);
    //   })
    //   .attr('y', (d, i)=> {
    //     if (d.type === 'secondary') {
    //       return 20;
    //     } else {
    //       return 10;
    //     }
    //   })
    //   .attr('height', 10)
    //   .on('mouseover', (d) => {
    //     console.log(d.title, d.subTitles['Company Name'], d.subTitles['Dates Employed']);
    //   });


    var edList = chart.canvas.selectAll('.ed')
      .data(educationData.education);

    edList.enter()
      .append('rect')
      .attr('class', 'ed')
      .attr('x', (d) => {
        return scaleX(d.startDate);
      })
      .attr('width', (d) => {
        return scaleX(d.endDate) - scaleX(d.startDate);
      })
      .attr('y', (d, i)=> {
        if (d.type === 'secondary') {
          return 380;
        } else {
          return 370;
        }
      })
      .attr('height', 10)
      .on('mouseover', (d) => {
        console.log(d.institution, d.subTitles['Dates attended or expected graduation']);
      });

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
