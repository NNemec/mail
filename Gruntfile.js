module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        ngtemplates: "grunt-angular-templates",
    });

    var version = grunt.option('release'),
        zipName = (version) ? version : 'DEV';

    var browserifyOpt = {
        exclude: ['openpgp', 'node-forge', 'net', 'tls', 'crypto', 'purify'], // node apis not required at build time
        ignore: ['buffer'], // node apis to be stubbed for runtime
        browserifyOptions: {
            debug: true
        }
    };

    // Project configuration.
    grunt.initConfig({

        // General

        shell: {
            options: {
                stderr: false
            },
            target: {
                command: 'dir=$(pwd) && cd node_modules/mailreader/ && npm install --production && cd $dir'
            }
        },

        clean: {
            dist: ['dist', 'build', 'src/css', 'release', 'test/lib', 'test/integration/src',
                   'src/js/*.min.js', 'src/js/*.min.js.map' ],
            release: ['dist/**/*.js.map']
        },

        copy: {
            srclib: {
                expand: true,
                flatten: true,
                cwd: './',
                src: [
                    'node_modules/openpgp/dist/openpgp.min.js',
                    'node_modules/openpgp/dist/openpgp.worker.min.js',
                    'node_modules/node-forge/dist/forge.min.js',
                ],
                dest: 'src/js/'
            },
            lib: {
                expand: true,
                flatten: true,
                cwd: './',
                src: [
                    'node_modules/openpgp/dist/openpgp.min.js',
                    'node_modules/openpgp/dist/openpgp.worker.min.js',
                    'node_modules/node-forge/dist/forge.min.js',
                ],
                dest: 'dist/js/'
            },
            libTest: {
                expand: true,
                flatten: true,
                cwd: './',
                src: [
                    'node_modules/mocha/mocha.css',
                    'node_modules/mocha/mocha.js',
                    'node_modules/chai/chai.js',
                    'node_modules/sinon/pkg/sinon.js',
                    'node_modules/browsercrow/src/*.js',
                    'node_modules/browsersmtp/src/*.js',
                    'node_modules/openpgp/dist/openpgp.min.js',
                    'node_modules/openpgp/dist/openpgp.worker.min.js',
                    'node_modules/node-forge/dist/forge.min.js',
                    'dist/js/pbkdf2-worker.min.js'
                ],
                dest: 'test/lib/'
            },
            font: {
                expand: true,
                cwd: 'src/font/',
                src: ['*'],
                dest: 'dist/font/'
            },
            img: {
                expand: true,
                cwd: 'src/img/',
                src: ['*'],
                dest: 'dist/img/'
            },
            icons: {
                expand: true,
                cwd: 'src/img/icons',
                src: ['all.svg'],
                dest: 'dist/img/icons'
            },
            tpl: {
                expand: true,
                cwd: 'src/tpl/',
                src: ['read-sandbox.html'],
                dest: 'dist/tpl/'
            },
            app: {
                expand: true,
                cwd: 'src/',
                src: ['*.js', '*.json', 'manifest.*'],
                dest: 'dist/'
            },
            html: {
                expand: true,
                cwd: 'src/',
                src: ['index.html'],
                dest: 'dist/'
            },
        },

        // Stylesheets

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'src/css/read-sandbox.css': 'src/sass/read-sandbox.scss',
                    'src/css/all.css': 'src/sass/all.scss'
                }
            },
            styleguide: {
                files: {
                    'build/css/styleguide.css': 'src/sass/styleguide.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: {
                    'src/css/read-sandbox.css': 'src/css/read-sandbox.css',
                    'src/css/all.css': 'src/css/all.css'
                }
            },
            styleguide: {
                files: {
                    'build/css/styleguide.css': 'build/css/styleguide.css'
                }
            }
        },
        csso: {
            options: {
                banner: '/*! Copyright © 2013, Whiteout Networks GmbH. All rights reserved.*/\n'
            },
            dist: {
                files: {
                    'dist/css/read-sandbox.css': 'src/css/read-sandbox.css',
                    'dist/css/all.css': 'src/css/all.css'
                }
            },
            styleguide: {
                files: {
                    'dist/styleguide/css/styleguide.min.css': 'build/css/styleguide.css'
                }
            }
        },

        // JavaScript

        jshint: {
            all: ['Gruntfile.js', 'src/*.js', 'src/js/**/*.js', 'test/unit/*-test.js', 'test/integration/*-test.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        browserify: {
            app: {
                files: {
                    'build/js/app.js': ['src/js/app.js']
                },
                options: browserifyOpt
            },
            pbkdf2Worker: {
                files: {
                    'src/js/pbkdf2-worker.min.js': ['src/js/crypto/pbkdf2-worker.js']
                },
                options: browserifyOpt
            },
            mailreaderWorker: {
                files: {
                    'src/js/mailreader-parser-worker.min.js': ['node_modules/mailreader/src/mailreader-parser-worker-browserify.js']
                },
                options: browserifyOpt
            },
            tlsWorker: {
                files: {
                    'build/js/tcp-socket-tls-worker.browserified.js': ['node_modules/emailjs-tcp-socket/src/emailjs-tcp-socket-tls-worker.js']
                },
                options: browserifyOpt
            },
            compressionWorker: {
                files: {
                    'build/js/emailjs-imap-client-compression-worker.browserified.js': ['node_modules/emailjs-imap-client/src/emailjs-imap-client-compression-worker.js']
                },
                options: browserifyOpt
            },
            unitTest: {
                files: {
                    'test/unit/index.browserified.js': [
                        'test/main.js',
                        'test/unit/util/dialog-test.js',
                        'test/unit/util/connection-doctor-test.js',
                        'test/unit/util/update-handler-test.js',
                        'test/unit/util/status-display-test.js',
                        'test/unit/crypto/pgp-test.js',
                        'test/unit/crypto/crypto-test.js',
                        'test/unit/service/rest-dao-test.js',
                        'test/unit/service/admin-dao-test.js',
                        'test/unit/service/auth-test.js',
                        'test/unit/service/oauth-test.js',
                        'test/unit/service/publickey-dao-test.js',
                        'test/unit/service/privatekey-dao-test.js',
                        'test/unit/service/lawnchair-dao-test.js',
                        'test/unit/service/keychain-dao-test.js',
                        'test/unit/service/devicestorage-dao-test.js',
                        'test/unit/service/newsletter-service-test.js',
                        'test/unit/service/mail-config-service-test.js',
                        'test/unit/service/invitation-dao-test.js',
                        'test/unit/service/publickey-verifier-test.js',
                        'test/unit/email/outbox-bo-test.js',
                        'test/unit/email/email-dao-test.js',
                        'test/unit/email/account-test.js',
                        'test/unit/email/search-test.js',
                        'test/unit/controller/login/add-account-ctrl-test.js',
                        'test/unit/controller/login/create-account-ctrl-test.js',
                        'test/unit/controller/login/validate-phone-ctrl-test.js',
                        'test/unit/controller/login/login-existing-ctrl-test.js',
                        'test/unit/controller/login/login-initial-ctrl-test.js',
                        'test/unit/controller/login/login-new-device-ctrl-test.js',
                        'test/unit/controller/login/login-privatekey-download-ctrl-test.js',
                        'test/unit/controller/login/login-privatekey-upload-ctrl-test.js',
                        'test/unit/controller/login/login-verify-public-key-ctrl-test.js',
                        'test/unit/controller/login/login-set-credentials-ctrl-test.js',
                        'test/unit/controller/login/login-ctrl-test.js',
                        'test/unit/controller/app/dialog-ctrl-test.js',
                        'test/unit/controller/app/publickey-import-ctrl-test.js',
                        'test/unit/controller/app/account-ctrl-test.js',
                        'test/unit/controller/app/set-passphrase-ctrl-test.js',
                        'test/unit/controller/app/contacts-ctrl-test.js',
                        'test/unit/controller/app/read-ctrl-test.js',
                        'test/unit/controller/app/navigation-ctrl-test.js',
                        'test/unit/controller/app/mail-list-ctrl-test.js',
                        'test/unit/controller/app/write-ctrl-test.js',
                        'test/unit/controller/app/action-bar-ctrl-test.js',
                    ]
                },
                options: browserifyOpt
            },
            integrationTest: {
                files: {
                    'test/integration/index.browserified.js': [
                        'test/main.js',
                        'test/integration/email-dao-test.js',
                        'test/integration/publickey-verifier-test.js'
                    ]
                },
                options: browserifyOpt
            }
        },

        exorcise: {
            app: {
                files: {
                    'build/js/app.js.map': ['build/js/app.js'],
                },
                options: {
                    root: "../.."
                }
            },
            pbkdf2Worker: {
                files: {
                    'src/js/pbkdf2-worker.min.js.map': ['src/js/pbkdf2-worker.min.js'],
                }
            },
            mailreaderWorker: {
                files: {
                    'src/js/mailreader-parser-worker.min.js.map': ['src/js/mailreader-parser-worker.min.js'],
                }
            },
            tlsWorker: {
                files: {
                    'build/js/tcp-socket-tls-worker.browserified.js.map': ['build/js/tcp-socket-tls-worker.browserified.js'],
                }
            },
            compressionWorker: {
                files: {
                    'build/js/emailjs-imap-client-compression-worker.browserified.js.map': ['build/js/emailjs-imap-client-compression-worker.browserified.js'],
                }
            },
            unitTest: {
                files: {
                    'test/unit/index.browserified.js.map': ['test/unit/index.browserified.js'],
                }
            },
            integrationTest: {
                files: {
                    'test/integration/index.browserified.js.map': ['test/integration/index.browserified.js'],
                }
            }
        },

        ngtemplates: {
            mail: {
                src: [
                    'tpl/**/*.html'
                ],
                dest: 'build/js/app.templates.js',
                cwd: 'src/',
                options: {
                    htmlmin: {
                        collapseWhitespace: true,
                        removeComments: true // we do not use comment directives
                    }
                }
            }
        },

        concat: {
            options: {
                separator: ';\n',
                sourceMap: true
            },
            app: {
                src: [
                    'node_modules/underscore/underscore.js',
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/angular/angular.js',
                    'node_modules/angular-route/angular-route.js',
                    'node_modules/angular-animate/angular-animate.js',
                    'node_modules/ng-tags-input/build/ng-tags-input.min.js',
                    'node_modules/ng-infinite-scroll/build/ng-infinite-scroll.min.js',
                    'node_modules/iframe-resizer/js/iframeResizer.min.js',
                    'src/lib/lawnchair/lawnchair-git.js',
                    'src/lib/lawnchair/lawnchair-adapter-webkit-sqlite-git.js',
                    'src/lib/lawnchair/lawnchair-adapter-indexed-db-git.js',
                    'build/js/app.js',
                    '<%= ngtemplates.mail.dest %>'
                ],
                dest: 'dist/js/boot.js',
                options: {
                    sourceMapName: 'dist/js/boot.js.map'
                }
            },
            readSandbox: {
                src: [
                    'node_modules/dompurify/src/purify.js',
                    'node_modules/iframe-resizer/js/iframeResizer.contentWindow.min.js',
                    'src/js/directive/read-sandbox.js'
                ],
                dest: 'src/js/read-sandbox.min.js'
            },
            pbkdf2Worker: {
                src: ['src/js/pbkdf2-worker.min.js'],
                dest: 'dist/js/pbkdf2-worker.min.js',
                options: {
                    sourceMapName: 'dist/js/pbkdf2-worker.min.js.map'
                }
            },
            mailreaderWorker: {
                src: ['src/js/mailreader-parser-worker.min.js'],
                dest: 'dist/js/mailreader-parser-worker.min.js',
                options: {
                    sourceMapName: 'dist/js/mailreader-parser-worker.min.js.map'
                }
            },
            tlsWorker: {
                src: ['build/js/tcp-socket-tls-worker.browserified.js'],
                dest: 'dist/js/tcp-socket-tls-worker.min.js',
                options: {
                    sourceMapName: 'dist/js/tcp-socket-tls-worker.min.js.map'
                }
            },
            compressionWorker: {
                src: ['build/js/emailjs-imap-client-compression-worker.browserified.js'],
                dest: 'dist/js/emailjs-imap-client-compression-worker.min.js',
                options: {
                    sourceMapName: 'dist/js/emailjs-imap-client-compression-worker.min.js.map'
                }
            },
            unitTest: {
                src: [
                    'node_modules/underscore/underscore.js',
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/angular/angular.js',
                    'node_modules/angular-route/angular-route.js',
                    'node_modules/angular-mocks/angular-mocks.js',
                    'src/lib/lawnchair/lawnchair-git.js',
                    'src/lib/lawnchair/lawnchair-adapter-webkit-sqlite-git.js',
                    'src/lib/lawnchair/lawnchair-adapter-indexed-db-git.js',
                    'test/unit/index.browserified.js'
                ],
                dest: 'test/unit/index.js',
                options: {
                    sourceMapName: 'test/unit/index.js.map'
                }
            },
            integrationTest: {
                src: [
                    'node_modules/underscore/underscore.js',
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/angular/angular.js',
                    'node_modules/angular-mocks/angular-mocks.js',
                    'src/lib/lawnchair/lawnchair-git.js',
                    'src/lib/lawnchair/lawnchair-adapter-webkit-sqlite-git.js',
                    'src/lib/lawnchair/lawnchair-adapter-indexed-db-git.js',
                    'test/integration/index.browserified.js'
                ],
                dest: 'test/integration/index.js',
                options: {
                    sourceMapName: 'test/integration/index.js.map'
                }
            }
        },

        uglify: {
            app: {
                files: {
//                    'dist/js/boot.js': ['dist/js/boot.js']   --- breaks on ES6 features in emailjs-imap-client
                },
                options: {
                    mangle: false,
                    sourceMap: true,
                    sourceMapIn: 'dist/js/boot.js.map',
                    sourceMapIncludeSources: true,
                    sourceMapName: 'dist/js/boot.js.map'
                }
            },
            readSandbox: {
                files: {
                    'dist/js/read-sandbox.min.js': ['src/js/read-sandbox.min.js']
                },
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/js/read-sandbox.min.js.map'
                }
            },
            pbkdf2Worker: {
                files: {
                    'dist/js/pbkdf2-worker.min.js': ['dist/js/pbkdf2-worker.min.js']
                },
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/js/pbkdf2-worker.min.js.map'
                }
            },
            mailreaderWorker: {
                files: {
                    'dist/js/mailreader-parser-worker.min.js': ['dist/js/mailreader-parser-worker.min.js']
                },
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/js/mailreader-parser-worker.min.js.map'
                }
            },
            tlsWorker: {
                files: {
                    'dist/js/tcp-socket-tls-worker.min.js': ['dist/js/tcp-socket-tls-worker.min.js']
                },
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/js/tcp-socket-tls-worker.min.js.map'
                }
            },
            compressionWorker: {
                files: {
                    'dist/js/emailjs-imap-client-compression-worker.min.js': ['dist/js/emailjs-imap-client-compression-worker.min.js']
                },
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/js/emailjs-imap-client-compression-worker.min.js.map'
                }
            },
            options: {
                banner: '/*! Copyright © <%= grunt.template.today("yyyy") %>, Whiteout Networks GmbH.*/\n'
            }
        },

        mocha_phantomjs: {
            all: {
                options: {
                    urls: [
                        'http://localhost:<%= connect.test.options.port %>/test/unit/index.html',
                        'http://localhost:<%= connect.test.options.port %>/test/integration/index.html'
                    ]
                }
            }
        },

        // Assets

        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false
                }, {
                    removeUselessStrokeAndFill: false
                }]
            },
            icons: {
                files: [{
                    expand: true,
                    src: ['img/icons/*.svg', '!img/icons/all.svg'],
                    cwd: 'src/',
                    dest: 'build/'
                }]
            }
        },
        svgstore: {
            options: {
                prefix: 'icon-',
                svg: {
                    viewBox: '0 0 100 100',
                    xmlns: 'http://www.w3.org/2000/svg'
                },
                cleanup: ['fill', 'stroke']
            },
            icons: {
                files: {
                    'src/img/icons/all.svg': ['build/img/icons/*.svg'],
                }
            }
        },

        // Styleguide

        assemble: {
            options: {
                assets: 'dist',
                layoutdir: 'src/styleguide/layouts',
                layout: 'default.hbs',
                partials: ['src/styleguide/blocks/**/*.hbs'],
                helpers: [
                    'handlebars-helper-compose',
                    'src/styleguide/helpers/**/*.js'
                ],
                data: [
                    'dist/manifest.json'
                ],
                flatten: true
            },
            styleguide: {
                files: [{
                    'dist/styleguide/': ['src/styleguide/*.hbs']
                }]
            }
        },

        // Development

        connect: {
            dev: {
                options: {
                    port: 8580,
                    base: '.',
                    keepalive: true
                }
            },
            test: {
                options: {
                    port: 8581,
                    base: '.'
                }
            }
        },

        // Utilities

        watch: {
            css: {
                files: ['src/sass/**/*.scss'],
                tasks: ['dist-css', 'offline-cache', 'dist-styleguide']
            },
            styleguide: {
                files: ['src/styleguide/**/*.hbs', 'src/styleguide/**/*.js'],
                tasks: ['dist-styleguide']
            },
            jsApp: {
                files: ['src/js/**/*.js', 'src/*.html', 'src/tpl/**/*.html'],
                tasks: ['dist-js-app']
            },
            jsUnitTest: {
                files: ['test/unit/**/*-test.js', 'test/*.js'],
                tasks: ['dist-js-unitTest']
            },
            jsIntegrationTest: {
                files: ['test/integration/*-test.js', 'test/*.js'],
                tasks: ['dist-js-integrationTest']
            },
            icons: {
                files: ['src/index.html', 'src/img/icons/*.svg', '!src/img/icons/all.svg'],
                tasks: ['svgmin', 'svgstore', 'copy:icons', 'dist-styleguide', 'offline-cache']
            },
            lib: {
                files: ['src/lib/**/*.js'],
                tasks: ['copy:lib', 'offline-cache']
            },
            app: {
                files: ['src/*.js', 'src/*.html', 'src/tpl/**/*.html', 'src/**/*.json', 'src/manifest.*', 'src/img/**/*', 'src/font/**/*'],
                tasks: ['copy:app', 'copy:tpl', 'copy:img', 'copy:font', 'manifest-dev', 'offline-cache']
            }
        },

        // Deployment

        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: 'release/whiteout-mail_' + zipName + '.zip'
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*'],
                dest: 'release/'
            }
        },

        // Offline caching

        swPrecache: {
            prod: {
                handleFetch: true,
                rootDir: 'dist'
            }
        },

        manifest: {
            generate: {
                options: {
                    basePath: 'dist/',
                    timestamp: true,
                    hash: true,
                    cache: ['socket.io/socket.io.js'],
                    exclude: [
                        'appcache.manifest',
                        'manifest.webapp',
                        'manifest.mobile.json',
                        'background.js',
                        'service-worker.js',
                        'styleguide/css/styleguide.min.css',
                        'styleguide/index.html',
                        'js/boot.js.map',
                        'js/pbkdf2-worker.min.js.map',
                        'js/read-sandbox.min.js.map',
                        'js/mailreader-parser-worker.min.js.map',
                        'js/tcp-socket-tls-worker.min.js.map',
                        'js/emailjs-imap-client-compression-worker.min.js.map',
                        'img/icon-100-ios.png',
                        'img/icon-114-ios.png',
                        'img/icon-120-ios.png',
                        'img/icon-128-chrome.png',
                        'img/icon-144-android.png',
                        'img/icon-144-ios.png',
                        'img/icon-152-ios.png',
                        'img/icon-180-ios.png',
                        'img/icon-192-android.png',
                        'img/icon-29-ios.png',
                        'img/icon-36-android.png',
                        'img/icon-40-ios.png',
                        'img/icon-48-android.png',
                        'img/icon-50-ios.png',
                        'img/icon-57-ios.png',
                        'img/icon-58-ios.png',
                        'img/icon-60-android.png',
                        'img/icon-60-ios.png',
                        'img/icon-72-android.png',
                        'img/icon-72-ios.png',
                        'img/icon-76-ios.png',
                        'img/icon-78-android.png',
                        'img/icon-80-ios.png',
                        'img/icon-87-ios.png',
                        'img/icon-96-android.png',
                        'img/Default-568h@2x~iphone.png',
                        'img/Default-667h.png',
                        'img/Default-736h.png',
                        'img/Default-Landscape-736h.png',
                        'img/Default-Landscape@2x~ipad.png',
                        'img/Default-Landscape~ipad.png',
                        'img/Default-Portrait@2x~ipad.png',
                        'img/Default-Portrait~ipad.png',
                        'img/Default@2x~iphone.png',
                        'img/Default~iphone.png'
                    ],
                    master: ['index.html']
                },
                src: ['**/*.*'],
                dest: 'dist/appcache.manifest'
            }
        }

    });

    // generate service-worker stasks
    grunt.registerMultiTask('swPrecache', function() {
        var fs = require('fs');
        var path = require('path');
        var swPrecache = require('sw-precache');
        var packageJson = require('./package.json');

        var done = this.async();
        var rootDir = this.data.rootDir;
        var handleFetch = this.data.handleFetch;

        generateServiceWorkerFileContents(rootDir, handleFetch, function(error, serviceWorkerFileContents) {
            if (error) {
                grunt.fail.warn(error);
            }
            fs.writeFile(path.join(rootDir, 'service-worker.js'), serviceWorkerFileContents, function(error) {
                if (error) {
                    grunt.fail.warn(error);
                }
                done();
            });
        });

        function generateServiceWorkerFileContents(rootDir, handleFetch, callback) {
            var config = {
                cacheId: packageJson.name,
                // If handleFetch is false (i.e. because this is called from swPrecache:dev), then
                // the service worker will precache resources but won't actually serve them.
                // This allows you to test precaching behavior without worry about the cache preventing your
                // local changes from being picked up during the development cycle.
                handleFetch: handleFetch,
                logger: grunt.log.writeln,
                dynamicUrlToDependencies: {
                    'socket.io/socket.io.js': ['node_modules/socket.io-client/dist/socket.io.js'],
                },
                staticFileGlobs: [
                    rootDir + '/*.html',
                    rootDir + '/tpl/*.html',
                    rootDir + '/js/**/*.min.js',
                    rootDir + '/css/**/*.css',
                    rootDir + '/img/**/*.svg',
                    rootDir + '/img/*-universal.png',
                    rootDir + '/font/**.*',
                    rootDir + '/*.json'
                ],
                maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
                stripPrefix: path.join(rootDir, path.sep)
            };

            swPrecache.generate(config, callback);
        }
    });

    // Build tasks
    grunt.registerTask('dist-css', ['sass:dist', 'autoprefixer:dist', 'csso:dist']);
    grunt.registerTask('dist-js', ['browserify', 'exorcise', 'ngtemplates', 'concat', 'uglify']);
    grunt.registerTask('dist-js-app', [
        'browserify:app',
        'browserify:pbkdf2Worker',
        'exorcise:app',
        'exorcise:pbkdf2Worker',
        'ngtemplates',
        'concat:app',
        'concat:readSandbox',
        'concat:pbkdf2Worker',
        'offline-cache'
    ]);
    grunt.registerTask('dist-js-unitTest', [
        'browserify:unitTest',
        'exorcise:unitTest',
        'concat:unitTest'
    ]);
    grunt.registerTask('dist-js-integrationTest', [
        'browserify:integrationTest',
        'exorcise:integrationTest',
        'concat:integrationTest'
    ]);
    grunt.registerTask('dist-copy', ['copy']);
    grunt.registerTask('dist-assets', ['svgmin', 'svgstore', 'copy:icons']);
    grunt.registerTask('dist-styleguide', ['sass:styleguide', 'autoprefixer:styleguide', 'csso:styleguide', 'assemble:styleguide']);
    // generate styleguide after manifest to forward version number to styleguide
    grunt.registerTask('dist', ['clean:dist', 'shell', 'dist-css', 'dist-js', 'dist-assets', 'dist-copy', 'manifest', 'dist-styleguide']);

    grunt.registerTask('offline-cache', ['manifest', 'swPrecache:prod']);

    // Test/Dev tasks
    grunt.registerTask('dev', ['connect:dev']);
    grunt.registerTask('test', ['jshint', 'connect:test', 'mocha_phantomjs']);
    grunt.registerTask('prod', ['connect:prod']);

    //
    // Release tasks for Chrome App Release Channels
    //

    grunt.registerTask('manifest-dev', function() {
        patchManifest({
            suffix: ' (DEV)',
            version: '9999.9999.9999'
        });
    });
    grunt.registerTask('manifest-test', function() {
        if (!version) {
            throw new Error('You must specify the version: "--release=1.0.0"');
        }

        patchManifest({
            suffix: ' (TEST)',
            client_id: '440907777130-bfpgo5fbo4f7hetrg3hn57qolrtubs0u.apps.googleusercontent.com',
            version: version,
            deleteKey: true
        });
    });
    grunt.registerTask('manifest-prod', function() {
        if (!version) {
            throw new Error('You must specify the version: "--release=1.0.0"');
        }

        patchManifest({
            version: version,
            deleteKey: true,
            keyServer: 'https://keys.whiteout.io/'
        });
    });

    function patchManifest(options) {
        var fs = require('fs'),
            path = './dist/manifest.json',
            manifest = require(path);

        if (options.version) {
            manifest.version = options.version;
        }
        if (options.suffix) {
            manifest.name += options.suffix;
        }
        if (options.client_id) {
            manifest.oauth2.client_id = options.client_id;
        }
        if (options.keyServer) {
            var ksIndex = manifest.permissions.indexOf('https://keys-test.whiteout.io/');
            manifest.permissions[ksIndex] = options.keyServer;
        }
        if (options.deleteKey) {
            delete manifest.key;
        }

        fs.writeFileSync(path, JSON.stringify(manifest, null, 2));
    }

    grunt.registerTask('release-dev', ['dist', 'manifest-dev', 'swPrecache:prod', 'compress']);
    grunt.registerTask('release-test', ['dist', 'manifest-test', 'clean:release', 'swPrecache:prod', 'compress']);
    grunt.registerTask('release-prod', ['dist', 'manifest-prod', 'clean:release', 'swPrecache:prod', 'compress']);
    grunt.registerTask('default', ['release-dev']);

};