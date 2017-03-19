// Karma configuration
// Generated on Fri Feb 17 2017 13:03:33 GMT+0200 (CEST)
var path = require('path');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    // frameworks: ['jasmine'],
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
        'node_modules/vue/dist/vue.js',
        'node_modules/vue-resource/dist/vue-resource.js',
        'node_modules/babel-polyfill/dist/polyfill.js',
        'test/test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        './test/test.js': ['webpack']
    },

    webpack: {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: path.join(__dirname, 'node_modules'),
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.vue$/,
                    exclude: path.join(__dirname, 'node_modules'),
                    loader: 'vue-loader'
                }
            ]
        },
        resolve: {
            alias: {
                vue: 'vue/dist/vue.js'
            }
        },
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,

    proxies: {
        //
    },


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
}
