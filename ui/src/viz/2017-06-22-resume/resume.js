(function () {

  var chart = new D3VizHelper('#canvas', undefined, 520, {
    top: 10,
    left: 100,
    bottom: 20,
    right: 100
  });

  function drawTimeline(jobData, educationData) {
    var scaleX = d3.scaleTime()
          .range([chart.margins.left, chart.availableWidth])
          .domain([
            moment('1992-08-05','YYYY-MM-DD')._d,
            moment()._d
          ]);

    var jobList = chart.canvas.selectAll('.job')
      .data(jobData.jobs);

    jobList.enter()
      .append('rect')
      .attr('class', 'job')
      .attr('x', (d) => {
        return scaleX(d.startDate);
      })
      .attr('width', (d) => {
        return scaleX(d.endDate) - scaleX(d.startDate);
      })
      .attr('y', (d, i)=> {
        if (d.type === 'secondary') {
          return 20;
        } else {
          return 10;
        }
      })
      .attr('height', 10)
      .on('mouseover', (d) => {
        console.log(d.title, d.subTitles['Company Name'], d.subTitles['Dates Employed']);
      });


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
          return 50;
        } else {
          return 40;
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
