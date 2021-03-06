// height and width of the svg
var width = 1000;
var height = 450;
// the name of the current admission factor being processed
var curr_admission_factor = "";
// flag to tell with the timer to stop animation
var stop_measuring = 0;
// record the number of factors
var num_admission_factors = 0;
// record the index of the current factor in the array of factor names
var curr_measure_index = 0;
// the current row of the list of data that id being processed
var curr_row = {};
// record the list of admission factors
var admission_factors = [];
// variable for the timer that controls when to start measuring animation
var start_measure;
// variable for the timer interval that controls how long an animation is
var measuring;
// variable for the timer that controls when to re-start
var setback;
// store the avg values of each factor for those who are admitted
var admission_factor_standards = {
    GRE_Score: 328,
    TOEFL_Score: 114,
    University_Rating: 4,
    SOP:4.2,
    LOR: 4.2,
    CGPA: 9.25,
    Research:1
};
// record  the water level
var waterlevel;


var lineGenerator = d3v3.svg.line();
// coefficients for each factor obtained by the stastical analysis
var admission_factor_coefficients =
    {
        GRE_Score: 0.001859,
        TOEFL_Score: 0.002778,
        University_Rating: 0.005941,
        SOP:0.001586,
        LOR: 0.016859,
        CGPA: 0.118385,
        Research:0.024307
    };

// the sum of the coefficients
var admission_factor_coefficients_sum = 0;

// the dict to record weights for each factor
var admission_factor_weights = {};


// left end of the balance bar
var left_elbow = [];
// right end of the balance bar
var right_elbow = [];
// the [x,y] of the location of the closed pump
var pump_closed_point = [];
// the [x,y] of the location of the open pump
var pump_open_point = [];
// the [x,y] of the location of the closed drain
var drain_open_point = [];
// the [x,y] of the location of the open drain
var drain_closed_point = [];

// the initial position of the upper end of the left vertical line
var old_left_verical = [];
// the initial position of the upper end of the right vertical line
var old_right_vertical = [];
// the initial x position of the pan of the left vertical line
var old_left_pan_x = 0;
// the initial y position of the pan of the left vertical line
var old_left_pan_y = 0;
// the initial x position of the pan of the right vertical line
var old_right_pan_x = 0;
// the initial y position of the pan of the right vertical line
var old_right_pan_y = 0;
// var to hold the water tank object
var gauge_tank;

// current tank level
var current_tank_level = 60;

// scale the degree of rotation based on percentage diff of the two sides of balance
var degree_scale = d3v3.scale.linear()
    .domain([-1, 1])
    .range([85, -85]);
// scale the size of water fill based on percentage diff of the two sides of balance
var water_fill_scale = d3v3.scale.linear().domain([0,1*0.6894272486387328*60])
    .range([20,100]);
// scale the size of the ball based ln percentage diff of the two sides of balance
var ball_scale = d3v3.scale.linear().domain([0.001586,0.6894272486387328])
    .range([1,20]);

// a copy of the position data of the right upper side of the water tank
var upper_right_side_data_reuse;
// a copy of the position data of the left upper side of the water tank

var upper_left_side_data_reuse;


