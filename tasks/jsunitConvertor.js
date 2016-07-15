(function () {
    /*
     * grunt-jsunit-sonar-generic-converter
     * https://github.com/PloughingAByteField/grunt-jsunit-sonar-generic-converter
     *
     * Copyright (c) 2015 Mischa Dasberg and contributors
     * Copyright (c) 2016 John Reynolds and contributors
     * Licensed under the MIT license.
     */

    'use strict';
    module.exports = function (grunt) {
        grunt.registerMultiTask('jsunitConvertor', 'Grunt plugin for converting jsunit reports to the sonar generic test coverage format for usage with sonar', function () {
            require('./process')(grunt).run(this);
        });
    };
})();