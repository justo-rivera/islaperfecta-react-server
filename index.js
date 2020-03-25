
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  username: String,
  uid: String,
  color: String,
  message: String,
  timestamp: Date,
  favs: {
    count: Number,
    faved_by: [String]
    }
  },
  { collection: 'chatrecicla-react'})

var Message = mongoose.model('Message', messageSchema);

mongoose.connect("mongodb+srv://justo:fn231093@cluster0-syxf1.mongodb.net/test?retryWrites=true&w=majority", { autoIndex: false, useNewUrlParser: true, dbName: 'chatrecicla'});



var express = require('express');
var socket = require('socket.io');

var app = express();


server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data){
        const msg = new Message(data);
        msg.save(function(err, msg){
          if (err) return console.error(err)
        });
        io.emit('RECEIVE_MESSAGE', data);
    })
});
