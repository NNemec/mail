define(function(require) {
    'use strict';

    var appController = require('js/app-controller'),
        errorUtil = require('js/util/error');

    var LoginCtrl = function($scope, $location) {
        // global state... inherited to all child scopes
        $scope.$root.state = {};
        // attach global error handler
        errorUtil.attachHandler($scope);

        // check for app update
        appController.checkForUpdate();

        // start main application controller
        appController.start({
            onError: $scope.onError
        }, function(err) {
            if (err) {
                $scope.onError(err);
                return;
            }

            initializeUser();
        });

        function initializeUser() {
            // get OAuth token from chrome
            appController.getEmailAddress(function(err, emailAddress) {
                if (err) {
                    $scope.onError(err);
                    return;
                }

                // check if account needs to be selected
                if (!emailAddress) {
                    goTo('/add-account');
                    return;
                }

                // initiate controller by creating email dao
                appController.init({
                    emailAddress: emailAddress
                }, function(err, availableKeys) {
                    if (err) {
                        $scope.onError(err);
                        return;
                    }

                    redirect(availableKeys);
                });
            });
        }

        function redirect(availableKeys) {
            // redirect if needed
            if (typeof availableKeys === 'undefined') {
                // no public key available, start onboarding process
                goTo('/login-initial');
            } else if (!availableKeys.privateKey) {
                // no private key, import key
                goTo('/login-new-device');
            } else {
                // public and private key available, try empty passphrase
                appController._emailDao.unlock({
                    keypair: availableKeys,
                    passphrase: undefined
                }, function(err) {
                    if (err) {
                        goTo('/login-existing');
                        return;
                    }

                    goTo('/desktop');
                });
            }
        }

        function goTo(location) {
            $location.path(location);
            $scope.$apply();
        }
    };

    return LoginCtrl;
});