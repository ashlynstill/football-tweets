
$(function() {
	$('#tooltip').hide();
    var socket = io.connect(window.location.hostname);
    socket.on('data', function(inputdata) {
    	$('#content').empty().append('<div class="row"><div class="col-sm-12">For a more interactive experience, please upgrade your browser.</div></div>');
    	var gamedata, places, allteams;
        var team1 = [];
        var team2 = [];
        var team1_sec = [];
        var team2_sec = [];
        var team1_acc = [];
        var team2_acc = [];
        var axis_vals_all = [];
        var axis_vals_acc = [];
        var axis_vals_sec = [];
        var tweetcount = [];
        gamedata = inputdata[0];
        places = inputdata[1];
        for (var v=0;v<gamedata.length;v++){
            if (gamedata[v].team1_count != undefined && gamedata[v].team2_count != undefined){
            	tweetcount.push(gamedata[v].team1_count);
            	tweetcount.push(gamedata[v].team2_count);
            	$('#content').append('<div class="row IEgames" id="game'+v+'"></div>');
            	$('#game'+v).empty().append('<div class="col-sm-12"><div class="team" id="'+v+'_1"></div><div class="slide" id="'+v+'count_1"></div><div class="slide" id="'+v+'count_2"></div><div class="team" id="'+v+'_2"></div></div>');
            	$('#'+v+'_1').append('<p><strong>' + gamedata[v].team1 + ' ' + gamedata[v].team1_mascot + ': </strong>' + gamedata[v].team1_count + '</p>');
            	$('#'+v+'_2').append('<p><strong>'+gamedata[v].team2+' '+gamedata[v].team2_mascot+':</strong> '+gamedata[v].team2_count+'</p>');

            }
        }
        var largest = Math.max.apply(Math, tweetcount);
        for (var i=0;i<gamedata.length;i++){
        	var countPerc1 = (gamedata[i].team1_count/largest)*100;
        	var countPerc2 = (gamedata[i].team2_count/largest)*100;
        	$('#'+i+'count_1').css({'border-bottom':'6px solid '+gamedata[i].team1_colors}).width(countPerc1+'%');
            $('#'+i+'count_2').css({'border-top':'6px solid '+gamedata[i].team2_colors}).width(countPerc2+'%');
        }
    });
});