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
	 *	__preprocess_function_signature
	 */
		function __preprocess_function_signature(line) {
			let result = '';
			let stack = [];
			let i = 0;

			const isIdentifierChar = c => /[A-Za-z0-9_\->]/.test(c);

			while (i < line.length) {
				const char = line[i];

				if (char === '(') {
					let j = i - 1;
					
					while (j >= 0 && /\s/.test(line[j])) {
						j--;
					}

					let idEnd = j;
					
					while (j >= 0 && isIdentifierChar(line[j])) {
						j--;
					}

					let identifier = line.slice(j + 1, idEnd + 1);

					if (identifier && /[A-Za-z_]/.test(identifier[0])) {
						result += '[';
						stack.push(']');
					} 
					else {
						result += '(';
						stack.push(')');
					}

					i++;

					continue;
				}

				if (char === ')') {
					if (stack.length > 0) {
						result += stack.pop();
					}
					else {
						result += ')';
					}

					i++;
					
					continue;
				}

				result += char;
				i++;
			}

			return result;
		};
		

	/**************************************************************************
	 *	__preprocess_function_signature()
	 *
	 */
		const __preprocess_function_signature__ = line => {

			let result = '';
			let i = 0;
			let inString = false;
			let stringChar = null;

			while (i < line.length) {
				let char = line[i];

				if (!inString && (char === '"' || char === "'" || char === '`')) {
					inString = true;
					stringChar = char;
					result += char;
					i++;

					continue;
				}

				if (inString) {
					result += char;

					if (char === stringChar && line[i - 1] !== '\\') {
						inString = false;
						stringChar = null;
					}
					i++;

					continue;
				}

				let match = line.slice(i).match(/^([a-zA-Z_]\w*)\s*\(/);

				if (match) {

					let funcName = match[1];

					result += funcName + '[';
					i += match[0].length;

					let depth = 1;
					let inner = '';

					while (i < line.length && depth > 0) {
						let c = line[i];

						if (c === '"' || c === "'" || c === '`') {
							let quote = c;

							inner += c;
							i++;

							while (i < line.length && (line[i] !== quote || line[i - 1] === '\\')) {
								inner += line[i++];
							}

							if (i < line.length) {
								inner += line[i];
							}
						}
						else if (c === '(') {
							depth++;
							inner += c;
						}
						else if (c === ')') {
							depth--;
							if (depth > 0) inner += c;
						}
						else {
							inner += c;
						}

						i++;
					}

					let processedInner = __preprocess_function_signature(inner.trim());

					if (
						/[+\-*/%<>=!&|]/.test(processedInner) &&
						!/^\(.*\)$/.test(processedInner) &&
						!/^["'`].*["'`]$/.test(processedInner) &&
						!/->/.test(processedInner)
					) {
						processedInner = `(${processedInner})`;
					}

					result += processedInner + ']';
				}
				else {
					result += char;
					i++;
				}
			}

			return result;
		};


	/**************************************************************************
	 *	__directive_include()
	 *
	 */
		const	__directive_include = async (
			script_path,
			indent,
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

			_scripts.push(script_base);

			return await __preprocess_script(script_base, script_data, (indent + 4));

		};


	/**************************************************************************
	 *	__preprocess_directive()
	 *
	 */
		const	__preprocess_directive = async (
			tokens,
			indent
		) => {

	//	The @include directive allows us to include external scriots.
	//
			if (tokens[2] === "@include") {
				if (tokens.length < 4) {
					return __helpers.err_object(`Error in ${tokens[0]} on line ${tokens[1]}: The @include directive expects at least 1 parameter`);
				}

				let script_name = __helpers.strip_quotes(tokens[3]);

				let result = await __directive_include(script_name, indent);

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
			tokens,
			indent
		) => {

	//	Some pre-processing - we want to execute preprocessor directives and
	//	remove those lines before we build the executable process.
	//
			if (tokens[2].substring(0, 1) === '@') {
				return await __preprocess_directive(tokens, indent);
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
			indent = 4
		) => {

			__helpers.log(`>>> ${" ".repeat(indent)}Preprocessing script ${script_path} (${script_data.length} bytes)`);

			const result = __parser.get_lines(script_path, script_data);

			if (result.status !== "success") {
				return result;
			}

			const lines = result.lines;

			for (let line = 0; line < lines.length; line++) {

				let new_line = __preprocess_function_signature(lines[line]);

				lines[line] = new_line;

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
				// if (tokens.length < 2) {
				// 	continue;
				// }

				result = await __preprocess_tokens(tokens, indent);

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

			let response = await __preprocess_script(script_path, script_data);

			if (response.status !== "success") {
				return response;
			}

			__helpers.log(`>>>`);
			__helpers.log(`>>> Done, processed ${_scripts.length + 1} scripts`);

			return response;

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
			},

			flush:				function() {
				_scripts = [];
				_lines = [];
			}

		};

	};

