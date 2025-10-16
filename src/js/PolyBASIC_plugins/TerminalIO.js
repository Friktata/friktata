/******************************************************************************
 *  friktata/src/js/PolyBASIC_extensions/TerminalIO.js
 * 
 */

    export const TerminalIO = () => {

    /**************************************************************************
     *  putchar()
     * 
     */
        const   putchar = (
            obj_params
        ) => {

            if (! obj_params.hasOwnProperty('row')) {
                return "Error in putchar(): No 'row' specified";
            }
            if (! obj_params.hasOwnProperty('column')) {
                return "Error in putchar(): No 'column' specified";
            }
            if (! obj_params.hasOwnProperty('char')) {
                return "Error in putchar(): No 'char' specified";
            }

            let row = obj_params['row'];
            let column = obj_params['column'];
            let char = obj_params['char'];

            let display_info = window.__display.display_info();

            if (row >= display_info.rows) {
                return `Error in putchar(): Specified 'row' out of bounds (rows=${display_info.rows})`;
            }
            if (column >= display_info.columns) {
                return `Error in putchar(): Specified 'column' out of bounds (columns=${display_info.columns})`;
            }

            if (char === " ") {
                char = "&nbsp;";
            }

            document.getElementById(`cell_${row.toString()}_${column.toString()}`).innerHTML = char;

            return "OK";

        };


    /**************************************************************************
     *  putstring()
     * 
     */
        const   putstring = (
            obj_params
        ) => {

            if (! obj_params.hasOwnProperty('row')) {
                return "Error in putchar(): No 'row' specified";
            }
            if (! obj_params.hasOwnProperty('column')) {
                return "Error in putchar(): No 'column' specified";
            }
            if (! obj_params.hasOwnProperty('string')) {
                return "Error in putchar(): No 'string' specified";
            }

            let row = obj_params['row'];
            let column = obj_params['column'];
            let string = obj_params['string'];

            let display_info = window.__display.display_info();
            
            for (let byte = 0; byte < string.length; byte++) {
                let char = string.substring(byte, (byte + 1));

                if (column >= display_info.columns) {
                    row++;
                    column = 0;
                }

                if (row >= display_info.rows) {
                    return byte;
                }

                putchar({
                    'row': row,
                    'column': column,
                    'char': char
                });

                column++;
            }

            return "OK";

        };


    /**************************************************************************
     *  display_rows()
     * 
     */
        const   display_rows = () => {

            return window.__display.display_info().rows;

        };


    /**************************************************************************
     *  display_columns()
     * 
     */
        const   display_columns = () => {

            return window.__display.display_info().columns;

        };


        const   _methods =          {
            
            'putchar':              {
                'callback':         putchar,
                'params':           [
                    { 'name': 'row',        'type': 'number' },
                    { 'name': 'column',     'type': 'number' },
                    { 'name': 'char',       'type': 'string' }
                ]
            },

            'putstring':            {
                'callback':         putstring,
                'params':           [
                    { 'name': 'row',        'type': 'number' },
                    { 'name': 'column',     'type': 'number' },
                    { 'name': 'string',     'type': 'string' }
                ]
            },

            'display_rows':         {
                'callback':         display_rows,
                'params':           []
            },

            'display_columns':      {
                'callback':         display_columns,
                'params':           []
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
