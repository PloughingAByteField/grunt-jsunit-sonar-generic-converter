# grunt-jsunit-sonar-generic-converter
[![Build Status](https://travis-ci.org/PloughingAByteField/grunt-jsunit-sonar-generic-converter.svg?branch=master)](https://travis-ci.org/PloughingAByteField/grunt-jsunit-sonar-generic-converter) [![npm version](https://img.shields.io/node/v/grunt-jsunit-sonar-generic-converter.svg)](https://github.com/PloughingAByteField/grunt-jsunit-sonar-generic-converter) [![dependency Status](https://img.shields.io/david/PloughingAByteField/grunt-jsunit-sonar-generic-converter.svg)](https://david-dm.org/PloughingAByteField/grunt-jsunit-sonar-generic-converter) [![devDependency Status](https://img.shields.io/david/dev/PloughingAByteField/grunt-jsunit-sonar-generic-converter.svg)](https://david-dm.org/PloughingAByteField/grunt-jsunit-sonar-generic-converter#info=devDependencies) [![npm downloads](https://img.shields.io/npm/dm/grunt-jsunit-sonar-generic-converter.svg?style=flat-square)](https://www.npmjs.com/package/grunt-jsunit-sonar-generic-converter)

> Grunt plugin for converting jsunit reports to the sonar generic test coverage format for usage with sonar.

DO NOT USE YET -- NOT COMPLETE OR WORKING -- IN SETUP

Both karma and protractor can output jsunit reports, this plugin can convert these reports into the format expected by the sonar Generic Test Coverage plugin.

Details on the <a href="http://docs.sonarqube.org/display/PLUG/Generic+Test+Coverage">Sonar Generic Test Coverage</a> format and plugin.

This plugin has been created due to jsunit reporting no longer being supported by sonarsource see <a href="http://docs.sonarqube.org/display/PLUG/JavaScript+Unit+Tests+Execution+Reports+Import">JavaScriptUnit Tests Execution Reports Import</a>.

This has been forked from the <a href="https://github.com/mdasberg/grunt-karma-sonar">mdasberg/grunt-karma-sonar</a> project. If your project is solely js based then you can investigate this.

This is intended for use in a multi language project with one pass through sonar and one of those languages being javascript.

The targeted sonar server version is 5.6 LTS onwards.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jsunit-sonar-generic-converter --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jsunit-sonar-generic-converter');
```

## The "jsunitConvertor" task

### Overview
In your project's Gruntfile, add a section named `jsunitConvertor` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  jsunitConvertor: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.dynamicAnalysis
Type: `String`
Default: 'reuseReports'

Should be the sonar.property dynamicAnalysis

#### options.sourceEncoding
Type: `String`
Default: 'UTF-8'

Should be the sonar.property sourceEncoding

#### options.language
Type: `String`
Default: 'js'

Should be the sonar.property language (Starting with SonarQube 4.2, multi-language projects are supported. To enable this, set the value to null)

#### options.scmDisabled
Type: `String`
Default: 'true'

Should be the sonar.property scmDisabled

#### options.defaultOutputDir
Type: `String`
Default: '.tmp/sonar/'

Should be the location where the jsunitConvertor plugin will put it's temporary files.

#### options.excludedProperties
Type: `Array`
Default: []

Should be the indicator for performing a dry run.

#### options.dryRun
Type: `Boolean`
Default: false

#### options.runnerProperties
Type: `Object`

Should be the list of key(`sonar key`) value pairs.

```js
runnerProperties: {
    'sonar.links.homepage': 'https://github.com/PloughingAByteField/grunt-jsunit-sonar-generic-converter',
    'sonar.branch': 'master'
}
```

Should be a list of sonar properties to exclude

#### options.instance.hostUrl
Type: `String`
Default: 'http://localhost:9000'

Should be the sonar.property host.url

#### options.instance.jdbcUrl
Type: `String`
Default: 'jdbc:h2:tcp://localhost:9092/sonar'

Should be the sonar.property jdbc.url

#### options.instance.jdbcUsername
Type: `String`
Default: 'sonar'

Should be the sonar.property jdbc.username

#### options.instance.jdbcPassword
Type: `String`
Default: 'sonar'

Should be the sonar.property jdbc.password

#### options.instance.login
Type: `String`
Default: 'admin'

Should be the sonar.property login

#### options.instance.password
Type: `String`
Default: 'admin'

Should be the sonar.property password

#### options.debug
Type: `Boolean`
Default: 'false'

If true sonar-runner debug logging will be turned on. 

#### project
Type: `Object`,
Mandatory: true

Should be the project information for sonar

#### project.key
Type: `String`
Mandatory: true`

Should be the project key for sonar 

#### project.name
Type: `String`
Mandatory: true`

Should be the project name for sonar
 
#### project.version
Type: `String`
 
Should be the project version for sonar 

#### paths
Type: `Array`
 
Should be the paths that contain the code, tests and results

#### paths[].cwd
Type: `String`
Default: '.'
 
Should be the current working directory that contain the source, tests and results folders are located

#### paths[].src
Type: `String`
 
Should be the directory containing the sources within the cwd.

#### paths[].test
Type: `String`
 
Should be the directory containing the tests within the cwd.

#### paths[].reports
Type: `Object`
 
Should be the object containing the reports.

#### paths[].reports.unit
Type: `String` or `Object` ie: {src: '...', framework: 'jasmine'} (Supported frameworks are: cucumber, jasmine/jasmine2(default))
 
Should be the location of the karma-junit-reporter report within the cwd.

#### paths[].reports.coverage
Type: `String`
 
Should be the glob for the lcov.info files within the cwd.

#### paths[].reports.itUnit
Type: `String` or `Object` ie: {src: '...', framework: 'jasmine'} (Supported frameworks are: cucumber, jasmine/jasmine2(default))

Should be the location of the protractor report within the cwd.

#### paths[].reports.itCoverage
Type: `String`
 
Should be the glob for the integration test lcov.info files within the cwd.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  jsunitConvertor: {
    options: {
    
    },
    your_target: {

      paths: [
        {
          cwd: '...', // the current working directory'
          src: '...', // the source directory within the cwd
          test: '...', // the test directory within the cwd
          reports: {
              unit: '../path/result.xml', // the result file within the cwd
              coverage: '../path/**/lcov.info', // the glob for lcov files'
              itCoverage: '../path/**/lcov.info' // the glob for integration lcov files'
          }
        },
        {
          cwd: '...', // the current working directory'
          src: '...', // the source directory within the cwd
          test: '...', // the test directory within the cwd
          reports: {
              unit: '../path/result.xml', // the result file within the cwd
              coverage: '../path/**/lcov.info', // the glob for lcov files'
              itCoverage: '../path/**/lcov.info' // the glob for integration lcov files'
          }
      ],
      exclusions: []
    }
  }
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  jsunitConvertor: {
    options: {
      defaultOutputDir: '.tmp/sonar/custom_options/',
      instance: {
        hostUrl : 'http://localhost:20001',
        jdbcUrl : 'jdbc:h2:tcp://localhost:20003/sonar',
        login: 'admin',
        password: 'admin'
      }
    },
    your_target: {
      project: {
        key: 'grunt-sonar',
        name: 'Grunt sonar plugin',
        version: '0.2.13'
      },
      paths: [...],
      exclusions: []
    }
  }
})
```

Deciding Where To Get Sonar-runner from
-------------------------------

By default, this package will download sonar-runner from `https://repository.sonatype.org/service/local/artifact/maven/redirect?r=central-proxy&g=org.codehaus.sonar.runner&a=sonar-runner-dist&v=LATEST&p=zip`, 
but only when sonar-runner is not available on the path.

##### Downloading from a custom URL

If for some reason sonatype is down, or the Great Firewall is blocking sonatype, you may need to use
a download mirror url. To set a mirror, set npm config property `sonarrunner_cdnurl`.
Default is ``.

```shell
npm install grunt-jsunit-sonar-generic-converter --sonarrunner_cdnurl=http://some-mirror.org/path/to/downloads
```

Or add property into your `.npmrc` file (https://www.npmjs.org/doc/files/npmrc.html)

```
sonarrunner_cdnurl=http://some-mirror.org/path/to/downloads
```

Another option is to use PATH variable `SONARRUNNER_CDNURL`.
```shell
SONARRUNNER_CDNURL=http://some-mirror.org/path/to/downloads npm install grunt-jsunit-sonar-generic-converter
```

Note: It will try to find `sonar-runner-dist.zip` in the cdn url.

##### Downloading from a custom Dir

If for some reason sonatype is down, or the Great Firewall is blocking sonatype, you may need to use
a download mirror directory. To set a mirror, set npm config property `sonarrunner_cdndir`.
Default is ``.

```shell
npm install grunt-jsunit-sonar-generic-converter --sonarrunner_cdndir=/some/path/downloads
```

Or add property into your `.npmrc` file (https://www.npmjs.org/doc/files/npmrc.html)

```
sonarrunner_cdndir=/some/path/downloads
```

Another option is to use PATH variable `SONARRUNNER_CDNDIR`.
```shell
SONARRUNNER_CDNDIR=/some/path/downloads npm install grunt-jsunit-sonar-generic-converter
```

Note: It can be the case that there are multiple versions available at the download mirror. 
If this is the case the latest version will be used.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

