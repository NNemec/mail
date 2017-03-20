require('source-map-support').install();

var _ = require('underscore');
var jQuery = require('jquery');
var $ = jQuery;
require('angular');
require('angular-route');
require('angular-animate');
require('ng-tags-input');
require('ng-infinite-scroll');
var iFrameResize = require('iframe-resizer').iframeResizer;

var Lawnchair = require('./lib/lawnchair/lawnchair-git');
require('./lib/lawnchair/lawnchair-adapter-webkit-sqlite-git');
require('./lib/lawnchair/lawnchair-adapter-indexed-db-git');

require('./js/app.js');
