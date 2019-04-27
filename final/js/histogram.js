var margin = {top: 10, right: 30, bottom: 50, left: 40},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#multiple_histogram")
    .append("svg")
    .attr("id","multiple_histogram_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id","multiple_histogram_g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
    .attr("id","y_axis_label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Count");

svg.append("text")
    .attr("id","x_axis_label")
    .attr("transform",
        "translate(" + (width/2) + "," +
        (height + 30) + ")")
    .style("text-anchor", "middle")
        .text("GRE_Score");

var select = d3.select('#select_div')
    .append('select')
    .attr("id","my_select")
    .attr('class','form-control')
    .on('change',selectionchange)
;

var color_for_each_factor_dict = {};


var my_graduate_admissions_data = "../data/graduate-admissions/Admission_Predict_Ver1.1.csv";


var x = d3.scaleLinear();
var y = d3.scaleLinear();
x_axis = svg.append("g").attr("id","x_axis");
y_axis = svg.append("g").attr("id","y_axis");

var data_as_global_variable;
var factor_selected = "GRE_Score";

initialize_multiple_histogram();

function initialize_multiple_histogram() {
d3.csv(my_graduate_admissions_data
    , function(data) {

        var factors = data.columns;
        for(var i = 0; i < factors.length; ++i)
        {
            color_for_each_factor_dict[factors[i]]
            =randomcolor();
        }
        data_as_global_variable = data;
        //delete factors[factors.indexOf('Serial_No')];
        //factors.unshift("     ");
        var options = select
            .selectAll('option')
            .data(factors.slice(1,factors.length)).enter()
            .append('option')
            .attr("id",function (d) {
                return d+'_option';
            })
            .style("color",function (d) {
                return color_for_each_factor_dict[d];
            })
            .text(function (d) { return d; });

        $('#my_select')
            .css("color",color_for_each_factor_dict['GRE_Score']);

        x.domain([d3.min(data, function(d) { return +d[factor_selected]; }),
            d3.max(data, function(d) { return +d[factor_selected]; })])
            .range([0, width]);
        d3.select("#x_axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var histogram = d3.histogram()
            .value(function(d) { return d[factor_selected]; })
            .domain(x.domain())
            .thresholds(20);

        var bins = histogram(data);

        y.range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);
        d3.select("#y_axis")
            .call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0); })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", color_for_each_factor_dict['GRE_Score']);

    });

}
function selectionchange() {
    var selectValue = d3.select('select').property('value');

    $('#my_select').css("color", $("select option:selected").css("color"));

    console.log(selectValue);

    factor_selected = selectValue;
    x.domain([d3.min(data_as_global_variable, function(d) { return +d[factor_selected]; }),
        d3.max(data_as_global_variable, function(d) { return +d[factor_selected]; })])
        .range([0, width]);

   d3.select("#x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    d3.select("#x_axis").call(d3.axisBottom(x));

    var histogram = d3.histogram()
        .value(function(d) { return d[factor_selected]; })
        .domain(x.domain())
        .thresholds(20);

    var bins = histogram(data_as_global_variable);

    y.range([height, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);
    d3.select("#y_axis")
        .call(d3.axisLeft(y));



    svg.selectAll("rect").remove();

    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0); })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", color_for_each_factor_dict[factor_selected])
        ;
    d3.select("#x_axis_label").text(factor_selected);
}

function randomcolor() {
    var l = '0123456789ABCDEF';
    var c = '#';
    for (var i = 0; i < 6; i++) {
        if(i<2)
        {
            c += l[Math.floor(Math.random() * 8)];
        }
        else if(i < 4)
        {
            c += l[Math.floor(Math.random() * 16)];
        }
        else
        {
            c += l[Math.floor(Math.random() * 8)+8];
        }

    }
    return c;
}
