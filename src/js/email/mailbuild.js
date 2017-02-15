'use strict';

var Mailbuild = require('emailjs-mime-builder');

var ngModule = angular.module('woEmail');
ngModule.factory('mailbuild', function() {
    return Mailbuild;
});