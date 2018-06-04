'use strict';
const uuid = require('uuid/v4');

class Client{
    constructor(socket){
        this.id = uuid();
        this.nickName = this.id;
        this.socket = socket;

    }
}

module.exports = Client;