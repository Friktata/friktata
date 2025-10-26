/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/System.js
 * 
 */

    import { PolyBASIC } from "../../PolyBASIC.js";

    export const System = () => {

        let     _proc = false;

    /**************************************************************************
     *  stop()
     * 
     */
        const   stop = () => {

            if (_proc !== false) {
                _proc.status = "stop";
            }

            return "";

        };


    /**************************************************************************
     *  exec()
     * 
     */
        const   exec = async (
            obj_params = {}
        ) => {

            stop();

            let magic = obj_params['magic'];
            
            const   __polybasic = await PolyBASIC();

            window.location.hash = obj_params['script_path'];
            window.__polybasic = __polybasic;

            await window.__router.reset();

            const   __script_path = window.__router.get_page_path();
            const   __script_data = await window.__router.get_page_data();

            let result = await window.__polybasic.exec_script(__script_path, __script_data, magic);

            if (result.status === "success") {
                window.__helpers.log(`>>>`);
                window.__helpers.log(`>>> That is a nice, clean exit|`);
            }
            else {
                throw new Error(result.message);
            }

            return;

        };


    /**************************************************************************
     *  setproc()
     * 
     */
        const   setproc = (
            proc
        ) => {

            _proc = proc;

            return "";

        };


        const   _methods =          {
            
            'stop':                 {
                'callback':         stop,
                'async':            false,
                'params':           []
            },

            'exec':                 {
                'callback':         exec,
                'async':            true,
                'params':           [
                    { 'name': 'script_path',    'type': 'string' },
                    { 'name': 'magic',          'type': 'string',   'default': false }
                ]
            },

            'setproc':              {
                'callback':         setproc,
                'async':            false,
                'params':           []
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };


    };
