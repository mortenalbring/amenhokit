$(function () {
    var ubergraph;

    $('#plotstuff').click(function () {        
        ubergraph.plot();
    });


    $.ajax({
        url: "/Graph/GetPlayers/",
        success: function (data) {
            var players = JSON.parse(data);            


            ubergraph = new Graph();
            ubergraph.addTitle("All Players");

            var numberOfPlayers = players.length;
            var playerCount = 0;

            players.forEach(function(p) {
                $.ajax({
                    url: "/Graph/PlayerScoreData/" + p.ID,
                    success: function (scoreData) {
                        

                        var scoreDataSerialised = JSON.parse(scoreData);
                        var individualGraph = new Graph();
                        ubergraph.processData(scoreDataSerialised, scoreDataSerialised[0].Player);
                        individualGraph.processData(scoreDataSerialised, scoreDataSerialised[0].Player);
                        individualGraph.plot();
                        individualGraph.addTitle(scoreDataSerialised[0].Player.Name);

                        playerCount++;                        
                        if (playerCount == numberOfPlayers) {
                            //If we've processed all the players, we can plot the data
                            //I don't have a good way to 'update' data and replot just with new data yet
                            ubergraph.plot(3);
                        }
                    },
                    error: function(message) {
                        console.log(message);
                        alert("Something dun goofed");
                    }
                });

            });


        }

    });



});