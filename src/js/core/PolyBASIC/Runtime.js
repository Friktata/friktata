/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/Runtime.js
 * 
 */

    import { Helpers } from "./../Helpers.js";


    export const Runtime = () => {

        const   __helpers = Helpers();

        const   __indent_increment = 4;


    /**************************************************************************
     *  _execute()
     * 
     */
        const   _execute = (
            proc,
            indent = 0
        ) => {

            let keys = Object.keys(proc.code);
            let path = proc.id;

            if (proc.parent !== false) {
                path = `${proc.path}.${proc.id}`;
            }

            __helpers.log(`>>> ${" ".repeat(indent)}Executing block: ${path}`);

            for (let line = 0; line < keys.length; line++) {

                let key = keys[line];

                let code = proc.code[key];
                let mode = proc.mode[key];
              
                if (! mode.execute) {
                    continue;
                }

    //  If the key is all digits then it's a line of code.
    //
                if  (/^[0-9]+$/.test(key)) {
                    __helpers.log(`>>> ${" ".repeat(indent + __indent_increment)}Executing line: ${code}`);
                    continue;
                }

                let result = _execute(code, (indent + __indent_increment));

                if (result.status !== "success") {
                    return result;
                }

                __helpers.log(`>>> ${" ".repeat(indent + __indent_increment)}Returning to ${path}`);
            }

            return {
                'status': "success"
            };

        };


        return {
        
            execute:        _execute

        };

    };
