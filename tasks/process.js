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
                defaultOutputDir: '.tmp/sonar/',
                scmDisabled: true,
                excludedProperties: []
            };

        /**
         * Copy files to the temp directory.
         * @param g The glob.
         */
        function copyFiles(g, defaultOutputDir, targetDir) {
            var files = glob.sync(g.src.toString(), {cwd: g.cwd, root: '/'});
            files.forEach(function (file) {
                var destinationDirectory = defaultOutputDir + path.sep + targetDir;
                var fileDirectory = path.dirname(file);
                if (fileDirectory !== '.') {
                    destinationDirectory = destinationDirectory + path.sep + fileDirectory;
                }
                fs.mkdirpSync(destinationDirectory);
                var source = path.resolve(g.cwd, file);
                var extension = path.extname(file);
                var destination;
                if (targetDir === 'test') {
                    var base = path.basename(file, extension);
                    if(extension === '.js') {
                        destination = destinationDirectory + path.sep + path.basename(base.replace(/\./g, '_') + extension);
                    } else if(extension === '.feature') {
                        destination = destinationDirectory + path.sep + path.basename(base.concat(extension).replace(/\./g, '_') + '.js');
                    }
                } else {
                    destination = destinationDirectory + path.sep + path.basename(file);
                }

                fs.copySync(source, destination, {replace: true});
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

                if (typeof data.project === 'undefined') {
                    grunt.fail.fatal('No project information has been specified.');
                }

                if (typeof data.project.key === 'undefined') {
                    grunt.fail.fatal('Missing project key. Allowed characters are alphanumeric, \'-\', \'_\', \'.\' and \':\', with at least one non-digit.');
                }

                if (typeof data.project.name === 'undefined') {
                    grunt.fail.fatal('Missing project name. Please provide one.');
                }

                if (typeof data.paths === 'undefined' || data.paths.length === 0) {
                    grunt.fail.fatal('No paths provided. Please provide at least one.');
                }

                var sonarOptions = mergeJson(defaultOptions, configuration.options({})),
                    done = configuration.async(),
                    resultsDir = sonarOptions.defaultOutputDir + path.sep + 'results' + path.sep,
                    xUnitResultFile = resultsDir + 'TESTS-xunit.xml',
                    jUnitResultFile = resultsDir + 'TESTS-junit.xml',
                    itJUnitResultFile = resultsDir + 'ITESTS-xunit.xml',
                    coverageResultFile = resultsDir + 'coverage_report.lcov',
                    itCoverageResultFile = resultsDir + 'it_coverage_report.lcov';

                async.series({
                        // #1
                        mergeJUnitReports: function (callback) {
                            grunt.verbose.writeln('Merging JUnit reports');
                            xunit.merge(data.paths, xUnitResultFile, 'unit');
                            junit.convert(xUnitResultFile, jUnitResultFile, 'unit');
                            callback(null, 200);
                        },
                        // #2
                        mergeItJUnitReports: function (callback) {
                            grunt.verbose.writeln('Merging Integration JUnit reports');
                            xunit.merge(data.paths, itJUnitResultFile, 'itUnit');
                            callback(null, 200);
                        },
                        // #3
                        mergeCoverageReports: function (callback) {
                            grunt.verbose.writeln('Merging Coverage reports');
                            coverage.merge(data.paths, coverageResultFile, 'coverage');
                            callback(null, 200);
                        },
                        // #4
                        mergeItCoverageReports: function (callback) {
                            grunt.verbose.writeln('Merging Integration Coverage reports');
                            coverage.merge(data.paths, itCoverageResultFile, 'itCoverage');
                            callback(null, 200);
                        },
                        // #5
                        copy: function (callback) {
                            grunt.verbose.writeln('Copying files to working directory [' + sonarOptions.defaultOutputDir + ']');
                            var sourceGlobs = [],
                                testGlobs = [];
                        
                            data.paths.forEach(function (p) {
                                var cwd = p.cwd ? p.cwd : '.';
                                sourceGlobs.push({cwd: cwd + path.sep + p.src, src: '**/*.*'});
                                testGlobs.push({cwd: cwd + path.sep + p.test, src: '**/*.js'});
                                testGlobs.push({cwd: cwd + path.sep + p.test, src: '**/*.feature'});
                            });
                        
                            sourceGlobs.forEach(function (g) {
                                copyFiles(g, sonarOptions.defaultOutputDir, 'src');
                            });
                        
                            testGlobs.forEach(function (g) {
                                copyFiles(g, sonarOptions.defaultOutputDir, 'test');
                            });
                            callback(null, 200);
                        },
                      }
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
