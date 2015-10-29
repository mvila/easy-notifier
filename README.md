# EasyNotifier [![Build Status](https://travis-ci.org/mvila/easy-notifier.svg?branch=master)](https://travis-ci.org/mvila/easy-notifier)

Flexible notifier with desktop and Slack targets.

## Installation

```
npm install --save easy-notifier
```

## Usage

```javascript
import EasyNotifier from 'easy-notifier';

let notifier = new EasyNotifier({ appName: 'example' });

notifier.send('Welcome Message', 'Hello, World!');
```

## Concepts

### Targets

You can configure the targets of the notifier.

For now, the supported targets are:

- `NodeNotifierTarget` uses [node-notifier](https://www.npmjs.com/package/node-notifier) to display the notifications.
- `SlackIncomingWebhookTarget` sends notifications to Slack using the [incoming webhook API](https://api.slack.com/incoming-webhooks).

It is easy to create your own type of target. A target is just an object with a `send(sender, title, message)` method.

## API

### `new EasyNotifier([options])`

Create a notifier.

```javascript
import EasyNotifier from 'easy-notifier';

let notifier = new EasyNotifier({ appName: 'example' });
```

#### `options`

- `sender`: the name of the sender. If not specified, a nice name is generated from `appName`, `hostName` and `NODE_ENV`.
- `appName`: the name of the running application.
- `hostName`: the name of the host where the application is running. If not specified, `hostName` is determined from the hostname of the machine.
- `targets`: the targets where all notifications are sent. The default is an instance of `NodeNotifierTarget`.
- `includeEnvironment` _(default: `true`)_: if `false`, the current environment (`NODE_ENV`) is not included in the `sender` name.

### `notifier.addTarget(target)`

Add a target to the notifier.

```javascript
import { SlackIncomingWebhookTarget } from 'easy-notifier';

notifier.addTarget(new SlackIncomingWebhookTarget(/* webhook URL */));
```

### `notifier.notify([title], message)`

Send the specified message with an optional title. This method returns a promise which is resolved once the notification has been successfully sent.

```javascript
notifier.notify('Welcome Message', 'Hello, World!');
```

## License

MIT
