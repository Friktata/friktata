/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/Preprocess.js
 * 
 */

	import { PolyBASICConfig } from "../../config/PolyBASIC.config.js";
	import { RouterConfig } from "./../../config/Router.config.js";

	import { Helpers } from "./../Helpers.js";
	import { Router } from "./../Router.js";

	import { Parser } from "./Parser.js";


	export const Preprocess = async () => {

		const	__router_config = RouterConfig;
		const	__polybasic_config = PolyBASICConfig;

		const	__helpers = Helpers();
		const	__router = await Router();

		const	__parser = Parser();

		let		__working_dir = "";
		let		__include_path = false;

		let		_scripts = [];
		let		_lines = [];


	/**************************************************************************
	 *	__directive_include()
	 */
		const	__directive_include = async (
			script_path,
			separator = "/"
		) => {

			let	script_base = __helpers.path_base(script_path, separator);
			
			let response = __helpers.path_new(__working_dir, script_base, separator);

			if (response.status !== "success") {
				return response;
			}

			let script_name = __helpers.path_name(script_path,separator);
			response = __helpers.path_reduce(response.path, separator);

			if (response.status !== "success") {
				return response;
			}

			if (__include_path === false) {
				__include_path = __polybasic_config['include_path'];
			}
			__working_dir = response.path;

			if (__working_dir.trim() !== "") {
				script_base = `${__router_config['page_path']}/${__include_path}/${__working_dir}/${script_name}`;
			}
			else {
				script_base = `${__router_config['page_path']}/${__include_path}/${script_name}`;
			}
			
			if (_scripts.includes(script_base)) {
				return __helpers.err_object(`Error in __include_script(): File ${script_base} included more than once`);
			}

			let script_data = await __router.fetch_page(script_base);

			if (script_data === false) {
				return __helpers.err_object(`Error in __include_script(): Error loading script ${script_base}`);
			}

			_scripts[script_base] = [];

			return await __preprocess_script(script_base, script_data);

		};


	/**************************************************************************
	 *	__preprocess_directive()
	 *
	 */
		const	__preprocess_directive = async (
			tokens
		) => {

	//	The @include directive allows us to include external scriots.
	//
			if (tokens[2] === "@include") {
				if (tokens.length < 4) {
					return __helpers.err_object(`Error in ${tokens[0]} on line ${tokens[1]}: The @include directive expects at least 1 parameter`);
				}

				let script_name = __helpers.strip_quotes(tokens[3]);

				let result = await __directive_include(script_name);

				if (result.status !== "success") {
					return result;
				}
			}

			return {
				'status': "success",
				'tokens': false
			};

		};


	/**************************************************************************
	 *	__preprocess_tokens()
	 *
	 */
		const	__preprocess_tokens = async (
			tokens
		) => {

	//	Some pre-processing - we want to execute preprocessor directives and
	//	remove those lines before we build the executable process.
	//
			if (tokens[2].substring(0, 1) === '@') {
				return await __preprocess_directive(tokens);
			}

			return {
				'status': "success",
				'tokens': tokens
			};

		};
	

	/**************************************************************************
	 *	__preprocess_script()
	 *
	 */
		const	__preprocess_script = async (
			script_path,
			script_data,
		) => {

	//	The get_lines() method will take the script_data and return an
	//	array of lines.
	//
			const result = __parser.get_lines(script_path, script_data);

			if (result.status !== "success") {
				return result;
			}

			const lines = result.lines;

			for (let line = 0; line < lines.length; line++) {

	//	The get_rokens() method takes a line and returns an array
	//	of tokens.
	//
				let result = __parser.get_tokens(lines[line]);

				if (result.status !== "success") {
					return result;
				}

				const tokens = result.tokens;
				
	//	The first token (0) is the script name, the next token is
	//	the line actual line number the line occupies in the source
	//	script.
	//
	//	So if we only have two tokens this is an empty line and can
	//	be discarded.
	//
				if (tokens.length < 2) {
					continue;
				}

				result = await __preprocess_tokens(tokens);

				if (result.status !== "success") {
					return result;
				}

	//	Each valid line of code is pushed to _lines.
	//
				if (result.tokens !== false) {
					// console.log(`>>> Adding to ${script_path} ${result.tokens}: `)
					_lines.push(tokens);
				}
				
			}

			return {
				'status': "success"
			};

		};


	/**************************************************************************
	 *	_preprocess()
	 * 
	 */
		const	_preprocess = async (
			script_path,
			script_data
		) => {

	//	__process_scripts() will generate the _lines array.
	//
			return await __preprocess_script(script_path, script_data);

		};


		return {

			preprocess:			_preprocess,
			
			get_scripts:		function () {
				return _scripts
			},
			
			get_lines:			function () {
				return _lines
			},
			
			get_proc:			function () {
				return _proc
			}

		};

	};

