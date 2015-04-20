
var Graph = function () {
    //Initial graph setup

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

    this.svg = d3.select(".content")
           .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
           .append("g")
               .attr("transform",
                     "translate(" + margin.left + "," + margin.top + ")");

    this.addTitle = function (title) {
        this.svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);


    }




    this.data = [];

    this.processData = function (rawData) {

        var series = {
            Name: 'A',
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


    var c10 = function(d) {
        switch(d) {
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
                return "metal";
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
                default:
                    return "black";


        }
    
        
    };
    

    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.totalScore); });





  

    this.plot = function () {        

        // Scale the range of the data        
        var xmin = d3.min(this.data, function (d) {
            return d3.min(d.Data, function(s) {
                return s.date;
            });
        });

        var xmax = d3.max(this.data, function (d) {
            return d3.max(d.Data, function (s) {

                return s.date;

            });
        });                    
        x.domain([xmin,xmax]);

        
        y.domain([0, d3.max(this.data, function (d) {

            return d3.max(d.Data, function(s) {
                return s.totalScore;

            });            
        })]);


        var series = this.svg.selectAll("g")
            .data(d3.map(this.data).entries())
            .enter()
            .append("g")
            .attr("id", function(d) {

                return "series-" + d.key;
        });        

        series.selectAll("circle")
            .data(function (d) {                
                return d.value.Data;
            })
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.date); })
            .attr("r", "5")
            .attr("fill", function (d) {

                

                if (d.player.ID == 1) {
                    var whatwhat = c10(d.player.ID);
                } else {
                    var blarg = c10(d.player.ID);
                }
                return c10(d.player.ID);
            })
            .attr("cy", function(d) { return y(d.totalScore); });


        // Add the X Axis
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(this.xAxis);

        // Add the Y Axis
        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);

        $('svg circle').tipsy({
            gravity: 'w',
            html: true,
            title: function() {
                var d = this.__data__;
                return '<span>Player:' + d.player.Name + ' (' + d.player.ID + ')</span><br>' +
                    '<span>Date: ' + d.dateString + '</span><br>' +
                    '<br><span>Score:' + d.totalScore + '</span><br>' +
                    '<span>Game ID:' + d.gameID + '</span>';
            }

        });
    }
}

var ubergraph;


$(function () {

    $('#plotstuff').click(function () {

        var xx = 42;
        ubergraph.plot();
    });


    $.ajax({
        url: "/Graph/GetPlayers/",
        success: function(data) {
            var deserialisedData = JSON.parse(data);

            var xx = 42;


            ubergraph = new Graph();


            deserialisedData.forEach(function(d) {
                $.ajax({
                    url: "/Graph/PlayerScoreData/" + d.ID,
                    success: function (data) {


                        var deserialisedData = JSON.parse(data);                        

                        var graph2 = new Graph();

                        ubergraph.processData(deserialisedData);
                        
                        ubergraph.addTitle(deserialisedData[0].Player.Name);


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