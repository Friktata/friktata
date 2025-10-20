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

            const __load = async () => {
            const path = `${__config['file_path']}/${obj_params['path']}`;

            const response = await fetch(path);

            if (! response.ok) {
                return 1;
            }

            return response.text();

            }

            let string = await __load();

            if (obj_params['unquoted'] === false) {
                return `"${string}"`;
            }
            else {
                return string;
            }

        };


    /**************************************************************************
     *  pagename()
     * 
     */
        const   pagename = async (
            obj_params = {}
        ) => {

            return await window.__router.get_page_name();

        };


    /**************************************************************************
     *  pagepath()
     * 
     */
        const   pagepath = async (
            obj_params = {}
        ) => {

            return await window.__router.get_page_path();

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
                    { 'name': 'path',       'type': 'string' },
                    { 'name': 'unquoted',   'type': 'boolean',  'default': false }
                ]
            },

            'pagename':             {
                'callback':         pagename,
                'async':            true,
                'params':           []
            },

            'pagepath':             {
                'callback':         pagepath,
                'async':            true,
                'params':           []
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
