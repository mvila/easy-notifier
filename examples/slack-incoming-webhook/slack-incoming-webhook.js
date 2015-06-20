'use strict';

// ./node_modules/.bin/babel-node --harmony examples/slack-incoming-webhook/slack-incoming-webhook.js

let KindaNotifier = require('../../src');
let slackURL = require('./slack-url');
let notifier = KindaNotifier.create({
  appName: 'examples',
  targets: [
    KindaNotifier.SlackIncomingWebhookTarget.create({
      url: slackURL,
      channel: '#development'
    })
  ]
});

notifier.send('Hello, World!');
