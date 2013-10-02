
$(function() {

    $('body').append('<div id="last_post"></div>')
    var socket = io.connect(window.location.hostname);
    var date;
    socket.on('data', function(data) {
     //   console.log(total);
        date = new Date();
        $('#last_post').empty().append(date);
        $('#school_list').empty();

        for (var v=0;v<data.length;v++){
            $('#school_list').append('<li>'+data[v].team1 + ': '+data[v].team1_count + '.......' + data[v].team2 + ': ' + data[v].team2_count + '</li>');
        }
    });   
})