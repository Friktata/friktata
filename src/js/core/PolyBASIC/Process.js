/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/Process.js
 * 
 */

	import { RouterConfig } from "./../../config/Router.config.js";

	import { Helpers } from "./../Helpers.js";
	import { Router } from "./../Router.js";

	import { Parser } from "./Parser.js";


	export const Process = async () => {

		const	__router_config = RouterConfig;

		const	__helpers = Helpers();
		const	__router = await Router();

		const	__parser = Parser();

		let		__scripts = [];
		let		_lines = [];

		let		__working_dir = "";


	/**************************************************************************
	 *	__include_script()
	 */
		const __include_script = async (
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

			__working_dir = response.path;

			if (__working_dir.trim() !== "") {
				script_base = `${__router_config['page_path']}/xxxx/${__working_dir}/${script_name}`;
			}
			else {
				script_base = `${__router_config['page_path']}/xxxx/${script_name}`;
			}
			
			if (__scripts.includes(script_base)) {
				return __helpers.err_object(`Error in __include_script(): File ${script_base} included more than once`);
			}

			let script_data = await __router.fetch_page(script_base);

			if (script_data === false) {
				return __helpers.err_object(`Error in __include_script(): Error loading script ${script_base}`);
			}

			__scripts[script_base] = [];

			return await __process_script(script_base, script_data);

		};


	/**************************************************************************
	 *	__process_directive()
	 *
	 */
		const __process_directive = async (
			tokens
		) => {

			if (tokens[2] === "@include") {
				if (tokens.length < 4) {
					return __helpers.err_object("__process_directive(): The @include directive expects at least 1 parameter");
				}

				let script_name = __helpers.strip_quotes(tokens[3]);

				let result = await __include_script(script_name);

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
	 *	__process_tokens()
	 *
	 */
		const	__process_tokens = async (
			tokens
		) => {

			if (tokens[2].substring(0, 1) === '@') {
				return await __process_directive(tokens);
			}

			return {
				'status': "success",
				'tokens': tokens
			};

		};
	
	/**************************************************************************
	 *	__process_script()
	 *
	 */
		const	__process_script = async (
			script_path,
			script_data,
		) => {

			const result = __parser.get_lines(script_path, script_data);

			if (result.status !== "success") {
				return result;
			}

			const lines = result.lines;

			for (let line = 0; line < lines.length; line++) {

				let result = __parser.get_tokens(lines[line]);

				if (result.status !== "success") {
					return result;
				}

				const tokens = result.tokens;
				
				if (tokens.length < 2) {
					continue;
				}

				result = await __process_tokens(tokens);

				if (result.status !== "success") {
					return result;
				}

				if (result.tokens !== false) {
					console.log(`>>> Adding to ${script_path} ${result.tokens}: `)
					_lines.push(tokens);
				}
				
			}

			return {
				'status': "success"
			};

		};


	/**************************************************************************
	 *	_create_process()
	 * 
	 */
		const	_create_process = async (
			script_path,
			script_data
		) => {

			return await __process_script(script_path, script_data);

		};


		return {

			create_process:		_create_process,
			get_lines:			function () {
				return _lines
			}

		};

	};

