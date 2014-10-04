## ![topcoder](http://www.topcoder.com/favicon.ico)  Serenity Grunt module for Swagger validation

### Initial version

This is an initial public release.

### What is grunt-swagger-tools?

This software is a [NodeJS](http://nodejs.org) application.

It is intended to be use for rapid testing and validation of Swagger Specification file in [version 1.2](https://github.com/wordnik/swagger-spec/blob/master/versions/1.2.md) or [version 2.0](https://github.com/reverb/swagger-spec/blob/master/versions/2.0.md) document format.

The validation process is simplified with the use of this [Swagger tool](https://github.com/apigee-127/swagger-tools) .

It is design to be run with [npm](https://www.npmjs.org/package/npm) using `npm run-script {XXXX};` where XXXX is one of demo, test, nolog.

This initial release also supports running [grunt-swagger-tools](https://github.com/topcoderinc/grunt-swagger-tools) with [grunt](https://github.com/gruntjs/grunt) .

### How to install

* install [bower](https://github.com/bower/bower)

 `npm install -g bower`

* install [grunt-cli](https://github.com/gruntjs/grunt)

 `npm install -g grunt-cli`

* install [grunt](https://github.com/gruntjs/grunt)

 `npm install grunt`

* install dependencies

 `npm install`

### How to test

* test with npm

 `npm test`

* test with grunt

 `grunt test`

### Test with JSON logs

* test with npm

 `npm run-script demo`

* test with grunt

 `grunt demo`

### Test without JSON logs

* test with npm

 `npm run-script nolog`

* test with grunt

 `grunt nolog`

### How to use it to test your Swagger document?

* there is a demo file Gruntfile.js update it to suite your needs.

 ```
var swagger_testfiles = {

    // for 1.2 Swagger Specification file
    version_1 : [
        './examples/1.2/api/api-doc.json',
        './examples/1.2/api/weather.json'
    ],

    // for 2.0 Swagger Specification file
    version_2 : [
        './examples/2.0/api/swagger.json',
        ''
    ],

    // YAML version of a 2.0 Swagger Specification file
    version_3 : [
        './examples/2.0/api/swagger.yaml',
        ''
   ]
};

    ```

### Here is a sample grunt task name 'yamlTest'

* on top of Gruntfile.js, add the following

 ```
  var re;
  var swagger;
  var swagger_file = __dirname + '/PATH/TO/YOUR/SWAGGER.yaml';

    ```

* at the bottom of Gruntfile.js, add something like

 ```
  // should be >= 0.10.0
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // yaml tester for ./PATH/TO/YOUR/SWAGGER.yaml
  grunt.task.registerTask('yamlTest', 'Test Swagger spec file', function() {

	// load the grunt-swagger-tools >= 0.1.1
	try {
		swagger = require('grunt-swagger-tools')();

		// Setup 2.0 Swagger spec compliant using YAML format
		swagger.validator.set('fileext', '.yaml');

		// No logging of loaded YAML data
		swagger.validator.set('log', 'true');

		// Run the validator on file at swagger_file
		console.log('YAML Test for file: ' + swagger_file + '\n');
		re = swagger.validator.Validate(swagger_file, undefined, {version: '2.0'});

	} catch (e) { re = e.message; }

	// If has error, result in console
	console.log('YAML 2.0 RESULT: ' + re + '\n');
  });

    ```

### License

[MIT](https://github.com/topcoderinc/grunt-swagger-tools/blob/master/LICENSE)

### Current status

The current version of this software is intended to be use only on [serenity](https://github.com/topcoderinc/serenity-core) project.

