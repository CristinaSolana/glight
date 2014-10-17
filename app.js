var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var cons = require('consolidate');
var bodyParser = require('body-parser');
var Cylon = require('cylon');

var port = process.env.PORT || 5000;

// tpl engine
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

app.use(bodyParser());

app.get('/', function(req, res) {
    res.render('tweets', {title: 'Stream'});
});


Cylon.robot({

    connections: [
        { name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6438' },
        { name: 'sphero', adaptor: 'sphero', port: '/dev/tty.Sphero-GRG-AMP-SPP' }
    ],

    devices: [
        { name: 'leapmotion', driver: 'leapmotion', connection: 'leapmotion' },
        { name: 'sphero', driver: 'sphero', connection: 'sphero' }
    ],

    work: function(my) {
        // my.leapmotion.on('hand', function(hand) {
        //     var r = hand.palmY.fromScale(100, 600).toScale(0, 255)
        //
        //     // console.log(hand.palmY);
        //
        //     // my.sphero.setRGB(r, 0, 0);
        //     my.sphero.setRandomColor();
        // });

        my.leapmotion.on('gesture', function(gesture) {

            if (gesture.type === "keyTap") {
                console.log(gesture.type);
                my.sphero.setColor('deeppink');
                my.sphero.roll(90, 90);

                // setTimeout(function() {
                    // my.sphero.stop();
                // }, 5000);
                my.sphero.stop();
            }

            if (gesture.type === "circle") {
                console.log(gesture.type);
                my.sphero.setColor('yellowgreen');
                my.sphero.roll(90, Math.floor(Math.random() * 360));
                my.sphero.stop();
            }
        });
    }

}).start();


app.use(express.static(__dirname + '/assets'));
http.listen(port, function() {
  console.log("Listening on " + port);
});