d3v3.csv("../data/graduate-admissions/admission_cleaned.csv", function (error,data) {
    //console.log("read data in watertank.js");
    //console.log(data);

    for (var field in admission_factor_coefficients)
    {
        admission_factor_coefficients_sum += admission_factor_coefficients[field];
    }

    for (var field in admission_factor_coefficients)
    {
        admission_factor_weights[field] = admission_factor_coefficients[field]
        /admission_factor_coefficients_sum;
    }

    var svg = d3v3.select("#watertank_div")
        //.select("body").append("div")
        // .attr("id","watertank_div")
        .append("svg")
        .attr("id","watertank_svg")
        .attr("width", width)
        .attr("height", height);

    var g_control = svg.append("g").attr("id","g_control")
        .attr("transform","scale(0.8)");

    // display serial number
    g_control.append("text").attr("id","serial_display").text("Current applicant's serial number: ")
        .attr("x",50).attr("y",50);

    // display current factor
    g_control.append("text").attr("id","current_factor")
        .text("Current admission factor: ")
        .attr("x",50).attr("y",100);


    //balance
    var left_vertical_data = [[100,200],[100,150]];
    var left_vertical = lineGenerator(left_vertical_data);
    g_control
        .append('path')
        .attr("id","left_vertical")
        .attr('d', left_vertical)
        .style("stroke","black");

    var right_vertical_data = [[200,200],[200,150]];
    var right_vertical = lineGenerator(right_vertical_data);
    g_control
        .append('path')
        .attr("id","right_vertical")
        .attr('d', right_vertical)
        .style("stroke","black");

    left_elbow = left_vertical_data[0];
    right_elbow = right_vertical_data[0];
    old_left_verical = left_vertical;
    old_right_vertical = right_vertical;

    var horizontal_data = [left_vertical_data[0],right_vertical_data[0]];
    var horizontal = lineGenerator(horizontal_data);
    g_control
        .append("g")
        .attr("id","horizontal_bar")
        .append('path')
        .attr("id","horizontal")
        .attr('d', horizontal)
        .style("stroke","black");

    var midpoint = find_midpoint(left_vertical_data[0],right_vertical_data[0]);
    var down_vertical_data =
        [
           midpoint
        ,
        [
            midpoint[0],
            midpoint[1]+150
        ]
    ];
    var down_vertical = lineGenerator(down_vertical_data);
    g_control
        .append('path')
        .attr("id","down_vertical")
        .attr('d', down_vertical)
        .style("stroke","black");

    g_control.append("rect")
        .attr("id","left_pan").attr("x",left_vertical_data[1][0]-25)
        .attr("y",left_vertical_data[1][1])
        .attr("height",10).attr("width","50")
        .attr("fill","pink");

    old_left_pan_x = left_vertical_data[1][0]-25;
    old_left_pan_y = left_vertical_data[1][1];
    g_control.append("rect")
        .attr("id","right_pan").attr("x",right_vertical_data[1][0]-25)
        .attr("y",right_vertical_data[1][1])
        .attr("height",10).attr("width","50")
        .attr("fill","pink");
    old_right_pan_x = right_vertical_data[1][0]-25;
    old_right_pan_y = right_vertical_data[1][1];


    //tank frame
    var upper_left_side_data = [[400,midpoint[1]+200],[400,midpoint[1]-150]]
    var upper_left_side = lineGenerator(upper_left_side_data);
    g_control.append("path").attr("id","upper_left_side")
        .attr("d",upper_left_side)
        .style("stroke","black");

    var upper_right_side_data = [[900,midpoint[1]+200],[900,midpoint[1]-150]]
    var upper_right_side = lineGenerator(upper_right_side_data);
    g_control.append("path").attr("id","upper_right_side")
        .attr("d",upper_right_side)
        .style("stroke","black");

    var base_side_data =
        [
        [upper_left_side_data[0][0],upper_left_side_data[0][1]+50]
        , [upper_right_side_data[0][0],upper_right_side_data[0][1]+50]
    ];
    var base_side = lineGenerator(base_side_data);
    g_control.append("path").attr("id","base_side")
        .attr("d",base_side)
        .style("stroke","black");

    //pump and drain

    g_control.append("rect")
        .attr("id","pump_closed").attr("x",base_side_data[0][0]-5)
        .attr("y",upper_left_side_data[0][1])
        .attr("height",50).attr("width",10)
        .attr("fill","aqua").style("opacity",1);

    pump_closed_point = [base_side_data[0][0]-5,upper_left_side_data[0][1]];

    g_control.append("rect")
        .attr("id","drain_closed").attr("x",base_side_data[1][0]-5)
        .attr("y",upper_right_side_data[0][1])
        .attr("height",50).attr("width",10)
        .attr("fill","red").style("opacity",1);
    drain_closed_point = [base_side_data[1][0]-5,upper_right_side_data[0][1]];

    g_control.append("rect")
        .attr("id","pump_open").attr("x",base_side_data[0][0]-55)
        .attr("y",base_side_data[0][1])
        .attr("height",10).attr("width",50)
        .style("opacity",0)
        .attr("fill","aqua");

    pump_open_point = [base_side_data[0][0]-55,base_side_data[0][1]];

    g_control.append("rect")
        .attr("id","drain_open").attr("x",base_side_data[1][0]+5)
        .attr("y",base_side_data[1][1])
        .attr("height",10).attr("width",50)
        .style("opacity",0)
        .attr("fill","red");

    drain_open_point = [base_side_data[1][0]+5,base_side_data[1][1]];

    g_control.append('path')
        .attr("id","pump_string")
        .attr("d",lineGenerator([left_elbow,pump_closed_point]))
        .style("stroke","aqua");
    g_control.append('path')
        .attr("id","drain_string")
        .attr("d",lineGenerator([right_elbow,drain_closed_point]))
        .style("stroke","red");



    // get the necessary info
    num_admission_factors = Object.keys(data[0]).length;
    admission_factors = Object.keys(data[0]).slice();
    curr_row = data[0];
    convert_row_to_numeric(curr_row);





upper_right_side_data_reuse = upper_right_side_data;
upper_left_side_data_reuse = upper_left_side_data;


// fill in the water tank to an initial level
    d3v3.select("#water_in_tank_svg").remove();
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


    // prepare the two balls on balance

    d3v3.select("#g_control").append("path").attr("id","marker").attr("d",
        lineGenerator([[upper_right_side_data_reuse[0][0],150],
            [upper_right_side_data_reuse[0][0]-100,150]]))
        .style("stroke","red");

    d3v3.select("#g_control").append("circle")
        .attr("id","left_ball")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",0);

    d3v3.select("#g_control").append("circle")
        .attr("id","right_ball")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",0);





});

