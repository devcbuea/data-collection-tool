'use strict';

// Load the module dependencies
const config = require('../config'),
  path = require('path'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  socketio = require('socket.io'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  jwt = require('jsonwebtoken');

// Define the Socket.io configuration method
module.exports = function (app, db) {
  var server;
  if (config.secure === true) {
    // Load SSL key and certificate
    var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
    var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');
    var options = {
      key: privateKey,
      cert: certificate
    };

    // Create new HTTPS Server
    server = https.createServer(options, app);
  } else {
    // Create a new HTTP server
    server = http.createServer(app);
  }
  // Create a new Socket.io server
  var io = socketio.listen(server);

  // Create a MongoDB storage object
  var mongoStore = new MongoStore({
    mongooseConnection: db.connection,
    collection: config.sessionCollection
  });

  // Intercept Socket.io's handshake request
  io.use(function (socket, next) {
    let token = socket.handshake.query.token;
    if (token) {
        try {
          var user = jwt.verify(token, "ilovetechthanyoudo");
          socket.uid = user.id;
          next();
        } catch (e) {
           next(new Error('authentication error'));
        }
    }else return next(new Error('authentication error'));

  });

  // Add an event listener to the 'connection' event
  io.on('connection', function (socket) {
    config.files.server.sockets.forEach(function (socketConfiguration) {
      require(path.resolve(socketConfiguration))(io, socket);
    });
  });

  return server;
};
