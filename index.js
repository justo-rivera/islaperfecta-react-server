
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
  {
    collection: 'chatrecicla-react',
    timestamps: true   //<-- esta es una forma más estandarizada de guardar marcas de tiempo
  }
)

var Message = mongoose.model('Message', messageSchema);

mongoose.connect("mongodb+srv://justo:fn231093@cluster0-syxf1.mongodb.net/test?retryWrites=true&w=majority", { autoIndex: false, useNewUrlParser: true, dbName: 'chatrecicla'});

var express = require('express');
var socket = require('socket.io');

var app = express();
const PORT = process.env.PORT || 8080;
server = app.listen(PORT, function(){
    console.log('server is running on port ' + PORT);
});

io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id);
    // Encontrar mensages de la historia y emit ellos al app
    Message.find()
    .sort({timestamp: 'ASC'})
    .then(messages => {
        io.emit('RECEIVE_MESSAGE', messages, 'history');
    }).catch(err => {
        console.log(err);
    });
    // Escuchar para nuevos mensajes
    socket.on('SEND_MESSAGE', function(data){
        const msg = new Message(data);
        msg.save(function(err, msg){
          if (err) return console.error(err)
        });
        io.emit('RECEIVE_MESSAGE', data, 'message');
    })
});
