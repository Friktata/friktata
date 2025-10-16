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
            obj_params = []
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

            let fg = window.__display.display_info().foreground;
            let bg = window.__display.display_info().background;

            let node = document.getElementById(`cell_${row.toString()}_${column.toString()}`);
            
            node.innerHTML = char;

            node.style.color = `rgba(${fg['red']}, ${fg['green']}, ${fg['blue']}, ${fg['alpha']})`;
            node.style.backgroundColor = `rgba(${bg['red']}, ${bg['green']}, ${bg['blue']}, ${bg['alpha']})`;

            return "OK";

        };


    /**************************************************************************
     *  putstring()
     * 
     */
        const   putstring = (
            obj_params = []
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


    /**************************************************************************
     *  foreground()
     * 
     */
        const   foreground = (
            obj_params = []
        ) => {

            let fg = window.__display.display_info().foreground;
        
            if (! obj_params.hasOwnProperty('color')) {

                return `rgba(${fg['red']}, ${fg['green']}, ${fg['blue']}, ${fg['alpha']})`;
                
            }

            let color = obj_params['color'];

            if (color !== 'red' && color !== 'green' && color !== 'blue') {
                return fg[color];
            }

            fg[color] = obj_params['value'];

            window.__display.foreground(fg);

            return 0;

        };


    /**************************************************************************
     *  background()
     * 
     */
        const   background = (
            obj_params = []
        ) => {

            let bg = window.__display.display_info().background;
        
            if (! obj_params.hasOwnProperty('color')) {

                return `rgba(${fg['red']}, ${fg['green']}, ${fg['blue']}, ${fg['alpha']})`;
                
            }

            let color = obj_params['color'];

            if (color !== 'red' && color !== 'green' && color !== 'blue') {
                return bg[color];
            }

            bg[color] = obj_params['value'];

            window.__display.foreground(bg);

            return 0;

        };


    /**************************************************************************
     *  setfg()
     * 
     */
        const   setfg = (
            obj_params = []
        ) => {

            if (
                ! obj_params.hasOwnProperty('red') ||
                ! obj_params.hasOwnProperty('green') ||
                ! obj_params.hasOwnProperty('blue') ||
                ! obj_params.hasOwnProperty('alpha')
            ) {
                return "Error in setfg(): Function expects exactly 4 parameters";
            }

            let fg = {
                'red': obj_params['red'],
                'green': obj_params['green'],
                'blue': obj_params['blue'],
                'alpha': obj_params['alpha'],
            }

            window.__display.foreground(fg);

            return 

        };


    /**************************************************************************
     *  setbg()
     * 
     */
        const   setbg = (
            obj_params = []
        ) => {

            if (
                ! obj_params.hasOwnProperty('red') ||
                ! obj_params.hasOwnProperty('green') ||
                ! obj_params.hasOwnProperty('blue') ||
                ! obj_params.hasOwnProperty('alpha')
            ) {
                return "Error in setbg(): Function expects exactly 4 parameters";
            }

            let bg = {
                'red': obj_params['red'],
                'green': obj_params['green'],
                'blue': obj_params['blue'],
                'alpha': obj_params['alpha'],
            }

            window.__display.background(bg);

            return 

        };


        const   _methods =          {
            
            'putchar':              {
                'callback':         putchar,
                'async':            false,
                'params':           [
                    { 'name': 'row',        'type': 'number' },
                    { 'name': 'column',     'type': 'number' },
                    { 'name': 'char',       'type': 'string' }
                ]
            },

            'putstring':            {
                'callback':         putstring,
                'async':            false,
                'params':           [
                    { 'name': 'row',        'type': 'number' },
                    { 'name': 'column',     'type': 'number' },
                    { 'name': 'string',     'type': 'string' }
                ]
            },

            'display_rows':         {
                'callback':         display_rows,
                'async':            false,
                'params':           []
            },

            'display_columns':      {
                'callback':         display_columns,
                'async':            false,
                'params':           []
            },

            'foreground':           {
                'callback':         foreground,
                'async':            false,
                'params':           [
                    { 'name': 'color',      'type': 'string' },
                    { 'name': 'value',      'type': 'number',   'default': 255 },
                ]
            },

            'background':           {
                'callback':         background,
                'async':            false,
                'params':           [
                    { 'name': 'color',      'type': 'string' },
                    { 'name': 'value',      'type': 'number',   'default': 255 },
                ]
            },

            'setfg':                {
                'callback':         setfg,
                'async':            false,
                'params':           [
                    { 'name': 'red',        'type': 'number' },
                    { 'name': 'green',      'type': 'number' },
                    { 'name': 'blue',       'type': 'number' },
                    { 'name': 'alpha',      'type': 'number' }
                ]

            },

            'setbg':                {
                'callback':         setbg,
                'async':            false,
                'params':           [
                    { 'name': 'red',        'type': 'number' },
                    { 'name': 'green',      'type': 'number' },
                    { 'name': 'blue',       'type': 'number' },
                    { 'name': 'alpha',      'type': 'number' }
                ]

            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
