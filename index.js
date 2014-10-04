'use strict';
/*  ------------------------------------------------------------------------
 *  TITLE   : [serenity] Grunt Task for Swagger File validation
 *  PROJECT : https://community.topcoder.com/tc?module=ProjectDetail&pj=30046167&legacy=true
 * 
 *  COPILOT : _indy
 * 
 *  AUTHOR  : TMALBONPH
 *  VERSION : 1.1
 *
 *  UPDATED : Added the try - catch block in swagger.validator.Validate()
 *  ------------------------------------------------------------------------
 */

var swaggerTools = require('swagger-tools');

// this validator object
var swagger = {};
swagger.validator = {};

// this validator sets
swagger.validator.sets = [];

/**
 * Retrieved the object from Sets.
 *
 * @param name
 * 			the Name of Object to retrieved
 *
 * @return the Object
 * 			or null if not on validator Sets
 */
function fn_swagger_validator_get(name) {
	var value = null;
	if ('string' === typeof name) {
		if (swagger.validator.sets[name] !== undefined) {
			value = swagger.validator.sets[name];
		}
	}
	return value;
}
swagger.validator.get = fn_swagger_validator_get;

/**
 * Save object into validator Sets.
 *
 * @param name
 * 			the Name of Object to save
 * @param value
 * 			the Value to Save into Named object.
 */
function fn_swagger_validator_set(name, value) {
	if ('string' !== typeof name) {
		return;
	}
	swagger.validator.sets[name] = (value !== undefined) ? value : null;
}
swagger.validator.set = fn_swagger_validator_set;


/**
 * Helper method to check if the given parameter is of type String.
 *
 * @param values
 * 			the Object to check
 * @return the given
 * 			if it is of type string otherwise empty string.
 */
function fn_swagger_validator_getStringParameter(values) {
	if ('string' === typeof values) {
		if (values !== null) {
			return values;
		}
	}
	return '';
}
swagger.validator.getStringParameter = fn_swagger_validator_getStringParameter;

/**
 * Helper method to check if two given parameter were of type String and the same
 */
function fn_swagger_validator_compareString(ls, rs) {
	if (typeof ls === 'string') {
		if (typeof rs === 'string') {
			return ls === rs;
		}
	}
	return false;
}
swagger.validator.compareString = fn_swagger_validator_compareString;

// Default version on Sets is 2.0
//
swagger.validator.set('version', '2.0');

// Default fileext is JSON
//
swagger.validator.set('fileext', '.json');

// Default is not to emit JSON data
//
swagger.validator.set('log', 'false');

/**
 * Filename validator.
 * @param filename
 * 			the Filename to validate
 * @param fileext
 * 			the File extension either '.json', '.yaml' or '.xml'
 */
function fn_swagger_validator_ValidateFileName(filename, fileext) {
	if ('string' !== typeof filename) {
		return '';
	}
	if (filename === null || filename.length < 1) {
		return '';
	}
	if (filename.lastIndexOf('.') === -1) {
		return filename + fileext;
	}
	return filename;
}

// Module Initialization

