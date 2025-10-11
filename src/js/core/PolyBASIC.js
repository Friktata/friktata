/******************************************************************************
 *  friktata/src/js/core/PolyBASIC.js
 * 
 */

	import { Preprocess } from "./PolyBASIC/Preprocess.js";
	import { Process } from "./PolyBASIC/Process.js";


	export const PolyBASIC = async () => {

		const	__preprocess = await Preprocess();
		const	__process = Process();

	/**************************************************************************
	 *	_exec_script()
	 *
	 */
		const	_exec_script = async (
			script_name,
			script_data
		) => {

			let result = await __preprocess.preprocess(script_name, script_data);

			if (result.status !== "success") {
				throw new Error(result.message);
			}

			let lines = __preprocess.get_lines();

			result = __process.process(lines);

			if (result.status !== "success") {
				throw new Error(result.message);
			}

			// for (let line = 0; line < lines.length; line++) {
			// 	console.log(`Line ${line}: ${JSON.stringify(lines[line])}`);
			// }

		};


		return {

			exec_script:	_exec_script

		};

	};
