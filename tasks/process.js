/*globals process */
(function () {
    'use strict';

    module.exports = function (grunt) {
        var glob = require('glob'),
            fs = require('fs-extra'),
            path = require('path'),
            async = require('async'),
            _ = require('lodash'),
            junit = require('./junit.js')(grunt),
            defaultOptions = {
                dynamicAnalysis: 'reuseReports',
                sourceEncoding: 'UTF-8',
                language: 'js',
                scmDisabled: true,
                excludedProperties: []
            };

        /**
         * Copy files to the temp directory.
         * @param g The glob.
         */
        function copyFiles(g, outputDir) {
            var files = glob.sync(g, {root: '/'});
            files.forEach(function (file) {
                var destinationDirectory = outputDir;
                var fileDirectory = path.dirname(file);

                if (fileDirectory !== '.') {
                    destinationDirectory = destinationDirectory + path.sep + fileDirectory;
                }
                fs.mkdirpSync(destinationDirectory);
                var extension = path.extname(file);
                var destination = destinationDirectory + path.sep + path.basename(file);

                fs.copySync(file, destination, {replace: true});
                junit.convert(destination, destination, 'unit');
            });
        }

        /**
         * Deep merge json objects.
         * @param original The original object.
         * @param override The override object.
         * @return merged The merged object.
         */
        function mergeJson(original, override) {
            return _.merge(original, override, function (a, b, key, aParent, bParent) {
                if (_.isUndefined(b)) {
                    aParent[key] = undefined;
                    return;
                }
            });
        }

        function logArguments(message, opts) {
            grunt.log.writeln(message, opts.args);
            _.each(opts.args, function (arg) {
                grunt.log.writeln(arg);
            });
        }

        return {
            run: function (configuration) {
                var data = configuration.data;
                var opts = configuration.options({});

                if (typeof opts.outputDir === 'undefined' || opts.outputDir.length === 0) {
                    grunt.fail.fatal('No outputDir provided.');
                }

                if (typeof data.paths === 'undefined' || data.paths.length === 0) {
                    grunt.fail.fatal('No paths provided. Please provide at least one.');
                }

                var options = mergeJson(defaultOptions, configuration.options({})),
                    done = configuration.async(),
                    resultsDir = options.outputDir + path.sep;

                async.series({
                        copy: function (callback) {
                            grunt.verbose.writeln('Copying files to working directory [' + options.outputDir + ']');
                            var sourceGlobs = [],
                                testGlobs = [];
                        
                            data.paths.forEach(function (p) {
                                var jsunit = p.jsunit ? p.jsunit : '.';
                                sourceGlobs.push(jsunit);
                            });

                            sourceGlobs.forEach(function (g) {
                                copyFiles(g, opts.outputDir);
                            });

                            callback(null, 200);
                        },

                    },
                    function (err) {
                        if (err !== undefined && err !== null) {
                            grunt.fail.fatal(err);
                        }
                        done();
                    });
            }
        };
    };
})();
