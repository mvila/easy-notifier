'use strict';

import fetch from 'isomorphic-fetch';

export class SlackIncomingWebhookTarget {
  constructor(url, options) {
    if (!url) throw new Error('URL is missing');
    options = Object.assign({ channel: '#general' }, options);
    this.url = url;
    this.channel = options.channel;
  }

  async send(sender, title, message) {
    if (title) message = `*${title}*: ${message}`;
    let payload = {
      channel: this.channel,
      username: sender,
      text: '<!channel> ' + message
    };
    let response = await fetch(this.url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    let text = await response.text();
    if (text !== 'ok') {
      console.error(new Error(`An error occured while sending a Slack notification (${text})`));
    }
  }
}

export default SlackIncomingWebhookTarget;
