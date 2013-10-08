
$(function() {
  //  $('body').append('<div id="last_post"></div>');
$('#tooltip').hide();
    var socket = io.connect(window.location.hostname);
    var date;
    
    socket.on('data', function(inputdata) {
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
        gamedata = inputdata[0];
        places = inputdata[1];
       // allteams = inputdata[2];
        for (var v=0;v<gamedata.length;v++){
            if (gamedata[v].team1_count != undefined && gamedata[v].team2_count != undefined){
                team1.push({ "x":v , "y":gamedata[v].team1_count, "team":gamedata[v].team1, "color":gamedata[v].team1_colors, "mascot":gamedata[v].team1_mascot, "conf":gamedata[v].team1_conf });    
                team2.push({ "x":v , "y":gamedata[v].team2_count, "team":gamedata[v].team2, "color":gamedata[v].team2_colors, "mascot":gamedata[v].team2_mascot, "conf":gamedata[v].team2_conf });      
                axis_vals_all.push(gamedata[v].team1 + ' vs. ' + gamedata[v].team2 ); 
            }
        }

        for (var i=0;i<team1.length;i++){
            if (team1[i].conf == 'ACC' || team2[i].conf == 'ACC'){
                team1_acc.push(team1[i]);
                team2_acc.push(team2[i]);
                axis_vals_acc.push(team1[i].team + ' vs. ' + team2[i].team);
            }
            if (team1[i].conf == 'SEC' || team2[i].conf == 'SEC'){
                team1_sec.push(team1[i]);
                team2_sec.push(team2[i]);
                axis_vals_sec.push(team1[i].team + ' vs. ' + team2[i].team);
            }
        }
    

        makeChart(team1,team2,'all-chart',axis_vals_all,'All games this week');

        $('#map-sorter').empty().append('<h4 style="float:left;display:inline;">Filter by game:</h4>');
        $('#map-sorter').append('<select id="filtermap"><option id="option_all">All games</option></select>');
        for (var i=0;i<axis_vals_all.length;i++){
            $('#filtermap').append('<option id="option'+i+'">'+axis_vals_all[i]+'</option>');
        }

        $('#filtermap').change(function(event){
            var thisone = $(this).val();
            var chart = 'map-chart';
            if (thisone == 'All games'){
                makeMap(places,chart,'Game tweets by location');
            }
            else {
                thisone = thisone.split(' vs. ');
                var selected_places = [];
                for(var i=0;i<places.length;i++){
                    if (places[i].team == thisone[0] || places[i].team == thisone[1]){
                        selected_places.push(places[i]);
                    }
                }
                makeMap(selected_places,chart,'Game tweets by location');
            }
        });


        $('li').each(function(){
            $(this).click(function(event){
                var id=$(this).attr('id');
                var chart;
                $('#map-holder').hide();
                $('#conf-chart').hide();
                $('#all-chart').hide();
                $('#'+id+'-chart').show();
                $('#'+id+'-chart div').show();
                $(this).css({'border-bottom':'1px solid #fff'});
                $("li").not(this).css({'border-bottom':'1px solid #aaa'});
                if(id == 'all'){
                    chart = id+'-chart';
                    makeChart(team1,team2,chart,axis_vals_all,'All games this week');
                } if(id == 'conf'){
                    var chart1 = 'acc-chart', chart2 = 'sec-chart';
                    makeChart(team1_sec,team2_sec,chart2,axis_vals_sec,'SEC games');
                    makeChart(team1_acc,team2_acc,chart1,axis_vals_acc,'ACC games');
                } if(id == 'map'){
                    $('#map-holder').show();
                    $('#map-holder row').show();
                    $('#map-sorter').show();
                    var chart = id+'-chart';
                    var title
                    makeMap(places,chart,'Game tweets by location');
                }
            })
        })
    

        function makeChart(team1,team2,chart,axis_vals,title){
            $('#'+chart).empty();
            $('#'+chart).append('<h1 class="title">'+title+'</h1>');
            var w = $('#'+chart).width();
            var h = 700;
            var margin = {top: 40, right: 10, bottom: 20, left: 10},
                width = w - margin.left - margin.right,
                height = h - margin.top - margin.bottom - 100,
                svg_width = w,
                svg_height = h;
            
            //Create SVG element
            var svg = d3.select('#'+chart)
                        .append("svg")
                        .attr("width", svg_width)
                        .attr("height", svg_height);

            var dataset = [team1,team2];
            var stack = d3.layout.stack();
                dataset = stack(dataset);
            //console.log(countData);

         //   var ymax = d3.max(team1_count)+d3.max(team2_count);
            
            var x = d3.scale.ordinal()
                .domain(d3.range(axis_vals.length))
                .rangeRoundBands([100, width],0.05);

            var y = d3.scale.linear()
                .domain([0,             
                    d3.max(dataset, function(d) {
                        return d3.max(d, function(d) {
                            return d.y0 + d.y;
                        });
                    })
                ])
                .range([height,0]);

            var xScale = d3.scale.ordinal()
                .domain(axis_vals)
                .rangeBands([100, width],0.05);

            var yScale = d3.scale.linear()
                .domain([0,             
                    d3.max(dataset, function(d) {
                        return d3.max(d, function(d) {
                            return d.y0 + d.y;
                        });
                    })
                ])
                .range([0, height]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                //.tickValues(xScale(axis_vals))
                .tickSize(5)
                .tickPadding(6)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickSize(2)
                .orient("left");
           

            var colors = d3.scale.ordinal()
                .range([[dataset[0].color],[dataset[1].color]]);
            

            // Add a group for each row of data
            var groups = svg.selectAll("g")
                .data(dataset)
                .enter()
                .append("g");

            // Add a rect for each data value

            var rects = groups.selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr("id", function(d, i) {
                    return d.x;
                })
                .attr("x", function(d, i) {
                    return x(i);
                })
                .attr("y", function(d) {
                   // console.log(height - yScale(d.y0) - yScale(d.y));
                   // console.log(d);
                    return height - yScale(d.y0) - yScale(d.y);
                })
                .attr("height", function(d) {
                    return yScale(d.y);
                })
                .style("fill", function(d) {
                    return d.color;
                })
                .style("stroke", '#ccc')
                .attr("width", xScale.rangeBand())
                .on("mouseover", function(d,i) {
                    $('#tooltip').fadeIn();
                    //Get this bar's x/y values, then augment for the tooltip
                    var xPosition = event.pageX-40;
                    var yPosition = event.pageY+20;
                    //Update Tooltip Position & value
                    d3.select("#tooltip")
                        .style("left", xPosition+'px')
                        .style("top", yPosition+'px')
                        .html('<b>'+d.team+' '+d.mascot+'</b><br/>Number of tweets: '+d.y);
                })
                .on("mouseout", function() {
                    //Remove the tooltip
                    $('#tooltip').hide();
                });
                    
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
              .selectAll("text")
                .attr("y", 10)
                .attr("x", 0)
                .attr("dy", ".35em")
                .attr("transform", "rotate(-40)")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("class", "y axis")
              //  .attr("transform", function(d) { return "translate(0," + -yScale(d) + ")"; })
                .call(yAxis)
              .selectAll("text")
                .attr("y", 10)
                .attr("x", 100)
                .attr("dy", ".35em")
                .style("text-anchor", "end");  
        };



        function makeMap(places,chart,title,teams){

            $('#map-holder h1').append(title);
            var w = $('#map-chart').width();
            var h = 600;
            var margin = {top: 40, right: 10, bottom: 20, left: 10},
                width = w - margin.left - margin.right - 100,
                height = h - margin.top - margin.bottom - 100,
                svg_width = w,
                svg_height = h;
            
            //Create SVG element

            var projection = d3.geo.albersUsa()
                .scale(w+100)
                .translate([w / 2, h / 2]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select('#'+chart)
                        .append("svg")
                        .attr("width", svg_width)
                        .attr("height", svg_height);

            svg.append("rect")
                .attr("class", "background")
                .attr("width", svg_width)
                .attr("height", svg_height);
               // .on("click", clicked);

            var g = svg.append("g");

            d3.json("us.json", function(error, us) {
              g.append("g")
                  .attr("id", "states")
                .selectAll("path")
                  .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                  .attr("d", path);

              g.append("path")
                  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                  .attr("id", "state-borders")
                  .attr("d", path);

                for (var i=0;i<places.length;i++){
                    var coords = projection(places[i].coords);
                    console.log(coords);
                    if(coords != null){
                        g.append('circle')
                        .attr('cx', coords[0])
                        .attr('cy', coords[1])
                        .attr('r', 3)
                        .attr('id', i)
                        .style('fill',  places[i].color)
                        .on("mouseover", function() {
                            $('#tooltip').fadeIn();
                            //Get this bar's x/y values, then augment for the tooltip
                            var xPosition = event.pageX-40;
                            var yPosition = event.pageY+20;
                            var dotID = event.target.id;
                            //Update Tooltip Position & value
                            d3.select("#tooltip")
                                .style("left", xPosition+'px')
                                .style("top", yPosition+'px')
                                .html('<b>'+places[dotID].team+'</b><br/>'+places[dotID].place);
                        })
                        .on("mouseout", function() {
                            //Remove the tooltip
                            $('#tooltip').hide();
                        });
                    }

                }

            });


        };

     });
});


