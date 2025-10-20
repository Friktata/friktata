/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/Strings.js
 * 
 */

    export const Strings = () => {

    /**************************************************************************
     *  print()
     * 
     */
        const substring = (
            obj_params = []
        ) => {

            if (! obj_params.hasOwnProperty('string')) {
                return "Error in substring(): Expected 'string' parameter";
            }

            if (! obj_params.hasOwnProperty('start')) {
                obj_params['start'] = 0;
            }
            if (! obj_params.hasOwnProperty('end')) {
                obj_params['end'] = obj_params['string'].length;
            }

            if (typeof obj_params['start'] === 'string') {
                obj_params['start'] = parseInt(obj_params['start']);
            }
            if (typeof obj_params['end'] === 'string') {
                obj_params['end'] = parseInt(obj_params['end']);
            }

            console.log(`Substring start: ${obj_params['start']}`);
            console.log(`Substring end: ${obj_params['end']}`);
            console.log(`Substring: ${obj_params['string'].substring(obj_params['start'], obj_params['end'])}`);
            return `"${obj_params['string'].substring(obj_params['start'], obj_params['end'])}"`;

        };


    /**************************************************************************
     *  strlen()
     * 
     */
        const strlen = (
            obj_params = []
        ) => {

            if (! obj_params.hasOwnProperty('string')) {
                return "Error in strlen(): Expected 'string' parameter";
            }

            return obj_params['string'].length;

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
            
            'substring':            {
                'callback':         substring,
                'async':            false,
                'params':           [
                    { 'name': 'string',     'type': 'string' },
                    { 'name': 'start',      'type': 'number' },
                    { 'name': 'end',        'type': 'number' }
                ]
            },
            'strlen':               {
                'callback':         strlen,
                'async':            false,
                'params':           [
                    { 'name': 'string',     'type': 'string' }
                ]
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
