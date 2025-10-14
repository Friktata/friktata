/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/IO.js
 * 
 */

    export const IO = (



    ) => {

    
        const test = (
            obj_params
        ) => {

            return (obj_params['lval'] + obj_params['rval']);

        };

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
     *  putchar()
     * 
     */
        const   putchar = (
            obj_params = []
        ) => {

            return "OK";

        };


    /**************************************************************************
     *  putstring()
     * 
     */
        const   putstring = (
            obj_params = []
        ) => {

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
            'test':                 {
                'callback':         test,
                'params':           [
                    { 'name': 'lval', 'default': false, 'type': 'number' },
                    { 'name': 'rval', 'default': 10, 'type': 'number' }
                ]
            },
            'print':                {
                'callback':         print,
                'params':           [
                    { 'name': 'string', 'default': false, 'type': 'string' }
                ]
            },
            'putchar':              {
                'callback':         putchar,
                'params':           [
                    { 'name': 'row', 'default': false, 'type': 'number' },
                    { 'name': 'col', 'default': 10, 'type': 'number' },
                    { 'name': 'string', 'default': false, 'type': 'string' }
                ]
            },
            'putstring':            {
                'callback':         putstring,
                'params':           [
                    { 'name': 'row', 'default': false, 'type': 'number' },
                    { 'name': 'col', 'default': 10, 'type': 'number' },
                    { 'name': 'string', 'default': false, 'type': 'string' }
                ]
            }
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
