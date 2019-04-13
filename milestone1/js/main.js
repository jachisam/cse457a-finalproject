var width = 300, height = 400;
var padding = 20;
var margin = {top: 10, right: 15, bottom: 25, left: 5};

var heading = {height: 150, width: 250};

var poster = d3.select("#value-indicator")
	.append("svg")
	.attr('height', heading.height)
  .attr('width', heading.width);

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
			.text("Admission Highly Likely:")
			.attr("x",0)
			.attr("y",25)
			.attr('text-anchor','start')
			.attr('class','header');

			poster.append("rect")
				.attr("x",200)
				.attr("y",3)
				.attr("width",30)
				.attr("height",30)
				.attr("class","ahl");

			poster.append("text")
				.text("Admission Likely:")
				.attr("x",42)
				.attr("y",75)
				.attr('text-anchor','start')
				.attr('class','header');

				poster.append("rect")
					.attr("x",200)
					.attr("y",50)
					.attr("width",30)
					.attr("height",30)
					.attr("class","al");

			poster.append("text")
						.text("Admission Not Likely:")
						.attr("x",15)
						.attr("y",125)
						.attr('text-anchor','start')
						.attr('class','header');

			poster.append("rect")
							.attr("x",200)
							.attr("y",100)
							.attr("width",30)
							.attr("height",30)
							.attr("class","anl");

}

function drawApplicantTable(applicantStats)
{
  //console.log(applicantStats)
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

	/*

	lm(formula = Chance_of_Admit ~ GRE_Score + TOEFL_Score + University_Rating +
	    SOP + LOR + CGPA + Research, data = mydata)

	Residuals:
	      Min        1Q    Median        3Q       Max
	-0.266657 -0.023327  0.009191  0.033714  0.156818

	Coefficients:
	                    Estimate 	Std. Error 	t value 	Pr(>|t|)
	(Intercept)       -1.2757251  	0.1042962 	-12.232  	< 2e-16 ***
	GRE_Score          0.0018585  	0.0005023   	3.700 		0.000240 ***
	TOEFL_Score        0.0027780  	0.0008724   	3.184 		0.001544 **
	University_Rating  0.0059414  	0.0038019   	1.563 		0.118753
	SOP                0.0015861  	0.0045627   	0.348 		0.728263
	LOR                0.0168587  	0.0041379   	4.074 		5.38e-05 ***
	CGPA               0.1183851  	0.0097051  	12.198  	< 2e-16 ***
	Research           0.0243075  	0.0066057   	3.680 		0.000259 ***
	---
	Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1

	var estimate = b0 + applicant.GRE_Score * GRE_Score + applicant.TOEFL_Score*TOEFL_Score +
	 	applicant.University_Rating * University_Rating + applicant.SOP * SOP + applicant.LOR * LOR +
		applicant.CGPA * CGPA + applicant.Research * Research;

		*/

		var estimate = b0 + applicant.GRE_Score * GRE_Score + applicant.TOEFL_Score*TOEFL_Score +
		 	applicant.University_Rating * University_Rating + applicant.SOP * SOP + applicant.LOR * LOR +
			applicant.CGPA * CGPA + applicant.Research * Research;

		var altEstimate = b0 + applicant.GRE_Score * GRE_Score + applicant.TOEFL_Score*TOEFL_Score
									+ applicant.LOR * LOR + applicant.CGPA * CGPA + applicant.Research * Research;

		console.log("Chance of Admission estimate for " + applicant.Serial_No + " : " + parseFloat(estimate).toFixed(2) + " is predicted to "
			+ parseFloat((estimate/applicant.Chance_of_Admit)*100).toFixed(2) + "% of actual chance (" + applicant.Chance_of_Admit +")");
		//console.log("Estimate for " + applicant.Serial_No + " : " + estimate + " vs Alt estimate vs  actual: " + altEstimate + " " + applicant.Chance_of_Admit);

		return estimate;
}
/*****************************New Functions - Steven Harris ********************/
