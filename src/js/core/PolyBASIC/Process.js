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
		const	__router = Router();

		const	__parser = Parser();

		let		__scripts = [];

		let		__working_dir = "";


	/**************************************************************************
	 *	__new_process()
	 *
	 */
		const	__new_process = (
			script_name,
			process_id
		) => {

			return {
				script_name:	script_name,
				id:				process_id,
				lines:			[],
				name:			[],
				data:			[],
				meta:			[],
				flags:			[]
			};

		};


	/**************************************************************************
	 *	__include_script()
	 */
		const __include_script = async (
			script_name,
			proc
		) => {

			// console.log(`>>> Importing script ${script_name}`);

			let script_path = __helpers.path_base(script_name);
			let response = __helpers.path_new(__working_dir, script_path);

			script_name = __helpers.path_name(script_name);

			if (response.status !== "success") {
				return response;
			}

			response = __helpers.path_reduce(response.path);

			if (response.status !== "success") {
				return response;
			}

			__working_dir = response.path;

			console.log(">>> Set working dir: " + __working_dir + ", script name: " + script_name);

			if (__working_dir.trim() !== "") {
				script_path = `${__router_config['page_path']}/xxxx/${__working_dir}/${script_name}`;
			}
			else {
				script_path = `${__router_config['page_path']}/xxxx/${script_name}`;
			}
			let script_data = (await __router).fetch_page(script_path);

			if (script_data === false) {
				throw new Error(`Error in __include_script(): Couldn\'t find script ${script_path}`);
			}

			console.log(`Loaded external script ${script_path}`);
			return {
				'status': "success",
				'proc': proc
			};

		};


	/**************************************************************************
	 *	__process_directive()
	 *
	 */
		const __process_directive = async (
			tokens,
			proc
		) => {

			if (tokens[2] === "@include") {
				if (tokens.length < 4) {
					return __helpers.err_object("__process_directive(): The @include directive expects at least 1 parameter");
				}

				for (let script = 3; script < tokens.length; script++) {
					let script_name = __helpers.strip_quotes(tokens[script]);

					let result = await __include_script(script_name, proc);

					if (result.status !== "success") {
						return result;
					}
				}
			}

			return {
				'status': "success",
				'proc': proc
			};

		};


	/**************************************************************************
	 *	__process_tokens()
	 *
	 */
		const	__process_tokens = async (
			tokens,
			proc
		) => {

			let	result;

			console.log(tokens);

			if (tokens[2].substring(0, 1) === '@') {
				result = await __process_directive(tokens, proc);

				if (result.status !== "success") {
					return result;
				}
			}

			return {
				'status': "success",
				'proc': proc
			};

		};
	
	/**************************************************************************
	 *	__process_script()
	 *
	 */
		const	__process_script = async (
			script_data,
			proc
		) => {

			const result = __parser.get_lines(proc.script_name, script_data);

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

				result = await __process_tokens(tokens, proc);

				if (result.status !== "success") {
					return result;
				}

				proc = result.proc;
			}

			return {
				'status': "success",
				'proc': proc
			};

		};


	/**************************************************************************
	 *	_create_process()
	 * 
	 */
		const	_create_process = async (
			script_name,
			script_data
		) => {

			const	_proc = __new_process(script_name, "root");

			return await __process_script(script_data, _proc);

		};


		return {

			create_process:		_create_process

		};

	};

