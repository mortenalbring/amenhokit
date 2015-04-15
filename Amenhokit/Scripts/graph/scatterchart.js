﻿
var Graph = function () {

    var data = [];

    this.processData = function(rawData) {
        rawData.forEach(function (d) {
            var newDate = {};

            var day = d.DateString.substring(0, 2);
            var month = d.DateString.substring(3, 5);
            var year = d.DateString.substring(6, 10);
            
            var time = d.DateString.substring(11, 19);

            var newdateString = month + "/" + day + "/" + year + ' ' + time;

            newDate.dateString = year + '/' + month + '/' + day + ' ' + time;
            newDate.date = parseDate(newdateString);
            newDate.totalScore = d.TotalScore;
            newDate.gameID = d.GameID;
            newDate.player = d.Player;

            data.push(newDate);
        });
    }

    
    // Set the dimensions of the canvas / graph
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%x %X").parse;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    this.xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    this.yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.totalScore); });


    this.addTitle = function(title) {
        this.svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);


    }

    this.svg = d3.select("body")
           .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
           .append("g")
               .attr("transform",
                     "translate(" + margin.left + "," + margin.top + ")");

    this.plot = function() {      
        // Scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.totalScore; })]);


        /*
         * 
         
        // Add the valueline path.
        this.svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

            */

        // Add the scatterplot
        this.svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5.5)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.totalScore); });

        this.svg.selectAll("circle")
            .data(data)
            .append("svg:title")
            .text(function (d) { return d.totalScore; });

        $('svg circle').tipsy({
            gravity: 'w',
            html: true,
            title: function() {
                var d = this.__data__;
                return '<span>Date: ' + d.dateString + '</span>' +
                    '<br><span>Score:' + d.totalScore + '</span><br>' +
                    '<span>Game ID:' + d.gameID + '</span>';
            }

        })



        // Add the X Axis
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(this.xAxis);

        // Add the Y Axis
        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);

    }
}
$(function() {

    $.ajax({
        url: "/Graph/GetPlayers/",
        success: function(data) {
            var deserialisedData = JSON.parse(data);

            var xx = 42;

            deserialisedData.forEach(function(d) {
                $.ajax({
                    url: "/Graph/PlayerScoreData/" + d.ID,
                    success: function (data) {


                        var deserialisedData = JSON.parse(data);

                        var xx = 42;

                        var graph2 = new Graph();
                        graph2.processData(deserialisedData);
                        graph2.plot();

                        graph2.addTitle(deserialisedData[0].Player.Name);


                    },
                    error: function (what) {
                        var xxx = 42;
                    }
                });

            })

        


        }

    });

 

});