var fs = require('fs');

var games = eval(fs.readFileSync('json/games.json')+'');
var teams = eval(fs.readFileSync('json/teams.json')+ '');



//var dd = today.getDate();
//var mm = today.getMonth()+1; //January is 0!

//var yy = (today.getFullYear()).toString();
//yy = yy.slice(2);
//today = mm+'/'+dd+'/'+yy;
var names = [];
var mascots = [];
var counts = [];
var colors = [];
var confs = [];
var params_total = [];
var ids = [];

var today = new Date();
var thisWeek = findWeek(today);

var cronJob = require('cron').CronJob;


	function findWeek( d ) { 
	  var target  = new Date(d.valueOf());  
	  var dayNr   = (d.getDay() + 6) % 7;  
	  target.setDate(target.getDate() - dayNr + 3);  
	  var jan4    = new Date(target.getFullYear(), 0, 4);  
	  var dayDiff = (target - jan4) / 86400000;      
	  var weekNum = 1 + Math.ceil(dayDiff / 7);    
	  return weekNum;    
	}
	function makeDate( g ){
		var dateArr = g.split('/');
		var arrange = "20"+dateArr[2]+"/"+dateArr[0]+"/"+dateArr[1];
		var gameDate = new Date(arrange);
		return gameDate;
	}



	//games this week  - array of JSON objects of game data
	var gtw = [];

	//teams this week - list of teams JSON objects to pull params from this week
	var ttw = [];

	for (var i=0;i<games.length;i++){
		var convert = makeDate(games[i].date);
		var gameWeek = findWeek(convert);
		if (gameWeek == thisWeek){
			gtw.push(games[i]);
			ttw.push(games[i].team1);
			ttw.push(games[i].team2);
		}
	}

	   	
	for (var i=0;i<ttw.length;i++){
		var thisTeam = ttw[i];
		for (var j=0;j<teams.length;j++){
			if (thisTeam == teams[j].school) {
				names.push(thisTeam);
				params_total.push(teams[j].search);
				counts.push(0);
				colors.push(teams[j].color);
				confs.push(teams[j].conference);
				mascots.push(teams[j].mascot);
				ids.push(j);
			}
		}
	}


	exports.teams = [ids,names,params_total,counts,colors,confs,mascots];
	exports.games = gtw;
	exports.today = today;





