/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/IO.js
 * 
 */

    export const IO = (



    ) => {

    
    /**************************************************************************
     *  _print()
     * 
     */
        const _print = (
            string
        ) => {

            console.log(string);

            return "OK";

        };


    /**************************************************************************
     *  _putchar()
     * 
     */
        const   _putchar = (
            cell_row,
            cell_column,
            byte
        ) => {

            return "OK";

        };


    /**************************************************************************
     *  _putstring()
     * 
     */
        const   _putstring = (
            cell_row,
            cell_column,
            string
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
            'print':                {
                'callback':         _print,
                'params':           [
                    { 'type': 'string', 'name': 'string',       'info': "Print a string to the console" }
                ],
                'returns':  '"OK" on success or an error message on failure'
            },
            'putchar':              {
                'callback':         _putchar,
                'params':           [
                    { 'type': 'int',    'name': 'cell_row',     'info': 'Row/line position to begin output' },
                    { 'type': 'int',    'name': 'cell_column',  'info': 'Column position to begin output' },
                    { 'type': 'char',   'name': 'byte',         'info': 'Character to print at cell_row,cell_column' }
                ],
                'returns':  '"OK" on success or an error message on failure'
            },
            'putstring':            {
                'callback':         _putstring,
                'params':           [
                    { 'type': 'int',    'name': 'cell_row',     'info': 'Row/line position to begin output' },
                    { 'type': 'int',    'name': 'cell_column',  'info': 'Column position to begin output' },
                    { 'type': 'char',   'name': 'string',       'info': 'String to print at cell_row,cell_column' }
                ],
                'returns':  '"OK" on success or an error message on failure'
            }
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
