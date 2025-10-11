/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/Runtime.js
 * 
 */

    export const Runtime = () => {

        const   _execute = proc => {

            let keys = Object.keys(proc.code);

            for (let line = 0; line < keys.length; line++) {

                let key = keys[line];

                let code = proc.code[key];
                let mode = proc.mode[key];

    //  If the key is all digits then it's a line of code.
    //
                if  (/^[0-9]+$/.test(key)) {
                    if (mode.execute === false) {
    //  Line execution is disabled.
                        continue;
                    }

                }

            }

        };


        return {
        
            execute:        _execute

        };

    };
