/******************************************************************************
 *  friktata/src/js/core/PolyBASIC.js
 * 
 */

	import { Parser } from "./PolyBASIC/Parser.js";


	export const PolyBASIC = (
		script_name,
		script_data
	) => {

		const	__parser = Parser();


		const	__initialise = () => {

			console.log(`Parsing script: ${script_name}:\n\n${script_data}`);

		};


		__initialise();


		return {

		};

	};
