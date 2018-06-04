//entry point of your application

'use strict';
const app = require('./src/app');
const port = process.env.PORT || 5000;
app.listen(port, '127.0.0.1');
