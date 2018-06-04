![cf](https://i.imgur.com/7v5ASc8.png) Lab 06: TCP Chat Server
======

## Submission Instructions
* Work in a fork of this repository
* Work in a branch on your fork
* Create a PR to your master from your working branch.
* Ensure that your repository/branch is connected to travis-ci.com
* Travis should pick you up and deploy
* Submit on canvas:
  * a question and observation
  * how long you spent
  * link to your pull request
  * link to your build at travis-ci URL

## Configuration 
Configure the root of your repository with the following files and directories. Thoughfully name and organize any aditional configuration or module files.
* **README.md** - contains documentation
* **.env** - contains env variables (should be git ignored)
* **.gitignore** - contains a [robust](http://gitignore.io) `.gitignore` file 
* **.eslintrc** - contains the course linter configuratoin
* **.eslintignore** - contains the course linter ignore configuration
* **.travis.yml** - contains the course linter ignore configuration
* **package.json** - contains npm package config
  * create a `lint` script for running eslint (eslint **/*.js)
  * create a `test` script for running tests
  * create a `start` script for running your server
* **index.js** - the entry point for your application
* **src/** - contains your core application files and folders
* **src/app.js** - (or main.js) contains your core application bootstrap
* **src/lib/** - contains module definitions
* **\_\_test\_\_/** - contains unit tests

## Feature Tasks  
For this assignment, you will be building a TCP chatroom. Clients should be able to connect to the chatroom through the use of telnet. Clients should also be able to run special commands to exit the chatroom, list all users, reset their nickname, and send direct messages. You may add as many features to this application as you would like. Do not use any third party libraries and testing is *not* required.

##### Minimum Requirements 
* Create a TCP Server using the NodeJS `net` module
* Create a Client constructor that models an individual connection 
  * Each client instance should contain (at least) `id`, `nickname`, and `socket` properties
* Clients should be able to send messages to all other clients by sending it to the server
* Clients should be able to run special commands by sending messages that start with a command name
  * The client should send `@quit` to disconnect
  * The client should send `@list` to list all connected users
  * The client should send `@nickname <new-name>` to change their nickname
  * The client should send `@dm <to-username> <message>` to send a message directly to another user by their nickname
* Connected clients should be maintained in an in-memory collection (array) called the `clientPool`
  * When a socket emits the `close` event, the socket should be removed from the client pool
  * When a socket emits the `error` event, the error should be logged on the server
  * When a socket emits the `data` event, the data should be logged on the server and the commands below should be implemented

##  Documentation  
Write basic documention for starting your server connection and using the chatroom application.  Be sure to use proper markdown constructs and `highlight blocks of code`.

-Starting my server I needed to require the "net module" located in app.js, in order to open the server connection.  

`const app = require('./src/app')`; = where the net module is located with "ON" methods. 

`const port = process.env.PORT || 5000;`
Then creating a port variable in index.js where port is assigned to process.env.PORT OR 5000 which means "whatever is in the enviornment variable PORT or 5000 if there's nothing there." 

Once the server turned on, I needed to create my core application where @dm,@quit,@list,@all would be passed through in order to show/see/update the messages.  When the server is on, the following code would run: 
`app.on('connection', (socket) => {`
    `let user = new Client(socket);`
    `clientPool[user.id] = user;`
    `socket.on('data', (data) => {`
       `const text = data.toString().trim();`
        `if(text.startsWith('@')){`
            `let [command, payload] = text.split(/\s+(.*)/);`
            `chatEmitter.emit(command, payload, user.id);`
    `Object.keys(clientPool).forEach(key => {`
        `clientPool[key].socket.write('User: ' + user.id + ' has joined\n');`
This code means: once the app is on and has connection, the socket will be passed through for new Clients.  If text starts with '@' then the program is registered to understand it as a command.

Once the core app was updated, chatEmitter.js is where the eventEmitter.on happens where I required the eventEmitter.  Once the new eventEmitter was established, I was able to create the four command keys; @all,@dm,@list,@quit.     
