const EventEmitter = require('events');
const net = require('net');

const uuid = require('uuid/v4');

require('dotenv').config();

const PORT = process.env.PORT || 3001
const server = net.createServer();
const eventEmitter = new EventEmitter();
const socketPool = {};

let User = function(socket) {
    let id = uuid();
    this.id = id;
    this.userName = `User-${id}`;
    this.socket = socket;
};

server.on('connection', (socket) => {
    console.log('connected');

    let user = new User(socket);
    socketPool[user.id] = user;
    // socket.on('data', (buffer) => dispatchAction(user.id, buffer));
    console.log('new user', user.id);
});

let parse = (buffer) => {

    let text = buffer.toString().trim();
    if( !text.startsWith('@') ) {return null}
    let [command, payload] = text.split(/\s+(.*)/);
    let [target, message] = payload ? payload.split(/\s+(.*)/) : [];
    return {command, payload, target, message};
}

let dispatchAction = (userId, buffer) => {

    let entry = parse(buffer);
    entry && eventEmitter.emit(entry.command, entry, userId);
};

eventEmitter.on('@all', (data, userId) => {
    socketPool[userId].nickname = data.target;
});

eventEmitter.on('@nick', (data, userId) => {
    socketPool[userId].nickname = data.target;
});

eventEmitter.on('@dm', (data, userId) => {
    // data.target
    // data.message
    // find socketPool[target].socket.write(message);
});

let 
server.listen(PORT, () => {
    console.log(`server up on ${PORT}`)
});


