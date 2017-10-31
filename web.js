var path = require('path');
var express = require('express');
var app = express();

app.use(express.static('app'));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/@bower_components')));
app.listen(process.env.PORT || 5000);