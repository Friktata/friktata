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

            console.log(`>>> STOP called`)

            if (_proc !== false) {
                console.log(`STOPPING...`);
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

            window.location.hash = obj_params['script_path'];

            // const   __polybasic = await PolyBASIC();

            window.__polybasic = __polybasic;
            await window.__router.reset();

            const   __script_path = window.__router.get_page_path();
            const   __script_data = await window.__router.get_page_data();

            console.log(`Loading page ${__script_path}, data ${__script_data}`);
            let result = await window.__polybasic.exec_script(__script_path, __script_data);

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

            console.log(`>>> SETPROC ${proc.id}`);

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
                    { 'name': 'script_path',    'type': 'string' }
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
