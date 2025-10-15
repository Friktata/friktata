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

            return obj_params.substring(obj_params['start'], obj_params['end']);

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
                'params':           [
                    { 'name': 'string',     'type': 'string' },
                    { 'name': 'start',      'type': 'number' },
                    { 'name': 'end',        'type': 'number' }
                ]
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
