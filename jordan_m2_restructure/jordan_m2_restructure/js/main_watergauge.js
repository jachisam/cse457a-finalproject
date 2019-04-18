var width = 700, height = 700;
var padding = 20;
var margin = {top: 10, right: 15, bottom: 25, left: 5};

var curr_array_aka_current_row = [];

var heading = {height: 150, width: 250};

var poster = d3.select("#value-indicator")
	.append("svg")
	.attr('height', heading.height - 100)
  .attr('width', heading.width + 200);

var applicantTableSvg = d3.select("#applicant-table")
	.append("svg")
	.attr("height", height-400)
	.attr("width", width-200);

// Load CSV file
var graduate_admissions_data = "../data/graduate-admissions/Admission_Predict_Ver1.1.csv";
var test_data = "../data/graduate-admissions/test-data.csv"
d3.csv(test_data, function(data){
  convertToNumericData(data);
});

//NEW FUNCTIONS NEW DATA
d3.csv(graduate_admissions_data,function(data)
{
	convertToNumericData(data);
	testDataProjections(data);
	printHeading();
});

function convertToNumericData(data)
{
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

function printHeading()
{
	poster.append("text")
			.text("Chance of Admission")
			.attr("x", 0)
			.attr("y", 20)
			.attr('text-anchor','start')
			.attr('font-weight','bold')
			.attr('class','header');
	poster.append("text")
			.text("Above 90%:")
			.attr("x", 0)
			.attr("y", 45)
			.attr('text-anchor','start')
			.attr('class','header');

			poster.append("rect")
				.attr("x", 100)
				.attr("y", 26)
				.attr("width",30)
				.attr("height",30)
				.attr("class","ahl");

			poster.append("text")
				.text("70% - 90%:")
				.attr("x", 160)
				.attr("y", 45)
				.attr('text-anchor','start')
				.attr('class','header');

				poster.append("rect")
					.attr("x", 255)
					.attr("y", 26)
					.attr("width",30)
					.attr("height",30)
					.attr("class","al");

			poster.append("text")
						.text("Below 70%:")
						.attr("x", 310)
						.attr("y", 45)
						.attr('text-anchor','start')
						.attr('class','header');

			poster.append("rect")
							.attr("x", 410)
							.attr("y", 26)
							.attr("width",30)
							.attr("height",30)
							.attr("class","anl");

}

function drawApplicantTable(applicantStats)
{
  //console.log(applicantStats)
  var applicantStatsLength = 8;
  var p = d3.select("#applicant-table").select("#table-area").select("tbody");
  // var tr = p.append("t");
	p.select("#an").append("td").text(applicantStats.Serial_No).attr("id","Serial_No").attr("contenteditable", "true").attr("class", "new-trs");
  p.select("#cgpa").append("td").text(applicantStats.CGPA).attr("id","CGPA").attr("contenteditable", "true").attr("class", "new-trs");
  p.select("#gre").append("td").text(applicantStats.GRE_Score).attr("id","GRE_Score").attr("contenteditable", "true").attr("class", "new-trs");
	p.select("#lor").append("td").text(applicantStats.LOR).attr("id","LOR").attr("contenteditable", "true").attr("class", "new-trs");
	p.select("#research").append("td").text(applicantStats.Research).attr("id","Research").attr("contenteditable", "true").attr("class", "new-trs");
	p.select("#sop").append("td").text(applicantStats.SOP).attr("id","SOP").attr("contenteditable", "true").attr("class", "new-trs");
	p.select("#toefl").append("td").text(applicantStats.TOEFL_Score).attr("id","TOEFL_Score").attr("contenteditable", "true").attr("class", "new-trs");
	p.select("#universityRating").append("td").text(applicantStats.University_Rating).attr("id","University_Rating").attr("contenteditable", "true").attr("class", "new-trs");
	p.select("#coa").append("td").text(applicantStats.Chance_of_Admit).attr("id","Chance_of_Admit").attr("contenteditable", "true").attr("class", "new-trs");

	gauge1.update(applicantStats.Chance_of_Admit*100);
}

function grabButtonData()
{
	var array = {};

	array["Serial_No"] = document.getElementById("Serial_No").innerHTML;
	array["CGPA"] = document.getElementById("CGPA").innerHTML;
	array["GRE_Score"] = document.getElementById("GRE_Score").innerHTML;
	array["LOR"] = document.getElementById("LOR").innerHTML;
	array["Research"] = document.getElementById("Research").innerHTML;
	array["SOP"] = document.getElementById("SOP").innerHTML;
	array["TOEFL_Score"] = document.getElementById("TOEFL_Score").innerHTML;
	array["University_Rating"] = document.getElementById("University_Rating").innerHTML;
	array["Chance_of_Admit"] = document.getElementById("Chance_of_Admit").innerHTML;

	console.log(array);
	console.dir(array);

	return array;
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

		//This is the most accurate result
		var estimate = b0 + applicant.GRE_Score * GRE_Score + applicant.TOEFL_Score*TOEFL_Score +
		 	applicant.University_Rating * University_Rating + applicant.SOP * SOP + applicant.LOR * LOR +
			applicant.CGPA * CGPA + applicant.Research * Research;

		//This estimate removes the non-significant variables (i.e. University_Rating and SOP)
		//but gives us a lower estimate.
		var altEstimate = b0 + applicant.GRE_Score * GRE_Score + applicant.TOEFL_Score*TOEFL_Score
									+ applicant.LOR * LOR + applicant.CGPA * CGPA + applicant.Research * Research;

		// console.log("Chance of Admission estimate for " + applicant.Serial_No + " : " + parseFloat(estimate).toFixed(2) + " is predicted to "
			// + parseFloat((estimate/applicant.Chance_of_Admit)*100).toFixed(2) + "% of actual chance (" + applicant.Chance_of_Admit +")");
		//console.log("Estimate for " + applicant.Serial_No + " : " + estimate + " vs Alt estimate vs  actual: " + altEstimate + " " + applicant.Chance_of_Admit);

		return estimate;
}
/*****************************New Functions - Steven Harris ********************/
