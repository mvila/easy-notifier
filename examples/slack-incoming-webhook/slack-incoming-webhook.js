'use strict';

// babel-node examples/slack-incoming-webhook/slack-incoming-webhook.js

import EasyNotifier, { SlackIncomingWebhookTarget } from '../../src/';
import slackURL from './slack-url';

let notifier = new EasyNotifier({
  appName: 'examples',
  targets: [
    new SlackIncomingWebhookTarget(slackURL, {
      channel: '#development'
    })
  ]
});

notifier.notify('Welcome Message', 'Hello, World!');
