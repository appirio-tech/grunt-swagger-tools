'use strict';
/*  ------------------------------------------------------------------------
 *  TITLE   : [serenity] Grunt Task for Swagger File validation
 *  PROJECT : https://community.topcoder.com/tc?module=ProjectDetail&pj=30046167&legacy=true
 * 
 *  COPILOT : _indy
 * 
 *  AUTHOR  : TMALBONPH
 *  VERSION : 1.0
 *
 *  UPDATED : added v2/swagger-validator/examples/2.0/api/swagger.yaml
 *
 *  ------------------------------------------------------------------------
 */

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

module.exports = function(grunt) {

  // Variables for testing
  var v1, v2, v3, re, swagger;
  var filename;
  var apiDoc;
  var options;

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      all: ['test/{grunt,tasks,util}/**/*.js']
    },
    jshint: {
      gruntfile_tasks: ['Gruntfile.js'],
      subgrunt: ['<%= subgrunt.all %>'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: 'nofunc',
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        node: true,
      }
    },
    watch: {
      gruntfile_tasks: {
        files: ['<%= jshint.gruntfile_tasks %>'],
        tasks: ['jshint:gruntfile_tasks']
      },
      subgrunt: {
        files: ['<%= subgrunt.all %>'],
        tasks: ['jshint:subgrunt', 'subgrunt']
      }
    },
    subgrunt: {
      all: ['index.js']
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Some internal tasks. Maybe someday these will be released.
  grunt.loadTasks('examples');

  // "npm test" runs these tasks
  grunt.registerTask('test', ['jshint']);

  // Default task. jshint, then demo
  grunt.registerTask('default', ['test', 'demo']);

  // "npm demo" runs these tasks 
  grunt.task.registerTask('demo', 'Demo with JSON logs', function(name) {
		if (name) {
			// placate
		}
		runValidator('true');
  });

  // "npm nolog" runs these tasks 
  grunt.task.registerTask('nolog', 'Demo w/o JSON logs', function(name) {
		if (name) {
			// placate
		}
		runValidator('false');
  });

  var runValidator = function(isLog) {

		// load the Swagger Validator
  		swagger = require('./index.js')();

		swagger.validator.set('fileext', '.json');

		console.log('Running Version 1.2 Demo test');

		swagger.validator.set('log', 'false');

		// setup 1.2
		swagger.validator.set('version', '1.2');
		v1 = swagger.validator.get('version');
		if (v1 !== '1.2') {
			console.log('Error in getter: version should be 1.2');
			return;
		}

		filename = swagger_testfiles.version_1[0];
		apiDoc = swagger_testfiles.version_1[1];
		options = {};

		re = swagger.validator.Validate(undefined, apiDoc, options);
		re = swagger.validator.Validate(filename, undefined, options);
		if (re) {
			// placate
		}

		swagger.validator.set('log', isLog);
		re = swagger.validator.Validate(filename, apiDoc, options);
		console.log("1.2 RESULT: " + re + "\n");

		console.log('Running Version 2.0 Demo test');

		// setup 2.0
		swagger.validator.set('version', '2.0');
		v2 = swagger.validator.get('version');
		if (v2 !== '2.0') {
			console.log('Error in getter: version should be 2.0');
			return;
		}

		filename = swagger_testfiles.version_2[0];
		apiDoc = swagger_testfiles.version_2[1];
		options = {};

		swagger.validator.set('log', 'false');
		re = swagger.validator.Validate(undefined, apiDoc, options);
		if (re) {
			// placate
		}

		swagger.validator.set('log', isLog);
		re = swagger.validator.Validate(filename, undefined, options);
		console.log("2.0 RESULT: " + re + "\n");

		// YAML test: version 2.0
		console.log('Running Version 2.0 YAML Demo test');

		filename = swagger_testfiles.version_3[0];
		apiDoc = swagger_testfiles.version_3[1];
		options = {};

		swagger.validator.set('fileext', '.yaml');
		v3 = swagger.validator.get('fileext');
		if (v3 !== '.yaml') {
			console.log('Error in getter: YAML fileext should be .yaml');
			return;
		}

		re = swagger.validator.Validate(filename, undefined, options);
		console.log("YAML 2.0 RESULT: " + re + "\n");
  };

};

