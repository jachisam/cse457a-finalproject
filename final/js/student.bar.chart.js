/*
  This bar chart was inspired by https://bl.ocks.org/seemantk/ec245e1f4e824e685982dd5d3fbb2fcc
  We incorporated the svg creation methods into our code. We loved the format so
  we adopted it for our work as it really brings out the data succinctly in our
  visualization.
*/

var studentData = [];

var width = 450;
var height = 450;

function generate_chart(subject)
{

  console.dir(subject);

  var currentData = [];
  var threshold = 0.0;
  studentData = currentData;

  threshold = +subject.value;

  console.log(threshold);

  d3.csv('../data/graduate-admissions/admission_cleaned.csv', function(data)
  {

    studentData = data;
    convertToNumericData(studentData);

    studentData.forEach(function(d, index)
    {
      if ((d.Chance_of_Admit < threshold * 1.05) || (d.Chance_of_Admit > threshold * 0.95))
      {
        d.Serial_No = index;
        currentData.push(d);
      }
    });

    display_chart(subject, currentData);
  });

}

function display_chart(subject, data)
{

  d3.selectAll("#vis2 > *").remove();

  data.sort(function(a, b)
  {
    return d3.ascending(a.Chance_of_Admit, b.Chance_of_Admit)
  });

  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
    width = 600 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  var x = d3.scaleBand()
    .rangeRound([0, width], .1)
    .paddingInner(0.1);

  var y = d3.scaleLinear()
    .range([height, 0]);

  var xAxis = d3.axisBottom()
    .scale(x);

  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(11, "%");

  var svg = d3.select("#vis2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(data.map(function(d)
  {
    return d.Serial_No;
  }));
  y.domain([0, 1]);
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + "," +
      (height + 25) + ")")
    .style("text-anchor", "middle")
    .text("Applicant Pool");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 4)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Chance of Admittance");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i)
    {
      return x(d.Serial_No);
    })
    .attr("width", x.bandwidth())
    .attr("y", function(d)
    {
      return y(d.Chance_of_Admit);
    })
    .attr("fill", function(d)
    {
      if (d.Chance_of_Admit == subject.value)
      {
        return "#FFD100";
      }
      else
      {
        return "#2774AE";
      }
    })
    .attr("height", function(d)
    {
      return height - y(d.Chance_of_Admit);
    });
}
