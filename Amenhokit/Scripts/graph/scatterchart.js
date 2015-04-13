var rawdata = [["25/02/2015 00:00:00", 8], ["02/04/2015 00:00:00", 4], ["05/03/2015 00:00:00", 17], ["05/03/2015 00:00:00", 3]];


var data = [];
// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%x").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.close); });

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

rawdata.forEach(function(d) {
    var newDate = {};

    var day = d[0].substring(0, 2);
    var month = d[0].substring(3, 5);
    var year = d[0].substring(6, 10);
    
    var newdateString = month + "/" + day + "/" + year;

    newDate.date = parseDate(newdateString);
    newDate.close = d[1];

    data.push(newDate);
});

var minDate = parseDate(rawdata[0][0]);
var maxDate = parseDate(rawdata[rawdata.length - 1][0]);


    // Scale the range of the data
    x.domain(d3.extent(data, function (d) { return d.date; }));
    y.domain([0, d3.max(data, function (d) { return d.close; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function (d) { return x(d.date); })
        .attr("cy", function (d) { return y(d.close); });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


