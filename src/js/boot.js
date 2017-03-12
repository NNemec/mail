require('underscore');
require('jquery');
require('angular');
require('angular-route');
require('angular-animate');
require('ng-tags-input');
require('ng-infinite-scroll');
require('iframe-resizer');

var Lawnchair = require('./lib/lawnchair/lawnchair-git');
require('./lib/lawnchair/lawnchair-adapter-webkit-sqlite-git');
require('./lib/lawnchair/lawnchair-adapter-indexed-db-git');

require('./js/app.js');
