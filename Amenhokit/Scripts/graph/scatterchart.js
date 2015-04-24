
var Graph = function (width, height) {
    /// <summary>
    /// Initialises a scatter graph with a timescale on the x axis
    /// </summary>
    /// <param name="width">Graph width</param>
    /// <param name="height">Graph height</param>    

    // Set the dimensions of the canvas / graph
    var margin = { top: 30, right: 150, bottom: 30, left: 50 };
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%x %X").parse;
    var decimalFormat = d3.format("0.3f");

    // Set the ranges for x and y
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);


    // Define the axes
    //For the 'All Players' graph, it makes sense to use on the x-axis
    //.ticks(d3.time.week,2)
    //But not for all of the individual graphs Using automatic tick generator for now. 

    this.xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    this.yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Draws the actual graph body
    this.svg = d3.select(".content")
           .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
        .attr("class", "graph")
           .append("g")
               .attr("transform",
                     "translate(" + margin.left + "," + margin.top + ")");

    this.addTitle = function (title) {
        /// <summary>
        /// Adds a title to the graph
        /// </summary>
        /// <param name="title">Title text</param>
        this.svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
    }


    var c10 = function (d) {
        /// <summary>
        /// Switch case for defining colors
        /// </summary>
        /// <param name="d">Player ID</param>
        switch (d) {
            case 1:
                return "red";
                break;
            case 2:
                return "GoldenRod";
                break;
            case 3:
                return "purple";
                break;
            case 4:
                return "grey";
                break;
            case 5:
                return "green";
                break;
            case 6:
                return "blue";
                break;
            case 7:
                return "DodgerBlue";
                break;
            case 8:
                return "Chocolate";
                break;
            case 9:
                return "DarkKhaki";
                break;
            default:
                return "black";
        }
    };


    this.data = [];
    this.processData = function (rawData, player) {

        var series = {
            Player: player,
            Data: []

        };

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

            series.Data.push(newDate);
        });
        this.data.push(series);


    }




    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.totalScore); });




    this.addLegend = function () {
        /// <summary>
        /// Adds a legend displaying colored squared and series name
        /// </summary>

        var legend = this.svg.append("g")

    .attr("height", 100)
    .attr("width", 100)
            .attr("class", "legend")
    .attr("transform", 'translate(-20,50');

        legend.selectAll('rect')
            .data(this.data)
            .enter()
            .append("rect")

            .attr("x", width + 30)
            .attr("y", function (d, i) { return i * 22; })
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function (d) {
                return c10(d.Player.ID);
            });

        legend.selectAll('text')
            .data(this.data)
            .enter()
            .append("text")
            .attr("x", width + 45)
            .attr("y", function (d, i) { return i * 22 + 9; })
            .text(function (d) {
                return d.Player.Name;
            });
    }


    this.getAverageData = function(data) {

        var lineData = [];

        $.each(data, function(index, series) {
            var sData = series.Data;
            var sPlayer = series.Player;

            var dataRowSeries = [];
            var gameIDs = [];

            //Get array of distinct game IDs
            $.each(sData, function(i, s) {
                if (jQuery.inArray(s.gameID, gameIDs) == -1) {                                    
                    gameIDs.push(s.gameID);
                }                             
            });

            
           
            $.each(gameIDs, function (i, g) {
                var total = 0;
                var count = 0;
                var date;

                var dataRow = {};

                $.each(sData, function(ii, s) {

                    if (g == s.gameID) {
                        total = total + s.totalScore;
                        count = count + 1;
                        date = s.date;
                    }
                });

                var average = total / count;

                dataRow.date = date;
                dataRow.average = average;
                dataRow.playerID = sPlayer.ID;

                dataRowSeries.push(dataRow);
            });



            var seriesTrend = {
                Player: series.Player,                
                DataRowSeries: [dataRowSeries]
            }

            lineData.push(seriesTrend);
        });

        return lineData;


    }

    this.drawAverageLine = function(graphsvg, data) {

        var lineData = this.getAverageData(data);

        var averageLines = graphsvg.selectAll(".averageLines")
            .data(d3.map(lineData).entries())
            .enter()
            .append("g")
            .attr("class", "averageLines")
            .attr("id", function(d) {
                return d.key;
            });

        var lineFunction = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function (d) { return y(d.average); })
        .interpolate("basis");

        averageLines.selectAll(".averageLine")
            .data(function (d) { return d.value.DataRowSeries; })
            .enter()
            .append("path")
            .attr("d", function (d) { return lineFunction(d); })
        .attr("stroke", function(d) {
                return c10(d[0].playerID);
            })
        .attr("stroke-width", 2)
        .attr("fill", "none");       
    }


    this.getTrendData = function (data) {
        /// <summary>
        /// This takes the raw data and calculates the parameters for the trend line for each series
        /// </summary>
        /// <param name="data">Series data</param>

        var trendData = [];
        $.each(data, function (index, series) {
            var sData = series.Data;

            var xSeries = d3.range(1, sData.length + 1);
            var ySeries = sData.map(function (d) {
                return d.totalScore;
            });


            var ls = leastSquares(xSeries, ySeries);

            var x1 = d3.min(sData, function (d) {
                return d.date;
            });
            var x2 = d3.max(sData, function (d) {
                return d.date;
            });
            var y1 = ls[0] + ls[1];
            var y2 = ls[0] * xSeries.length + ls[1];


            var seriesTrend =
            {
                Player: series.Player,
                TrendData: [[x1, y1, x2, y2, series.Player.ID]],
                rSquare: ls[2]
            }
            trendData.push(seriesTrend);

        });

        return trendData;
    }


    this.drawTrendline = function (graphsvg, data) {
        /// <summary>
        /// This draws a trendline on the current graph
        /// </summary>
        /// <param name="graphsvg">Graph on which to draw</param>
        /// <param name="data">Dataset from which to calculate trendline</param>
        var trendData = this.getTrendData(data);

        var trendlines = graphsvg.selectAll(".trendlines")
            .data(d3.map(trendData).entries())
            .enter()
            .append("g")
            .attr("class", "trendlines")
            .attr("id", function (d) {
                return d.key;
            })
        ;

        trendlines.append("text")
            .attr("class", "legend")
            .text(function (d) { return "r: " + decimalFormat(d.value.rSquare); })
            .attr("x", width + 95)
            .attr("y", function (d, i) { return i * 22 + 9; });



        trendlines.selectAll(".trendline")
            .data(function (d) { return d.value.TrendData; })
            .enter()
            .append("line")
            .attr("class", "trendline")
            .attr("x1", function (d) {
                return x(d[0]);
            })
            .attr("y1", function (d) {

                return y(d[1]);
            })
            .attr("x2", function (d) {

                return x(d[2]);
            })
            .attr("y2", function (d) {

                return y(d[3]);
            })
        .attr("stroke", function (d) {
            return c10(d[4]);
        })
        .attr("stroke-width", 1);

    }

    this.plot = function (circleSize) {
        /// <summary>
        /// Plots the graph, with specified circle size
        /// </summary>
        /// <param name="circleSize">Circle size</param>

        var thisData = this.data;
        var thisGraph = this.svg;

        if (circleSize == null) {
            circleSize = 4;
        }

        // Scale the range of the data        
        var xmin = d3.min(this.data, function (d) {
            return d3.min(d.Data, function (s) {
                return s.date;
            });
        });
        var xmax = d3.max(this.data, function (d) {
            return d3.max(d.Data, function (s) {

                return s.date;

            });
        });
        x.domain([xmin, xmax]).nice();
        y.domain([0, d3.max(this.data, function (d) {

            return d3.max(d.Data, function (s) {
                return s.totalScore;

            });
        })]).nice();



        var series = this.svg.selectAll("g")
            .data(d3.map(this.data).entries())
            .enter()
            .append("g")
            .attr("id", function (d) { return "series-" + d.key; });

        series.selectAll("circle")
            .data(function (d) {return d.value.Data; })
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.date);})
            .attr("r", circleSize)
            .attr("fill", function (d) { return c10(d.player.ID);})
            .attr("cy", function (d) { return y(d.totalScore); });


        /*
        var lines = this.svg.selectAll("path")
            .data(d3.map(this.data).entries())
            .enter()
          .append("path")
          .attr("class", "line")
          .attr("d", function (d) {
              return valueline(d.value.Data);
          })
            .attr("stroke", function (d) {                
                      return c10(d.value.Player.ID);
                  });
                  */


        // Add the X Axis
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(this.xAxis);

        // Add the Y Axis
        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);



        // Adds the hoverover text
        $('svg circle').tipsy({
            gravity: 'w',
            html: true,
            title: function () {
                var d = this.__data__;
                return '<span>Player:' + d.player.Name + ' (' + d.player.ID + ')</span><br>' +
                    '<span>Date: ' + d.dateString + '</span><br>' +
                    '<br><span>Score:' + d.totalScore + '</span><br>' +
                    '<span>Game ID:' + d.gameID + '</span>';
            }
        });

        this.addLegend();

        this.drawTrendline(thisGraph, thisData);

        this.drawAverageLine(thisGraph, thisData);
    }
}

function leastSquares(xSeries, ySeries) {
    /// <summary>
    /// Takes the x series and y series data and calculates the least squares coeffients of that data
    /// It outputs an array with slope, intercept and r-square of the line
    /// </summary>
    /// <param name="xSeries">X series</param>
    /// <param name="ySeries">Y series</param>
    var reduceSumFunc = function (prev, cur) { return prev + cur; };

    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function (d) { return Math.pow(d - xBar, 2); })
        .reduce(reduceSumFunc);

    var ssYY = ySeries.map(function (d) { return Math.pow(d - yBar, 2); })
        .reduce(reduceSumFunc);

    var ssXY = xSeries.map(function (d, i) { return (d - xBar) * (ySeries[i] - yBar); })
        .reduce(reduceSumFunc);

    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
}




