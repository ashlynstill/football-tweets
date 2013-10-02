var TweetPipe = require('tweet-pipe');

var fs = require('fs');

// file is included here:
eval(fs.readFileSync('parse.js')+'');

var oauth = {
  consumer_key: 'ecgxcsb8gRbWzQ7Ng6b73w',
  consumer_secret: 'xz9az85FyPcj0baltxmf0cAJFgSgH6f0EnpBvPoc',
  token: '170942226-qy5oMEKos5OfADIO5dmkxMmfdZ5OKO6bzimluj81',
  token_secret: '1F1Fo71VDi3ii9FJ1ua38ijoaYwOoZa6Be0KbV7bs'
};

var tp = new TweetPipe(oauth);

var params = { 'track': params_total };
var lowtweet = "";


tp.stream('statuses/filter', params, false, function (stream) {
  stream.on('tweet', function (tweet) {
    lowtweet = tweet.text.toString();
    lowtweet = lowtweet.toLowerCase();
    var fix_tweet = lowtweet.replace(lowtweet[lowtweet.search('"')],' ');
    fix_tweet = fix_tweet.replace('\n',' ');

    for (var i=0;i<params_total.length;i++){
      var this_param = params_total[i];
      for (var j=0;j<this_param.length;j++){
        if (lowtweet.search(this_param[j]) >= 0){
          counts[i]++;
        };
      };
    };  

//       stream.emit('data',tweet.text);
    // choose what gets piped to next stream (if anything)
    // in this case, pipe out tweet text
    

  });
  stream.on('error', function (error) {
    console.log('Uh oh: ' + error);
  });
var count_total=[];
 stream.on('end', function () {
    console.log('var data = [ \n');
    for (var i=0;i<names.length;i++){
      console.log('{ "id": "team'+i+'", "count":"'+counts[i]+'", "team":"'+ names[i] +  '", "conf":"'+confs[i]+'", "color":"'+colors[i]+'", "mascot":"'+mascots[i]+'" },\n');
    };
    console.log(' ] \n ');
  });


  function () { stream.end(); }, 120*60*1000);
  // stop the stream after 60 seconds
}).pipe(process.stdout);