/*

This gets called when update button is clicked. Wait for 3 seconds
and then start the animation
 */
function start_measure_when_update_clicked(data_from_update)
{

    //gauge_tank.update(60);
    console.log("ready to update in watertank.js");
    curr_row = data_from_update;
    var serial_no = curr_row['Serial_No'];
    d3v3.select("#serial_display").text("Current applicant's serial number: "
        + serial_no);

    delete curr_row['Serial_No'];
    convert_row_to_numeric(curr_row);
    //console.log(curr_row);



    // define the time needed to go over one factor

    start_measure = setTimeout(measure,3000);
    console.log("finish update in watertank.js");

}

/*
set the time for one factor's animation
 */
function measure() {
    measuring = setInterval(measure_one_by_one,
        3000);
}

/*
Helper function to find the mid point
 */
function find_midpoint(point_x, point_y)
{
    var midpoint = [0,0];
    midpoint[0] = (point_x[0] + point_y[0])/2;
    midpoint[1] = (point_x[1] + point_y[1])/2;
    return midpoint;
}

/*/
Go over each factor one by one. A ball
representing the factor, e.g., GRE's value will be put
on the balance against a ball representing the avg GRE of the admitted students
Depending on the percentage difference, the balance will
rotate different degrees and the water level will be raised and dropped proportionally.
 */
