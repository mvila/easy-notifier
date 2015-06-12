'use strict';

// ./node_modules/.bin/babel-node --harmony examples/slack-incoming-webhook/slack-incoming-webhook.js

let KindaNotification = require('../../src');
let slackURL = require('./slack-url');
let notification = KindaNotification.create({
  applicationName: 'examples',
  targets: [
    {
      service: 'slack-incoming-webhook',
      options: {
        url: slackURL,
        channel: '#development'
      }
    }
  ]
});

notification.send('Hello, World!');
