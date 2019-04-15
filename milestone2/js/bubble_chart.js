//grant_title,id,organization,Chance_of_Admit,group,Grant start date,start_month,start_day,start_year
//GRE_Score,TOEFL_Score,University_Rating,SOP,LOR,CGPA,Research,Chance_of_Admit

/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * University_Rating and style inspired by:
 * https://bost.ocks.org/mike/chart/

*The Idea and skeleton was taken from the bill gates grant bubble chart:*
 http://vallandingham.me/gates_bubbles/
 */


 var pureData = [];

function bubbleChart()
{
  // Constants for sizing
  //var width = 940;
  //var height = 800;

  // var width = 663;
  // var height = 400;

  var width = 450;
  var height = 450;


  // tooltip for mouseover functionality
//  var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  var yearCenters = {
    2008: { x: width / 3, y: height / 2 },
    2009: { x: width / 2, y: height / 2 },
    2010: { x: 2 * width / 3, y: height / 2 }
  };

  // X locations of the year titles.
  var yearsTitleX = {
    2008: 160,
    2009: width / 2,
    2010: width - 160
  };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.3;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];
  var texts = null;

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();


  var fillColor = d3.scaleOrdinal(d3.schemeCategory10);

  function createNodes(rawData) {
    // Use the max Chance_of_Admit in the data as the max in the scale's domain
    // note we have to ensure the Chance_of_Admit is a number.
  //  var maxAmount = d3.max(rawData, function (d) { return +d.Chance_of_Admit; });

    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
  /*  var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([0, 1])
      .domain([0, 0.9]);
*/

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function (d,index)
    {

      var clr = "";
      var val = +d.Chance_of_Admit;
      var result = [];

      if(val > 0.89)
      {
        clr = "#28a745";
      }
      else
      {
        if( (0.7 < val) && (val < 0.9))
        {
          clr = "#007bff";
        }
        else
        {
            clr = "#dc3545";
        }
      }

      result.id= "c"+index;
      result.color= clr;
      //radius= radiusScale(+d.Chance_of_Admit),
      result.radius= 12*(+d.Chance_of_Admit);
      result.value= +d.Chance_of_Admit;
      result.name= index;
      result.org= d.University_Rating;
      result.group= d.CGPA;
      result.gre= d.GRE_Score;
      result.x= Math.random() * 900;
      result.y= Math.random() * 800;
      return result;
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });


      texts = svg.selectAll(null)
        .data(rawData)
        .enter()
        .append('text')
        .text(d => d.Chance_of_Admit)
        .attr('color', 'black')
        .attr('font-size', 15);

        // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 50)
      .attr('fill', function (d)
      {
        //console.dir(d);
          if(d.value > 0.89)
          {
            return "#28a745";
          }
          else
          {
            if( (0.7 < d.value) && (d.value < 0.9))
            {
              return "#007bff";
            }
            else
            {
                return "#dc3545";
            }
          }
          //return fillColor(d.Chance_of_Admit*100);
      })
      .attr("id",function(d){return d.id;})
      //.attr('stroke', function (d) { return "d3.rgb(fillColor(d.GRE_Score)).darker(); })
      .attr('stroke', function (d) { return "black";})
      .attr('stroke-width', 2)
      .on("mouseover", function(d){
        tooltip.transition() // http://bl.ocks.org/weiglemc/6185069
                 .duration(200)
                 .style("opacity", 1);
                tooltip.html('<span class="name">Applicant Number: </span><span class="value">' +
                              d.name +
                              '</span><br/>' +
                              '<span class="name">Chance of Admission: </span><span class="value">' +
                              Math.round(addCommas(d.value*100)) + "%" +
                              '</span><br/>' +
                              '<span class="name">GRE Score: </span><span class="value">' +
                              d.gre ) //+ '<br/><span class="name">More stats to come </span><span class="value">' + '</span>'
                 .style("left", (d3.event.pageX + 4) + "px")
                 .style("top", (d3.event.pageY - 24) + "px");
      })
      .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        })
      // .on('mouseover', showDetail)
      // .on('mouseout', hideDetail)
      .on("click", function(d,i)
      {
        clearApplicantTable();
        pureData[parseInt(d.id.substring(1,d.id.length))].Serial_No = d.name;
        drawApplicantTable(pureData[parseInt(d.id.substring(1,d.id.length))]);

       d3.select(this).style("fill","#ffc107");
       d3.select(this).attr("r",d.radius*1.5);

        svg.selectAll('.bubble')
              .data(nodes)
              .transition()
                .duration(1500)
              .style("opacity", function(b)
            {
                if(b.id != d.id)
                {
                  d3.select("#"+b.id).style("fill",b.color).attr("r",b.radius);

                }
                if( (b.id != d.id) && (b.color != d.color))
                {
                  return 0.1;
                }
                else
                {
                  return 1;
                }
            });
      });

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked()
  {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });

      texts.attr('x', (data) => {
           return data.x
       })
       .attr('y', (data) => {
           return data.y
       });
  }

  /*
   * Provides a x value for each node to be used with the split by year
   * x force.
   */
  /*function nodeYearPos(d) {
    return yearCenters[d.gre].x;
  }*/


  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles()
  {
    //hideYearTitles();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Sets visualization in "split by year mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * yearCenter of their data's year.
   */
  function splitBubbles()
  {
  //  showYearTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  /*
   * Hides Year title displays.
   */
  /*function hideYearTitles() {
    svg.selectAll('.year').remove();
  }*/

  /*
   * Shows Year title displays.
   */
  /*function showYearTitles()
  {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll('.year')
      .data(yearsData);

    years.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return yearsTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }*/


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d)
  {
    // change outline to indicate hover state.
    d3.select(this)
    .attr('stroke', 'red')
    .attr('stroke-width',5);

    var content = '<span class="name">Applicant Number: </span><span class="value">' +
                  d.name +
                  '</span><br/>' +
                  '<span class="name">Chance of Admission: </span><span class="value">' +
                  addCommas(d.value*100) + "%" +
                  '</span><br/>' +
                  '<span class="name">GRE Score: </span><span class="value">' +
                  d.gre + '<br/><span class="name">More stats to come </span><span class="value">' +

                  '</span>';

    tooltip.showTooltip(content, d3.event);
    //console.dir(bubbles._groups[0][d.id].attributes);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d)
  {
    // reset outline
    d3.select(this)
    .attr('stroke', "black")
    .attr('stroke-width',1);

    tooltip.hideTooltip();
    var bubbleMod = svg.selectAll('.bubble')
      .data(nodes)
      .transition()
        .duration(500)
      .style("opacity", function(b) {return 1;});
  }



  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function (displayName)
  {
    if (displayName === 'year')
    {
      splitBubbles();
    } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data)
{
  if (error)
  {
    //console.log(error);
  }

  pureData = data;
  convertToNumericData(pureData);

  myBubbleChart('#vis', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr)
{
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
d3.csv('../data/graduate-admissions/admission_cleaned.csv',display);