function measure_one_by_one()
{
    if(stop_measuring == 1)
    {
        ////console.log("done with evaluating admission factors!");
       // curr_measure_index = 0;
       // curr_admission_factor = "";

    }


    else
    {
        // do something: change the balance
        curr_admission_factor = admission_factors[curr_measure_index];

        if(curr_admission_factor == "Research")
        {
            stop_measuring = 1;
        }

        ////console.log(new Date().toLocaleTimeString());
        ////console.log(curr_admission_factor);
        ////console.log(curr_row);

        d3v3.select("#current_factor")
            .text("Current admission factor: " + curr_admission_factor
            + " " + "value: " + curr_row[curr_admission_factor] );



        var percentage_diff = (curr_row[curr_admission_factor]-admission_factor_standards[curr_admission_factor])
            /admission_factor_standards[curr_admission_factor];

        // find the size of the current water fill
        var curr_portion = admission_factor_weights[curr_admission_factor]*60;

        //console.log(admission_factor_weights);
        var curr_addon = percentage_diff*curr_portion;

        if(isNaN(curr_addon))
        {
            curr_addon = 0;
        }
        if(curr_addon < 1 && curr_addon>0)
        {
            curr_addon = 1;
        }
        current_tank_level = current_tank_level+Math.round(curr_addon);
        if(current_tank_level>=80)
        {
            current_tank_level = 80;
        }
        // update the water level
        gauge_tank.update(current_tank_level);
        if(percentage_diff >= 1)
        {
            percentage_diff = 1;
        }
        if(percentage_diff <= -1)
        {
            percentage_diff = -1;
        }

        var degree = degree_scale(percentage_diff);

        console.log("degree:" + degree + " " + "%:" + percentage_diff
        +" " + curr_admission_factor + " "
            + curr_row[curr_admission_factor] + " "
        + admission_factor_standards[curr_admission_factor] );


        // animate the balance
        var self = d3v3.select("#horizontal_bar").node();
        var cx = self.getBBox().x + self.getBBox().width/2;
        var cy = self.getBBox().y + self.getBBox().height/2;

        d3v3.select("#horizontal_bar").transition().attr("transform",function () {
            return 'rotate(' + degree.toString() + ',' + cx.toString() + "," + cy.toString() + ")";
        });

        //100 200, 200 150
        var new_left_end = rotate_point(cx,cy,100,200,degree);
        var new_right_end = rotate_point(cx,cy,200,200,degree);

        var left_vertical_data = [new_left_end,
            [new_left_end[0]
                ,
                new_left_end[1]-50]
        ];
        var left_vertical = lineGenerator(left_vertical_data);
       d3v3.select("#left_vertical").transition().attr("d",left_vertical);

        var right_vertical_data = [new_right_end,
            [new_right_end[0]
                ,
                new_right_end[1]-50]
        ];
        var right_vertical = lineGenerator(right_vertical_data);
        d3v3.select("#right_vertical").transition().attr("d",right_vertical);


        d3v3.select("#left_pan").transition()
            .attr("x",left_vertical_data[1][0]-25)

            .attr("y",left_vertical_data[1][1]);

        d3v3.select("#right_pan").transition()
            .attr("x",right_vertical_data[1][0]-25)

            .attr("y",right_vertical_data[1][1]);
        var right_r = ball_scale(admission_factor_weights[curr_admission_factor]);
        var left_r = (1+percentage_diff)*ball_scale(admission_factor_weights[curr_admission_factor]);

        d3v3.select("#left_ball").transition()
            .attr("cx",left_vertical_data[1][0])
            .attr("cy",left_vertical_data[1][1]-left_r)
            .attr("r",left_r);

        d3v3.select("#right_ball").transition()
            .attr("cx",right_vertical_data[1][0])
            .attr("cy",right_vertical_data[1][1]-right_r)
            .attr("r",right_r);

        // open the pump or drain and attach water animation
        if(curr_row[curr_admission_factor]
            >= admission_factor_standards[curr_admission_factor])
        {
            d3v3.select("#pump_string").transition().attr("d",lineGenerator([new_left_end,pump_open_point]));
            d3v3.select("#drain_string").transition().attr("d",lineGenerator([new_right_end,drain_closed_point]));
            d3v3.select("#pump_closed").transition().style("opacity",0);
            d3v3.select("#pump_open").transition().style("opacity",1);


            d3v3.select("#g_control").append("svg")
                .attr("id","water_in_svg")
                .attr("width","190")
                .attr("height","50")
                .attr("x",pump_open_point[0] -70)
                .attr("y",pump_open_point[1]-50);
            var water = liquidFillGaugeDefaultSettings();
            water.circleThickness = 0;
            water.circleColor = "#808015";
            water.textColor = "#555500";
            water.waveTextColor = "#FFFFAA";
            water.waveColor = "#33DAFF";
            water.textVertPosition = 0.2;
            water.waveAnimateTime = 1000;
            water.textSize = 0;

            var gauge_fill = loadLiquidFillGauge("water_in_svg", 60.44, water);
            gauge_fill.update(water_fill_scale(curr_addon));
            d3v3.select("#water_in_svg").select("g").select("g").select("circle")
                .attr("r",100);

        }
        else
        {
            d3v3.select("#drain_string").transition().attr("d",lineGenerator([new_right_end,drain_open_point]));
            d3v3.select("#pump_string").transition().attr("d",lineGenerator([new_left_end,pump_closed_point]));
            d3v3.select("#drain_closed").transition().style("opacity",0);
            d3v3.select("#drain_open").transition().style("opacity",1);

            d3v3.select("#g_control").append("svg")
                .attr("id","water_in_svg_drain")
                .attr("width","190")
                .attr("height","50")
                .attr("x",drain_open_point[0] -80)
                .attr("y",drain_open_point[1]-50);
            var water = liquidFillGaugeDefaultSettings();
            water.circleThickness = 0;
            water.circleColor = "#808015";
            water.textColor = "#555500";
            water.waveTextColor = "#FFFFAA";
            water.waveColor = "#33DAFF";
            water.textVertPosition = 0.2;
            water.waveAnimateTime = 1000;
            water.textSize = 0;

            var gauge_fill = loadLiquidFillGauge("water_in_svg_drain", 60.44, water);
            gauge_fill.update(water_fill_scale(Math.abs(curr_addon)));
            d3v3.select("#water_in_svg_drain").select("g").select("g").select("circle")
                .attr("r",100);

        }

        // set the balance back in initial place after 2 seconds
        setback = setTimeout(setback_balance_bar,2000);
        if(curr_measure_index < 6)
        {
            ++curr_measure_index;
        }
    }

    // Eric White 314 332 7266
}

