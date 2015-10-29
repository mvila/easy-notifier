'use strict';

let nodeNotifier = require('node-notifier');

export class NodeNotifierTarget {
  async send(sender, title, message) {
    message += ` (${sender})`;
    let options = { message };
    if (title) options.title = title;
    nodeNotifier.notify(options);
  }
}

export default NodeNotifierTarget;
