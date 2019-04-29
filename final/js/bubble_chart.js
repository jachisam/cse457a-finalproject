/*
*The Idea and skeleton was taken from the bill gates grant bubble chart:
http://vallandingham.me/gates_bubbles/

This implementation was initially made for donation funds and three
distinct years, however, I really liked the idea of using bubbles for
selecting items so it has been drastically modified to fit that purpose.
We kept a subset of the functions and modified all of the remain functions
to fit our dataset.

*/


var pureData = [];

function bubbleChart()
{
  // Constants for sizing
  var width = 450;
  var height = 450;

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = {
    x: width / 2,
    y: height / 2
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
  function charge(d)
  {
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

  function createNodes(rawData)
  {
    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function(d, index)
    {

      var clr = "";
      var val = +d.Chance_of_Admit;
      var result = [];

      if (val > 0.89)
      {
        clr = "#C3D7EE";
      }
      else
      {
        if ((0.7 < val) && (val <= 0.89))
        {
          clr = "#2774AE";
        }
        else
        {
          clr = "#003B5C";
        }
      }

      result.id = "c" + index;
      result.color = clr;
      result.radius = 9;
      result.value = +d.Chance_of_Admit;
      result.name = index;
      result.org = d.University_Rating;
      result.group = d.CGPA;
      result.CGPA = d.CGPA;
      result.gre = d.GRE_Score;
      result.x = Math.random() * 900;
      result.y = Math.random() * 800;
      return result;
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function(a, b)
    {
      return b.value - a.value;
    });

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
  var chart = function chart(selector, rawData)
  {
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
      .data(nodes, function(d)
      {
        return d.id;
      });


    texts = svg.selectAll(null)
      .data(rawData)
      .enter()
      .append('text')
      .text(d => d.Chance_of_Admit)
      .attr('color', 'black')
      .attr('font-size', 1);

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 50)
      .attr('fill', function(d)
      {
        if (d.value > 0.89)
        {
          return "#C3D7EE";
        }
        else
        {
          if ((0.7 < d.value) && (d.value <= 0.89))
          {
            return "#2774AE";
          }
          else
          {
            return "#003B5C";
          }
        }
      })
      .attr("id", function(d)
      {
        return d.id;
      })
      .attr('stroke', function(d)
      {
        return "black";
      })
      .attr('stroke-width', 2)
      .on("mouseover", function(d)
      {
        tooltip.transition() // http://bl.ocks.org/weiglemc/6185069
          .duration(200)
          .style("opacity", 1);
        tooltip.html(
            '<span class="name">GPA: </span><span class="value">' + d.CGPA +
            '</span><br/>' +
            '<span class="name">GRE Score: </span><span class="value">' + d.gre +
            '</span><br/>' +
            '<span class="name">Chance of Admission: </span><span class="value">' +
            Math.round(addCommas(d.value * 100)) + "%"
          )
          .style("left", (d3.event.pageX + 4) + "px")
          .style("top", (d3.event.pageY - 24) + "px");

        d3.select(this).style("fill", "#ffc107");
        d3.select(this).attr("r", d.radius * 1.5);

        svg.selectAll('.bubble')
          .data(nodes)
          .transition()
          .duration(1200)
          .style("opacity", function(b)
          {
            if (b.id != d.id)
            {
              d3.select("#" + b.id).style("fill", b.color).attr("r", b.radius);

            }
            if ((b.id != d.id) && (b.color != d.color))
            {
              return 0.1;
            }
            else
            {
              return 1;
            }
          });

      })
      .on("mouseout", function(d)
      {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);

        svg.selectAll('.bubble').data(nodes)
          .transition().duration(1000)

          .style("opacity", function(b)
          {
            d3.select("#" + b.id).style("fill", b.color).attr("r", b.radius);
            return 1;

          })
      })

      .on("click", function(d, i)
      {
        clearApplicantTable();
        pureData[parseInt(d.id.substring(1, d.id.length))].Serial_No = d.name;
        drawApplicantTable(pureData[parseInt(d.id.substring(1, d.id.length))]);

        d3.select(this).style("fill", "#ffc107");
        d3.select(this).attr("r", d.radius * 1.5);

        generate_chart(d);

        window.location = '#applicant-table'
      });

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function(d)
      {
        return d.radius;
      });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   */
  function ticked()
  {
    bubbles
      .attr('cx', function(d)
      {
        return d.x;
      })
      .attr('cy', function(d)
      {
        return d.y;
      });

    texts.attr('x', (data) =>
      {
        return data.x
      })
      .attr('y', (data) =>
      {
        return data.y
      });
  }

  function groupBubbles()
  {
    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

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
    console.log(error);
  }

  pureData = data;
  convertToNumericData(pureData);
  myBubbleChart('#vis', data);
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
  while (rgx.test(x1))
  {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
d3.csv('../data/graduate-admissions/admission_cleaned.csv', display);
