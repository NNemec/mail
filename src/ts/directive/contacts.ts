'use strict';

var ngModule = angular.module('woDirectives');

ngModule.directive('keyfileInput', function() {
    return function(scope, elm) {
        elm.on('change', function(e) {
            for (var i = 0; i < (e.target as HTMLInputElement).files.length; i++) {
                importKey((e.target as HTMLInputElement).files.item(i));
            }
            elm.val(null);  // clear input
        });

        function importKey(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                scope.importKey(this.result);
            };
            reader.readAsText(file);
        }
    };
});