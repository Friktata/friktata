/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/File.js
 * 
 */

    import { PolyBASICConfig } from "../../../config/PolyBASIC.config.js";


    export const File = () => {

        const   __config = PolyBASICConfig;


    /**************************************************************************
     *  print()
     * 
     */
        const   load = async (
            obj_params = []
        ) => {

            console.log(obj_params['path']);

            console.log(`Loading file ${obj_params['path']}`);

            const path = `${__config['file_path']}/${obj_params['path']}`;

            console.log(path);

            const response = await fetch(path);

            if (! response.ok) {
                return 1;
            }

            return response.text();

        };


    /**************************************************************************
     *  All builtin modules and plugins must follow this simple format.
     *
     *  This is required by the Depmanager.js code module to register
     *  modules and the methods they expose to our PolyBASIC scripts.
     *
     *  See the core/Depmanager.js file for more detailed info.
     *  
     */
        const   _methods =          {
            
            'load':                 {
                'callback':         load,
                'async':            true,
                'params':           [
                    { 'name': 'path', 'type': 'string' }
                ]
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
