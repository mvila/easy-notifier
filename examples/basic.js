'use strict';

// babel-node examples/basic.js

import EasyNotifier from '../src/';

let notifier = new EasyNotifier({ appName: 'examples' });

notifier.notify('Welcome Message', 'Hello, World!');
