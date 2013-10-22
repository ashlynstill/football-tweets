Counting sports tweets using Node.js
==============================================

A node.js application using node.js, Twitter's streaming API, socket.io and D3.js to count tweets containing team and game-specific keywords and visualizing which college football games in the Southeast are being talked about the most online.

Built for The Atlanta Journal-Constitution. See the live version [here](http://www.ajc.com/news/sports/college-football-tweets/)

It's currently set up so it tracks any college sports team's information, but I'm working on a template to track whatever twitter searches you want and visualize the results.

File Structure
---------------------------
*inputs/team_input.html && inputs/game_input.html

	Each of these input pages provides a simple front-end UI for inputting team data and game data. On the team_input page, you can add each team you want to track and its hex color, its mascot, its conference and its search terms (formatting for search terms is explained on input page).
	For game inputs, you input each team from the team input's schedule for the season and the information about each game (including the game's lat long location. Each input page will print out JSON for you to copy and save as a file for data (it will replace the JSON files in the json folder).
	
	NOTE: Every team that plays in a game on the game input list will need to have an entry in the team_input json including its search data.

*teamdata.js

	Takes the two JSON data files and parses them with the current date/week so the app knows which games are happening this week. Outputs variables holding json data objects for every game being played this week (including team1, team2, team1_color, team2_color, team1_mascot, team2_mascot, team1_search, team2_search, team1_count, team2_count, etc)

*app.js

	Takes teamdata.js module outputs and performs twitter search with included search terms. Outputs json data in a websocket to views/index.html

*public/javascripts/script.js

	Creates D3 viz with data inputs. Can easily be overhauled with different javascript to visualize whatever data you input (change in conference, different charts, no map, more maps, etc)

*views/index.html

	Front-end accepting the front-end scripts from above.


I deployed my version to heroku – the heroku link is live [here](http://floating-harbor-2012.herokuapp.com/)


Questions? Broke something? Hate it? Tell me! ashlyn [dot] still [at] gmail [dot] com