'use strict';


const EventEmitter = require('events').EventEmitter;

module.exports = clientPool => {
    const chatEmitter = new EventEmitter();
    chatEmitter.on('@dm', (data, userId) => {
        let [target, message] = data ? data.split(/\s+(.*)/) : [];
        let user = clientPool[target];
        if(user){
            user.socket.write(`${userId} sent: ${data}\n`);
        } else {
            clientPool[userId].socket.write('no such user with that id exists\n');
        }
    });

    chatEmitter.on('@list', (data, userId) => {
        let users = Object.keys(clientPool).map(key => clientPool[key].nickName);
        clientPool[userId].socket.write(users.join('\n') + '\n');
    });

    chatEmitter.on('@all', (data, userId) => {
        for(let key of Object.keys(clientPool)){
            clientPool[key].socket.write(`${userId} sent message: ${data}\n`);
        }

    });

    chatEmitter.on('@quit', (data, userId) => {
        const userSocket = clientPool[userId].socket;
        userSocket.end();
        delete clientPool[userId];
        Object.keys(clientPool).forEach(key => {
            clientPool[key].socket.write(userId + ' has disconnected\n');
        });

    });

    chatEmitter.on('@nickname', (data, userId) => {
        const user = clientPool[userId];
        user.nickName = data;
        user.socket.write('changed nickname to: ' + data + '\n');
    });
    return chatEmitter;
};