function fn_swagger_validator_Init() {

	/**
	 * Validate a V2 Swagger file.
	 *
	 * Adapted from 'git@github.com:apigee-127/swagger-tools/blob/master/examples/2.0/index.js'
	 * https://github.com/apigee-127/swagger-tools/commit/b86609275d60047298bfd0a9fc425e44e0dac6d0
	 */
//@private
	var v2_Validator = function(isLog, filename, fileext, p_error) {

		p_error[0] = "";
		var fname = fn_swagger_validator_ValidateFileName(filename, fileext);
		if (fname.length < 1) {
			p_error[0] = "Invalid v2 Swagger file";
			return false;
		}

		// Validate the Swagger document
		var swaggerDoc = require(fname);

		if (isLog) {
			console.log("swaggerDoc: " + JSON.stringify(swaggerDoc) + "\n");
		}

		var result = swaggerTools.specs.v2.validate(swaggerDoc);

		if (typeof result !== 'undefined') {
			if (result.errors.length > 0) {
				console.log('The server could not start due to invalid Swagger document...');

				console.log('');

				console.log('Errors');
				console.log('------');

				result.errors.forEach(function (err) {
					console.log('#/' + err.path.join('/') + ': ' + err.message);
				});

				console.log('');
			}

			if (result.warnings.length > 0) {
				console.log('Warnings');
				console.log('--------');

				result.warnings.forEach(function (warn) {
					console.log('#/' + warn.path.join('/') + ': ' + warn.message);
				});
			}

			return  (result.errors.length > 0) ? false : true;
		}

		return true;
	};

	/**
	 * Validate a V1 Swagger file.
	 *
	 * Adapted from 'git@github.com:apigee-127/swagger-tools/blob/master/examples/1.2/index.js'
	 * https://github.com/apigee-127/swagger-tools/commit/b86609275d60047298bfd0a9fc425e44e0dac6d0
	 */
//@private
	var v1_Validator = function(isLog, filename, apiDoc, fileext, p_error) {

		p_error[0] = "";
		var fname = fn_swagger_validator_ValidateFileName(filename, fileext);
		if (fname.length < 1) {
			p_error[0] = "Invalid 1.X Swagger file (API DOC)";
			return false;
		}
		var apName = fn_swagger_validator_ValidateFileName(apiDoc, fileext);
		if (apName.length < 1) {
			p_error[0] = "Invalid 1.X Swagger file (DECL DOC)";
			return false;
		}

		// The Swagger Resource Listing Document (require it, build it programmatically, fetch it from a URL, ...)
		var apiDocJson = require(fname);

		if (isLog) {
			console.log("apiDocJson: " + JSON.stringify(apiDocJson) + "\n");
		}

		// The Swagger API Declaration Documents (require them, build them programmatically, fetch them from a URL, ...)
		var apiDeclarations = [
			require(apName)
		];

		if (isLog) {
			console.log("apiDeclarations: " + JSON.stringify(apiDeclarations) + "\n");
		}

		// Validate the Swagger documents
		var result = swaggerTools.specs.v1.validate(apiDocJson, apiDeclarations);
		var errorCount = 0;

		if (typeof result !== 'undefined') {
			console.log('The server could not start due to invalid Swagger document...');

			console.log('');

			if (result.errors.length > 0) {
				errorCount += result.errors.length;

				console.log('Errors');
				console.log('------');

				result.errors.forEach(function (err) {
					console.log('#/' + err.path.join('/') + ': ' + err.message);
				});

				console.log('');
			}

			if (result.warnings.length > 0) {
				console.log('Warnings');
				console.log('--------');

				result.warnings.forEach(function (warn) {
					console.log('#/' + warn.path.join('/') + ': ' + warn.message);
				});

				console.log('');
			}

			if (result.apiDeclarations) {

				result.apiDeclarations.forEach(function (adResult, index) {

					var errorHeader = 'API Declaration (' + apiDeclarations[index].resourcePath + ') Errors';
					var warningHeader = 'API (' + apiDeclarations[index].resourcePath + ') Warnings';

					if (adResult.errors.length > 0) {
						errorCount += adResult.errors.length;

						console.log(errorHeader);
						console.log(new Array(errorHeader.length + 1).join('-'));

						adResult.errors.forEach(function (err) {
						console.log('#/' + err.path.join('/') + ': ' + err.message);
						});

						console.log('');
					}

					if (adResult.warnings.length > 0) {
						console.log(warningHeader);
						console.log(new Array(warningHeader.length + 1).join('-'));

						adResult.warnings.forEach(function (warn) {
						console.log('#/' + warn.path.join('/') + ': ' + warn.message);
						});

						console.log('');
					}
				});
			}
			return (errorCount > 0) ? false : true;
		}
		return true;
	};

	/**
	 * The Swagger Validator.
	 *
	 * @param filename
	 * 			the Swagger filename to validate
	 * @param apiDoc
	 * 			the version 1.X Swagger API filename to validate
	 * @param options
	 * 			the optional options, if not specified, will use values from Sets.
	 */
	swagger.validator.Validate = function(filename, apiDoc, options) {

		// Check file version
		var version = swagger.validator.get('version');

		// file must be valid
		if (fn_swagger_validator_getStringParameter(filename).length < 1) {
			if (version.indexOf("2.0") !== -1) {
				console.log("Invalid 2.0 Swagger API file '" + filename + "'");
			} else {
				console.log("Invalid 1.2 Swagger API file '" + filename + "'");
			}
			return false;
		}
		console.log("Reading (" + version + "): '" + filename + "'\n");

		// if this is True, will assume filename is a Swagger.json compliant to v2.0, otherwise 1.2
		var isV2 = swagger.validator.compareString('2.0', version);

		// if options exist, use values in it.
		if (options !== undefined && ('string' === typeof options.version)) {
			version = options.version;
			isV2 = swagger.validator.compareString('2.0', version);
		}
		if (!isV2) {
			version = '1.2';
		}
		// Check file extension
		var fileext = swagger.validator.get('fileext');

		// if this is True, will assume filename is a YAML, otherwise Swagger.json
		var isYAML = false;

		// if options exist, use values in it.
		if (options !== undefined && ('string' === typeof options.fileext)) {
			fileext = options.fileext;
		}
		fileext = fileext || '';
		fileext = fileext.toLowerCase();
		if (fileext.indexOf('yaml') !== -1) {
			isYAML = true;
			fileext = '.yaml';
		} else {
			if (fileext.indexOf('xml') !== -1) {
				isYAML = true;
				fileext = '.xml';
			} else {
				fileext = '.json';
			}
		}

		// If file has no extension, use a .JSON for Swagger file or .YAML for YAML file
		if (filename.lastIndexOf('.') === -1) {
			filename = filename + fileext;
		}
		// Which validator to run?
		var p_error = [];
		var isValid = false;
		var status = "not valid";

		var isLog = fn_swagger_validator_compareString('true', swagger.validator.get('log'));

		p_error[0] = "";
		try {
			if (isV2) {
				isValid = v2_Validator(isLog, filename, fileext, p_error);
			}
			else {
				// API doc file must be valid
				if (fn_swagger_validator_getStringParameter(apiDoc).length < 1) {
					console.log("Invalid v1 API Swagger filename: '" + apiDoc + "'");
					return false;
				}
				isValid = v1_Validator(isLog, filename, apiDoc, fileext, p_error);
			}
		} catch (e) {
			p_error[0] = e.message;
			isValid = false;
		}
		if (isValid) {
			status = "valid";
		}
		// Check the internal Error messages
		var s_error = p_error[0];
		if (('string' === typeof s_error) && (s_error.length > 0)) {
			console.log("ERROR: " + s_error);
			return false;
		}

		// Log the file status
		console.log("File '" + filename + "' is " + status + " " + version + " Swagger '" + fileext + "' file.\n");

		// return status to caller
		return isValid;
	};

	return swagger;

} /*fn_swagger_validator_Init() */


// Exposed this module
module.exports = function() {
	return fn_swagger_validator_Init();
};

/*
 *EOF: index.js
 */

