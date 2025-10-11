/******************************************************************************
 *  friktata/src/js/core/PolyBASIC.js
 * 
 */

	import { Process } from "./PolyBASIC/Process.js";


	export const PolyBASIC = async () => {

		const	__process = await Process();

	/**************************************************************************
	 *	_exec_script()
	 *
	 */
		const	_exec_script = async (
			script_name,
			script_data
		) => {

			let result = await __process.create_process(script_name, script_data);

			if (result.status !== "success") {
				throw new Error(result.message);
			}

			let lines = __process.get_lines();

			for (let line = 0; line < lines.length; line++) {
				console.log(`Line ${line}: ${lines[line]}`);
			}

		};


		return {

			exec_script:	_exec_script

		};

	};
