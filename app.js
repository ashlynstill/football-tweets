/**
 * Module dependencies.
 */
var express = require('express')
  , io = require('socket.io')
  , http = require('http')
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob
  , _ = require('underscore')
  , fs = require('fs')
  , path = require('path');

//Create an express app
var app = express();

//Create the HTTP server with the express app as an argument
var server = http.createServer(app);
var dataMod = require('./teamdata.js');

// All of the values we're bringing in from the json parse file about games/schools
var watchSymbols = dataMod.teams[2]; //search terms
var count = dataMod.teams[3];
var teams = dataMod.teams[1];
var colors = dataMod.teams[4];
var confs = dataMod.teams[5];
var mascots = dataMod.teams[6];
var ids = dataMod.teams[0];
var results = [ids,count,teams,colors,confs,mascots]; // team info array
var places = []; 
var gamesArr = dataMod.games;
var today = dataMod.today;
var output = [ gamesArr, places, today ];

//var gamesArr = [watchList,gtw]; //array we're piping out with the team info and games this week array


//Generic Express setup
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//We're using bower components so add it to the path to make things easier
app.use('/components', express.static(path.join(__dirname, 'components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Our only route! Render it with the array we're piping out
app.get('/', function(req, res) {
  res.render('results.html', { data: output });
  //res.json({data: output});
});

//Start a Socket.IO listen
var sockets = io.listen(server);

//Set the sockets.io configuration.
//THIS IS NECESSARY ONLY FOR HEROKU!
sockets.configure(function() {
  sockets.set('transports', ['xhr-polling']);
  sockets.set('polling duration', 10);
});




//oauth for twitter
var t = new twitter({
    consumer_key: 'ecgxcsb8gRbWzQ7Ng6b73w',           // <--- FILL ME IN
    consumer_secret: 'xz9az85FyPcj0baltxmf0cAJFgSgH6f0EnpBvPoc',        // <--- FILL ME IN
    access_token_key: '170942226-qy5oMEKos5OfADIO5dmkxMmfdZ5OKO6bzimluj81',       // <--- FILL ME IN
    access_token_secret: '1F1Fo71VDi3ii9FJ1ua38ijoaYwOoZa6Be0KbV7bs'     // <--- FILL ME IN
});

var lowtweet = "";
var tempArr = [];
// //Tell the twitter API to filter on the keywords (watchSymbols) 
t.stream('statuses/filter', { track: watchSymbols }, function(stream) {

  //We have a connection. Now watch the 'data' event for incomming tweets.
  stream.on('data', function(tweet) {
    if (tweet.text != null && tweet.text != undefined){
      lowtweet = tweet.text.toString();
      lowtweet = tweet.text.toLowerCase();
      var fix_tweet = lowtweet.replace(lowtweet[lowtweet.search('"')],' ');
      fix_tweet = fix_tweet.replace('\n',' ');
      for (var i=0;i<watchSymbols.length;i++){
        var this_param = watchSymbols[i];
        for (var j=0;j<this_param.length;j++){
          if (lowtweet.search(this_param[j]) >= 0){
            count[i]++;
            if (tweet.place !== null && tweet.place.country_code === 'US' && tweet.coordinates != null){
              places.push({"team":teams[i], "conf":confs[i], "color":colors[i], "coords":tweet.coordinates.coordinates, "place":tweet.place.full_name});
            }
          };
        };
      }; 
    }
    

      for (var i=0;i<gamesArr.length;i++){
            var team1 = gamesArr[i].team1;
            var team2 = gamesArr[i].team2;
            for (var j=0;j<results[0].length;j++){ 
              if (results[2][j] == team1){
                gamesArr[i].team1_colors = results[3][j];
                gamesArr[i].team1_mascot = results[5][j];
                gamesArr[i].team1_conf = results[4][j];
                gamesArr[i].team1_count = results[1][j];
              } if (results[2][j] == team2){
                gamesArr[i].team2_colors = results[3][j];
                gamesArr[i].team2_mascot = results[5][j];
                gamesArr[i].team2_conf = results[4][j];
                gamesArr[i].team2_count = results[1][j];
              }
            } 
        };
   // sockets.sockets.emit('data', output);
      //spit out data to socket.io
     //sockets.sockets.emit('data', gamesArr);
  });
});

//If the client just connected, give them fresh data!
sockets.sockets.on('connection', function(socket) { 
    socket.emit('data', output);
});

//Send out updated counts every 60 seconds
new cronJob('60 * * * * *', function(){
      //Send the update to the clients
      sockets.sockets.emit('data', output);
}, null, true);

//Create the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});