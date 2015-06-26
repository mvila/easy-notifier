'use strict';

// ./node_modules/.bin/babel-node --harmony examples/basic.js

let KindaNotifier = require('../src');

let notifier = KindaNotifier.create();

notifier.send('Welcome Message', 'Hello, World!');
