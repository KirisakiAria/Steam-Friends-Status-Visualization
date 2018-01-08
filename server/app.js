'use strict';

const path = require('path');
const express = require('express');
const app = express();
const router = require('./routes/main');
const ejs = require('ejs');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

router(app);

module.exports = app;