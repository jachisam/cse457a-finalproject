var width = 700, height = 700;
var padding = 20;
var margin = {top: 10, right: 15, bottom: 25, left: 5};

var curr_array_aka_current_row = [];

var heading = {height: 150, width: 250};

var poster = d3.select("#value-indicator")
	.append("svg")
	.attr('height', heading.height - 100)
  .attr('width', heading.width + 200);

var selected_applicant = d3.select("#selected-applicant")
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
	printApplicant();
});

function convertToNumericData(data)
{
		data.forEach(function(d,index){
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
                .attr("class","ahl")
                .on("click",function () {
                    d3.selectAll("circle[fill='#C3D7EE']").style("opacity",1);
                    d3.selectAll("circle[fill='#2774AE']").style("opacity",0.1);
                    d3.selectAll("circle[fill='#003B5C']").style("opacity",0.1);

                })
            ;

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
                    .attr("class","al")
                    .on("click",function () {
                        d3.selectAll("circle[fill='#C3D7EE']").style("opacity",0.1);
                        d3.selectAll("circle[fill='#2774AE']").style("opacity",1);
                        d3.selectAll("circle[fill='#003B5C']").style("opacity",0.1);
                    });
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
                            .attr("class","anl")
                .on("click",function () {
                    d3.selectAll("circle[fill='#C3D7EE']").style("opacity",0.1);
                    d3.selectAll("circle[fill='#2774AE']").style("opacity",0.1);
                    d3.selectAll("circle[fill='#003B5C']").style("opacity",1);

                    //$('*').filter(function() {return $(this).css("fill") === 'rgb(195, 215, 238)';}).style("opacity",0.1);
                });
}

function printApplicant(){
	selected_applicant.append("text")
			.text("Selected Applicant Range:")
			.attr("x", 0)
			.attr("y", 20)
			.attr('text-anchor','start')
			.attr('font-weight','bold')
			.attr('class','header');
	selected_applicant.append("rect")
			.attr("x", 200)
			.attr("y", 1)
			.attr("width",10)
			.attr("height",30)
			.attr("class","yellow");
}

function drawApplicantTable(applicantStats)
{

  var p = d3.select("#applicant-table").select("#table-area").select("tbody");
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
	array["CGPA"] = parseFloat(document.getElementById("CGPA").innerHTML);
	array["GRE_Score"] = parseInt(document.getElementById("GRE_Score").innerHTML);
	array["LOR"] = parseFloat(document.getElementById("LOR").innerHTML);
	array["Research"] = parseInt(document.getElementById("Research").innerHTML);
	array["SOP"] = parseFloat(document.getElementById("SOP").innerHTML);
	array["TOEFL_Score"] = parseInt(document.getElementById("TOEFL_Score").innerHTML);
	array["University_Rating"] = parseInt(document.getElementById("University_Rating").innerHTML);
	array["Chance_of_Admit"] = document.getElementById("Chance_of_Admit").innerHTML;


	//Get the prediction for the array of values (i.e. the data in the table), send it to "estimatedAdmissionsChance" function, when the value comes back, limit it to 2 places after the decimal
	var prediction = parseFloat(estimatedAdmissionsChance(array)).toFixed(2);
	//use d3 to select the chance of Admission text box and put the new prediction in it.
	d3.select("#Chance_of_Admit").text(prediction);
	// console.log(array); console.dir(array);
	var coa = document.getElementById("Chance_of_Admit").innerHTML;
	if(coa > 1){
		document.getElementById("Chance_of_Admit").innerHTML = 1;
		coa = 1;
	}
	if(coa < 0){
		document.getElementById("Chance_of_Admit").innerHTML = 0;
		coa = 0;
	}
	gauge1.update(coa*100);
	// var variables = estimatedVariableChances(array);
	// var p = d3.select("#applicant-table").select("#table-area");
	// p.select("#an").append("td").text(array["Serial_No"]).attr("id","CGPA").attr("class", "new-trs");
  // p.select("#cgpa").append("td").text(" (" + variables["CGPA"] + "%)").attr("id","CGPA").attr("class", "new-trs");
  // p.select("#gre").append("td").text(" (" + variables["GRE_Score"] + "%)").attr("id","GRE_Score").attr("class", "new-trs"); //  p.select("#gre_h").append("text").text(" (" + variables["GRE_Score"] + "%)").attr("id","GRE_Score").attr("contenteditable", "true").attr("class", "new-trs");
	// p.select("#lor").append("td").text(" (" + variables["LOR"] + "%)").attr("id","LOR").attr("class", "new-trs");
	// p.select("#research").append("td").text(" (" + variables["Research"] + "%)").attr("id","Research").attr("class", "new-trs");
	// p.select("#sop").append("td").text(" (" + variables["SOP"] + "%)").attr("id","SOP").attr("class", "new-trs");
	// p.select("#toefl").append("td").text(" (" + variables["TOEFL_Score"] + "%)").attr("id","TOEFL_Score").attr("class", "new-trs");
	// p.select("#universityRating").append("td").text(" (" + variables["University_Rating"] + "%)").attr("id","University_Rating").attr("class", "new-trs");
	// p.select("#coa").append("td").text(coa*100+"%").attr("id","University_Rating").attr("class", "new-trs");


		array["name"] = +array["Serial_No"];
		array["value"] = +prediction;

		generate_chart(array);
//Throw the estimate on the screen for our (you, me, and Z's benefit)
	return "Your estimated chance of admissions is " + prediction*100 + "%";
	// return array;
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

function estimatedVariableChances(applicant){
	var b0 = -1.2757251;
	var GRE_Score = 0.0018585;
	var TOEFL_Score = 0.0027780;
	var University_Rating =  0.0059414
	var SOP = 0.0015861;
	var LOR = 0.0168587;
	var CGPA = 0.1183851;
	var Research = 0.0243075;
	var variables = {};
	variables["CGPA"] = Math.round((applicant.CGPA * CGPA)*100)/100;
	variables["GRE_Score"] = Math.round((applicant.GRE_Score * GRE_Score)*100)/100;
	variables["LOR"] = Math.round((applicant.LOR * LOR)*100)/100;
	variables["Research"] = Math.round((applicant.Research * Research)*100)/100;
	variables["SOP"] = Math.round((applicant.SOP * SOP)*100)/100;
	variables["TOEFL_Score"] = Math.round((applicant.TOEFL_Score*TOEFL_Score)*100)/100;
	variables["University_Rating"] = Math.round((applicant.University_Rating * University_Rating)*100)/100;
	return variables;
}
