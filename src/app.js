//core application
'use strict';
const net = require('net');
const Client = require('./lib/client');

const clientPool = {};
const chatEmitter = require('./lib/chatEmitter')(clientPool);

const app = net.createServer();

app.on('connection', (socket) => {
    let user = new Client(socket);
    clientPool[user.id] = user;
    socket.on('data', (data) => {
        const text = data.toString().trim();
        if(text.startsWith('@')){
            let [command, payload] = text.split(/\s+(.*)/);
            chatEmitter.emit(command, payload, user.id);
        }
    });
    Object.keys(clientPool).forEach(key => {
        clientPool[key].socket.write('User: ' + user.id + ' has joined\n');
    });
});
app.on('error', (err) => {
    console.log('error starting up the server\n');
});

module.exports = app;