/*
convert values to numerics
 */
function convert_row_to_numeric(some_data) {
    for (var field in some_data) {
        some_data[field] = +some_data[field];
    }

}


/*
Reset the balance back to initial place using the data recorded
 */
function setback_balance_bar() {

    d3v3.select("#water_in_svg").transition().remove();
    d3v3.select("#water_in_svg_drain").transition().remove();
    d3v3.select("#pump_string").transition().attr("d",lineGenerator([left_elbow,pump_closed_point]));
    d3v3.select("#drain_string").transition().attr("d",lineGenerator([right_elbow,drain_closed_point]));

    d3v3.select("#left_ball").transition()
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",0);

    d3v3.select("#right_ball").transition()
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",0);

    var degree = 0;
    d3v3.select("#horizontal_bar").transition().attr("transform",function () {
        var self = d3v3.select("#horizontal_bar").node();
        var cx = self.getBBox().x + self.getBBox().width/2;
        var cy = self.getBBox().y + self.getBBox().height/2;
        return 'rotate(' + degree.toString() + ',' + cx.toString() + "," + cy.toString() + ")";
    });

    d3v3.select("#left_pan").transition()
        .attr("x",old_left_pan_x)

        .attr("y",old_left_pan_y);

    d3v3.select("#right_pan").transition()
        .attr("x",old_right_pan_x)

        .attr("y",old_right_pan_y);

    d3v3.select("#left_vertical").transition().attr("d",old_left_verical);

    d3v3.select("#right_vertical").transition().attr("d",old_right_vertical);

    d3v3.select("#pump_closed").transition().style("opacity",1);
    d3v3.select("#pump_open").transition().style("opacity",0);
    d3v3.select("#drain_closed").transition().style("opacity",1);
    d3v3.select("#drain_open").transition().style("opacity",0);



}

/*
convert degree to radians
 */
function degree_to_radians (angle) {
    return angle * (Math.PI / 180);
}

/*
calculate the position of a point after rotation
 */
function rotate_point(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle;
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var newx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
    var newy = (cos * (y - cy)) + (sin * (x - cx)) + cy;
    return [newx, newy];
}
