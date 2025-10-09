/******************************************************************************
 *  friktata/src/js/core/Controller.js
 * 
 */

    import { Display } from "./Display.js";
    import { Router } from "./Router.js";

    import { PolyBASIC } from "./PolyBASIC.js";


    export const Controller = () => {

        const   __display = Display();
        const   __router = Router();

        const   __polybasic = PolyBASIC();


/**************************************************************************
 * Test data
 */
        const test_source = `
            10 print "root line";

            line_one 10 print "inside line_one"; // some comments here
                11 print "still 
                            inside";            // and here
                    subblock 10 print "nested";
                    end subblock;
                20 print "back in line_one";
            end line_one;
            
            30 print "back in root"; // comment test
        `;


        // let lines = __polybasic.parse_lines("test_script", test_source);

        // for (let line = 0; line < lines.length; line++) {
        //     console.log(`Line ${line}: ${lines[line]}`);
        // }

    };
