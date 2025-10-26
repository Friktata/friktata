/******************************************************************************
 *  friktata/src/js/core/PolyBASIC.js
 * 
 */

	import { Helpers } from "./Helpers.js";

	import { Preprocess } from "./PolyBASIC/Preprocess.js";
	import { Process } from "./PolyBASIC/Process.js";
	import { Runtime } from "./PolyBASIC/Runtime.js";


	export const PolyBASIC = async () => {

		const	__helpers = Helpers();

		const	__preprocess = await Preprocess();
		const	__process = Process();
		const	__runtime = Runtime();
		

	/**************************************************************************
	 *	_exec_script()
	 *
	 */
		const	_exec_script = async (
			script_name,
			script_data,
			magic = false
		) => {

			__helpers.log(`>>> Preprocessing scripts...`);
			__helpers.log(`>>>`);

			__preprocess.flush();
			let result = await __preprocess.preprocess(script_name, script_data);

			if (result.status !== "success") {
				throw new Error(result.message);
			}

			let lines = __preprocess.get_lines();

			result = __process.process(lines);

			if (result.status !== "success") {
				throw new Error(result.message);
			}

			__helpers.log(`>>>`);
            __helpers.log(`>>> Environment prepared and ready for execution:`);
			__helpers.log(`>>>`);

			__runtime.reset();
			window.__runtime = __runtime;

			return __runtime.execute(result.proc, 4, false, magic);

		};


		return {

			exec_script:	_exec_script

		};

	};
