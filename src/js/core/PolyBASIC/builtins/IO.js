/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/IO.js
 * 
 */

    export const IO = () => {

    /**************************************************************************
     *  print()
     * 
     */
        const print = (
            obj_params = []
        ) => {

            console.log(obj_params['string']);

            return "OK";

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
            
            'console':              {
                'callback':         console,
                'params':           [
                    { 'name': 'string', 'type': 'string' }
                ]
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
