'use strict'

require('dotenv').config();

const EventEmitter = require('events');
const net = require('net');

const uuid = require('uuid/v4');

const PORT = process.env.PORT || 3001
const server = net.createServer();
const eventEmitter = new EventEmitter();
const socketPool = {};

let User = function (socket) {
    let id = uuid();
    this.id = id;
    this.userName = `User-${id}`;
    this.socket = socket;
};

server.on('connection', (socket) => {
    console.log('connected');

    let user = new User(socket);
    socketPool[user.id] = user;
    socket.on('data', (buffer) => dispatchAction(user.id, buffer));
    console.log('new user', user.id, 'has connected');
});
let users = []
let parse = (buffer) => {

    let text = buffer.toString().trim();
    if (!text.startsWith('@')) {
        return null
    } else {
        let [command, payload] = text.split(/\s+(.*)/);
        let [target, message] = payload ? payload.split(/\s+(.*)/) : [];
        return {
            command,
            payload,
            target,
            message
        };
    };
};

let dispatchAction = (userId, buffer) => {

    let entry = parse(buffer);
    entry && eventEmitter.emit(entry.command, entry, userId);
};

eventEmitter.on('@all', (data, userId) => {
    console.log(data);

    for (let key in socketPool) {
        let user = socketPool[key];
        user.socket.write(`[${socketPool[userId].nickname}]: ${data.payload}\n`);
    }

});

eventEmitter.on('@nick', (data, userId) => {

    socketPool[userId].nickname = data.target;
    console.log(socketPool[userId].nickname = data.target);

    userId = data.target;
    console.log('new name is ' + userId);
    users.push(userId);
    console.log(users);

});

eventEmitter.on('@dm', (data, userId) => {
    
    console.log(userId.message)
    // data.target
    // data.message
    // find socketPool[target].socket.write(message);
    // consle.log();
});

eventEmitter.on('@list', (data, userId) => {
    console.log(users);

    // !!!still need to write this to the server!!!

    // for (let key in socketPool) {
    //     let user = socketPool[key];
    //     user.socket.write(`[${socketPool[users]}]: ${data.payload}\n`);
    // }

});

eventEmitter.on('@quit', (data, userId) => {

// not quite working yet but i have a direction

    server.close()
    users.forEach(function (user) {
        user.destroy();
    });
});


server.listen(PORT, () => {
    console.log(`server up on ${PORT}`)
});