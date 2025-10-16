/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/IO.js
 * 
 */

    export const IO = () => {

    /**************************************************************************
     *  print()
     */
        const   print = (
            obj_params = []
        ) => {

            console.log(obj_params['string']);

            return "OK";

        };


    /**************************************************************************
     *  sleep()
     */
        const   sleep = async (
            obj_params = []
        ) => {

            if (! obj_params.hasOwnProperty('duration')) {
                return "Error in sleep(): Function expects exactly 1 parameter"
            }

            let duration = obj_params['duration'];

            if (duration <= 0) {
                return;
            }
            
            return new Promise(resolve => setTimeout(resolve, duration));

        };


    /**************************************************************************
     *  getch()
     */
        const   getch = (
            obj_params = []
        ) => {
            return new Promise(resolve => {
                const handler = (event) => {
                    document.removeEventListener('keydown', handler);
                    resolve(event.key); // return the key pressed
                };
                document.addEventListener('keydown', handler);
            });
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
            
            'print':                {
                'callback':         print,
                'async':            false,
                'params':           [
                    { 'name': 'string',     'type': 'string' }
                ]
            },

            'sleep':                {
                'callback':         sleep,
                'async':            true,
                'params':           [
                    { 'name': 'duration',   'type': 'number' }
                ]
            },

            'getch':                {
                'callback':         getch,
                'async':            true,
                'params':           []
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
