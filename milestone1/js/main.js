var width = 300, height = 400;
var padding = 20;
var margin = {top: 10, right: 15, bottom: 25, left: 5};

//Sorry, had to clear it.
/*var applicantCirclesSvg = d3.select("#applicant-circles")
	.append("svg")
	.attr("height", height)
	.attr("width", width);
	*/

var applicantTableSvg = d3.select("#applicant-table")
	.append("svg")
	.attr("height", height-400)
	.attr("width", width-200);

// Load CSV file
var graduate_admissions_data = "../data/graduate-admissions/Admission_Predict_Ver1.1.csv";
var test_data = "../data/graduate-admissions/test-data.csv"
d3.csv(test_data, function(data){
  convertToNumericData(data);
//  drawApplicantCircles(data);
	//console.log(data);
});

//NEW FUNCTIONS NEW DATA
d3.csv(graduate_admissions_data,function(data)
{
	convertToNumericData(data);
	testDataProjections(data);
	generateBubbleChart(data);

});

function convertToNumericData(data){
	data.forEach(function(d){
		d.CGPA = parseFloat(d.CGPA);
		d.Chance_of_Admit = parseFloat(d.Chance_of_Admit);
		d.GRE_Score = parseInt(d.GRE_Score);
    d.LOR = parseFloat(d.LOR);
    d.Research = parseInt(d.Research);
    d.SOP = parseFloat(d.SOP);
    d.Serial_No = parseInt(d.Serial_No);
    d.TOEFL_Score = parseInt(d.TOEFL_Score);
    d.University_Rating = parseInt(d.University_Rating);
	});
}

function drawApplicantCircles(data){
  applicantCirclesSvg.selectAll("circle")
  	.data(data)
  	.enter()
  	.append("circle")
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    .attr("cx", function(d, index) {
      return (50 + index * 70);
    })
    .attr("cy", height/2)
    .attr("r",  25)
    .on("click", function(d){
      clearApplicantTable();
      drawApplicantTable(d);
    });

		var text = applicantCirclesSvg.selectAll("text")
			.data(data)
			.enter()
			.append("text");

		var textLabels = text
			.attr("x", function(d, index) {
	      return (50 + index * 65);
	    })
			.attr("y", height/1.97)
			.text(function (d) {
				return d.Serial_No;
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "20px")
			.attr("fill", "black")
			.on("click", function(d){
	      clearApplicantTable();
	      drawApplicantTable(d);
	    });
}

function drawApplicantTable(applicantStats){
  console.log(applicantStats)
  var applicantStatsLength = 8;
  var p = d3.select("#applicant-table").select("#table-area").select("tbody");
  var tr = p.append("tr");
	tr.attr("class", "new-trs")
	tr.append("td").text(applicantStats.Serial_No);
  tr.append("td").text(applicantStats.CGPA);
  tr.append("td").text(applicantStats.GRE_Score);
	tr.append("td").text(applicantStats.LOR);
	tr.append("td").text(applicantStats.Research);
	tr.append("td").text(applicantStats.SOP);
	tr.append("td").text(applicantStats.TOEFL_Score);
	tr.append("td").text(applicantStats.University_Rating);
	tr.append("td").text(applicantStats.Chance_of_Admit);
}

function clearApplicantTable(){
  d3.selectAll(".new-trs").remove();
}



/*****************************New Functions - Steven Harris ********************/
function testDataProjections(data)
{
	data.forEach(function(d, index)
  {
		estimatedAdmissionsChance(d);
	});
}

function estimatedAdmissionsChance(applicant)
{
	var b0 = -1.2757251;
	var GRE_Score = 0.0018585;
	var TOEFL_Score = 0.0027780;
	var University_Rating =  0.0059414
	var SOP = 0.0015861;
	var LOR = 0.0168587;
	var CGPA = 0.1183851;
	var Research = 0.0243075;

	var estimate = b0 + applicant.GRE_Score * GRE_Score + applicant.TOEFL_Score*TOEFL_Score +
	 	applicant.University_Rating * University_Rating + applicant.SOP * SOP + applicant.LOR * LOR +
		applicant.CGPA * CGPA + applicant.Research * Research;

		console.log("Estimate for " + applicant.Serial_No + " : " + estimate + " compared to actual: " + (estimate/applicant.Chance_of_Admit) );

		return estimate;
}

function generateBubbleChart(inputData)
{

	//use later
}
/*****************************New Functions - Steven Harris ********************/