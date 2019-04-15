var width = 300, height = 400;
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
			.text("Admission Chance")
			.attr("x", 0)
			.attr("y", 20)
			.attr('text-anchor','start')
			.attr('font-weight','bold')
			.attr('class','header');
	poster.append("text")
			.text("Highly Likely:")
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
				.text("Likely:")
				.attr("x", 150)
				.attr("y", 45)
				.attr('text-anchor','start')
				.attr('class','header');

				poster.append("rect")
					.attr("x", 200)
					.attr("y", 26)
					.attr("width",30)
					.attr("height",30)
					.attr("class","al");

			poster.append("text")
						.text("Not Likely:")
						.attr("x", 250)
						.attr("y", 45)
						.attr('text-anchor','start')
						.attr('class','header');

			poster.append("rect")
							.attr("x", 330)
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
  var tr = p.append("tr");
	tr.attr("class", "new-trs")
	tr.append("td").text(applicantStats.Serial_No).attr("id","Serial_No").attr("contenteditable", "true");
  tr.append("td").text(applicantStats.CGPA).attr("id","CGPA").attr("contenteditable", "true");
  tr.append("td").text(applicantStats.GRE_Score).attr("id","GRE_Score").attr("contenteditable", "true");
	tr.append("td").text(applicantStats.LOR).attr("id","LOR").attr("contenteditable", "true");
	tr.append("td").text(applicantStats.Research).attr("id","Research").attr("contenteditable", "true");
	tr.append("td").text(applicantStats.SOP).attr("id","SOP").attr("contenteditable", "true");
	tr.append("td").text(applicantStats.TOEFL_Score).attr("id","TOEFL_Score").attr("contenteditable", "true");
	tr.append("td").text(applicantStats.University_Rating).attr("id","University_Rating").attr("contenteditable", "true");
	tr.append("td").text(applicantStats.Chance_of_Admit).attr("id","Chance_of_Admit").attr("contenteditable", "true");
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

/*
	var Serial_No = document.getElementById("Serial_No").innerHTML;
	var CGPA = document.getElementById("CGPA").innerHTML;
	var GRE_Score = document.getElementById("GRE_Score").innerHTML;
	var LOR = document.getElementById("LOR").innerHTML;
	var Research = document.getElementById("Research").innerHTML;
	var SOP = document.getElementById("SOP").innerHTML;
	var TOEFL_Score = document.getElementById("TOEFL_Score").innerHTML;
	var University_Rating = document.getElementById("University_Rating").innerHTML;
	var Chance_of_Admit = document.getElementById("Chance_of_Admit").innerHTML;

	array.push(Serial_No,CGPA,GRE_Score,LOR,Research,SOP,TOEFL_Score,University_Rating,Chance_of_Admit);
*/
	console.log(array);
	console.dir(array);
	curr_array_aka_current_row = array;

	window.clearTimeout(start_measure);
	window.clearTimeout(setback);
	window.clearInterval(measuring);

	d3v3.select("#water_in_tank_svg").remove();
	d3v3.select("#current_factor").text("Current admission factor: ");
	d3v3.select("#g_control").append("svg")
		.attr("id","water_in_tank_svg")
		.attr("width",500+5)
		.attr("height",500)
		.attr("x",pump_closed_point[0] + 10 )
		.attr("y",pump_closed_point[1]-450);
	waterlevel = liquidFillGaugeDefaultSettings();
	waterlevel.circleColor = "#FF7777";
	waterlevel.textColor = "#FF4444";
	waterlevel.waveTextColor = "#FFAAAA";
	waterlevel.waveColor = "#48A4B9";
	waterlevel.circleThickness = 0;

	waterlevel.textVertPosition = 0.8;
	waterlevel.waveAnimateTime = 1000;
	waterlevel.waveHeight = 0.01;
	waterlevel.waveAnimate = false;
	waterlevel.waveRise = false;
	waterlevel.waveHeightScaling = false;
	waterlevel.waveOffset = 0.05;
	waterlevel.textSize = 0;
	waterlevel.waveCount = 3;
	/*
*/
	gauge_tank= loadLiquidFillGauge("water_in_tank_svg",
		60, waterlevel);
	//gauge_tank.update(20);
	d3v3.select("#water_in_tank_svg").select("g").select("g").select("circle")
		.attr("r","500");



	d3v3.select("#g_control").append("path").attr("id","marker").attr("d",
		lineGenerator([[upper_right_side_data_reuse[0][0],150],
			[upper_right_side_data_reuse[0][0]-100,150]]))
		.style("stroke","red");

	stop_measuring = 0;
	curr_measure_index = 0;
	curr_admission_factor = "";
	current_tank_level = 60;
	start_measure_when_update_clicked(array);

	var prediction = parseFloat(estimatedAdmissionsChance(array)).toFixed(2);

	d3.select("#Chance_of_Admit").text(prediction);
	return "Your estimated chance of admissions is " + prediction*100 + "%";
	//return array;
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
