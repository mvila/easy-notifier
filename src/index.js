'use strict';

import environment from 'better-node-env';
import betterHostname from 'better-hostname';

import NodeNotifierTarget from './targets/node-notifier';

export class EasyNotifier {
  // options:
  //   sender
  //   appName
  //   hostName
  //   targets
  //   includeEnvironment (default: true)
  //   log
  constructor(options = {}) {
    let sender = options.sender;
    if (!sender) {
      let includeEnvironment = options.includeEnvironment;
      if (includeEnvironment == null) includeEnvironment = true;

      let appName = options.appName;
      if (includeEnvironment) {
        if (appName) appName += '.'; else appName = '';
        appName += environment;
      }

      let hostName = options.hostName;
      if (!hostName) hostName = betterHostname;

      sender = appName;
      if (sender) sender += '@'; else sender = '';
      sender += hostName;
    }
    this.sender = sender;

    let targets = options.targets;
    if (!targets) {
      let target = new NodeNotifierTarget();
      targets = [target];
    }
    this.targets = targets;
  }

  addTarget(target) {
    this.targets.push(target);
  }

  async notify(title, message) {
    if (!message) {
      message = title;
      title = undefined;
    }
    if (!message) throw new Error('A \'message\' is required');
    for (let target of this.targets) {
      await target.send(this.sender, title, message);
    }
  }
}

export default EasyNotifier;
export { NodeNotifierTarget };
export { SlackIncomingWebhookTarget } from './targets/slack-incoming-webhook';
