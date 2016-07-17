/*
 * grunt-jsunit-sonar-generic-converter
 * https://github.com/PloughingAByteField/grunt-jsunit-sonar-generic-converter
 *
 * Copyright (c) 2013 Mischa Dasberg
 * Copyright (c) 2016 John Reynolds
 * Licensed under the MIT license.
 */
(function() {
    'use strict';

    module.exports = function (grunt) {

        // Project configuration.
        grunt.initConfig({
                jshint: {
                    all: [
                        'Gruntfile.js',
                        'tasks/*.js'
                    ],
                    options: {
                        jshintrc: '.jshintrc'
                    }
                },
                jsunitConvertor: {
                    options: {
                        outputDir: 'test/generic'
                    },
                    all: {
                        paths: [
                            {
                                jsunit: 'node_modules/angular-test-setup/results/karma/TESTS*.xml'
                            },
                            {
                                jsunit: 'data/projectx/results/karma/results.xml'
                            },
                            {
                                jsunit: 'data/karma02x/results/karma/results.xml'
                            }
                        ]
                    }
                },

                // Before generating any new files, remove any previously-created files.
                clean: {
                    options: {
                        force: true
                    },
                    tests: ['test/generic'],
                    install: ['lib']
                },

                shell: {
                    target: {
                        command: 'node_modules/jasmine-node/bin/jasmine-node test/*Spec.js'
                    }
                }
            }
        );

        // Actually load this plugin's task(s).
        grunt.loadTasks('tasks');

        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-shell');

        // Whenever the "test" task is run, first clean the "tmp" dir, then run this
        // plugin's task(s), then test the result.
        grunt.registerTask('test', ['clean', 'shell']);

        // By default, lint and run all tests.
        grunt.registerTask('default', ['jshint', 'test']);

    };
})();
