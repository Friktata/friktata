/******************************************************************************
 *  friktata/src/js/PolyBASIC_extensions/TerminalIO.js
 * 
 */

    const __largest_word_size = str => {

        const words = str.split(/\s+/);
        
        let max_length = 0;

        for (const word of words) {
            if (word.length > max_length) {
                max_length = word.length;
            }
        }

        return max_length;

    };


    const __next_word_length = (
        str, 
        position
    ) => {

        let pos;

        for (pos = position; pos < str.length; pos++) {
            let ch = str.substring(pos, (pos + 1));

            if (ch === "\n") {
                return (pos - position);
            }

            if (ch !== " " && ch !== "\t") {
                break;
            }
        }

        for (; pos < str.length; pos++) {
            let ch = str.substring(pos, (pos + 1));

            if (ch === "\n"|| ch === " " || ch === "\t") {
                break;
            }
        }

        return (pos - position);

    };


    export const TerminalIO = () => {

    /**************************************************************************
     *  putchar()
     * 
     */
        const   putchar = async (
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

            if (char.trim() === "") {
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
        const   putstring = async (
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

            let __return_val = "";
            
            for (let byte = 0; byte < string.length; byte++) {
                let char = string.substring(byte, (byte + 1));

                if (column >= display_info.columns || char === "\n") {
                    row++;
                    column = obj_params['column'];
                }

                if (row >= display_info.rows) {
                    return byte;
                }

                putchar({
                    'row': row,
                    'column': column,
                    'char': char
                });

                if (obj_params['delay'] > 0) {
                    if (obj_params['skip']) {
                        let ch = await window.__methods['getch']['callback'](
                            {
                                'delay': obj_params['delay'],
                                'skip': obj_params['skip']
                            }
                        );
                        if (ch !== "") {
                            obj_params['delay'] = 0;
                        }

                        __return_val = ch;
                    }
                    else {
                        await window.__methods['getch']['callback'](
                            {
                                'delay': obj_params['delay'],
                                'skip': obj_params['skip']
                            }
                        );
                    }
                }

                column++;
            }

            return __return_val;

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


    /**************************************************************************
     *  setbg()
     * 
     */
        const   clear = (
            obj_params = []
        ) => {

            $(`.cell`).html("&nbsp;");

        };


    /**************************************************************************
     *  putcolumn()
     * 
     */
        const   putcolumn = async (
            obj_params = []
        ) => {

            let     row = obj_params['row'];
            let     column = obj_params['column'];
            let     width = obj_params['width'];
            let     height = obj_params['height'];

            let     delay = obj_params['delay'];
            let     wrap = obj_params['wrap'];
            let     start_line = obj_params['start_line'];

            let     start = 0;
            let     str = obj_params['string'];
            let     end = str.length;

            let     largest_word_size = __largest_word_size(str);

            let     __return_val = "";
            let     lines = 1;

            if (typeof start_line === 'string') {
                start_line = parseInt(start_line);
            }

            console.log(`>>>>>>>>>>>> START LINE ${start_line} <<<<<<<<<<<<<<<<<<<`)

            // if (end <= start) {
            //     end = (str.length - 1);
            // }

            while (true) {

                if (lines === start_line) {
                    row = obj_params['row'] - 1;
                    column = obj_params['column'];
                }

                let ch = " ";

                if (row >= (obj_params['row'] + obj_params['height'])) {
                    if (column > (obj_params['column'] + obj_params['width'])) {
                        break;
                    }
                }
                
                if (start < str.length) {
                    ch = str.substring(start, (start + 1));
                }

                start++;

                let next_word_end = __next_word_length(str, start);

                if (
                    (wrap &&
                        (ch === " "  || ch === "\t") && 
                        (
                            ((column + largest_word_size) >= obj_params['width']) && 
                            ((next_word_end + column) >= (obj_params['column'] + obj_params['width']))
                        )
                    ) ||
                    ch === "\n"
                ) {
                    for ( ; column < (obj_params['column'] + width); column++) {
                    if (row < (obj_params['row'] + height) && column < (obj_params['column'] + width)) {

                        putchar({
                            'row': row,
                            'column': column,
                            'char': " "
                        });
                    }
                    }

                    ch = str.substring(start, (start + 1));

                    if (ch === " " || str === "\t") {
                        start++;
                    }

                    column = obj_params['column'];
                    row++;
                    lines++;

                    continue;
                }

                if (column >= (obj_params['column'] + width)) {
                    column = obj_params['column'];
                    row++;
                    lines++;
                }

                if (row >= (obj_params['row'] + height)) {
                    if (lines >= start_line)
                    break;
                }

                if (lines >= start_line) {
                    if (row < (obj_params['row'] + height) && column < (obj_params['column'] + width)) {
                        putchar({
                            'row': row,
                            'column': column,
                            'char': ch
                        });
                    }
                    column++;
                }

                if (obj_params['delay'] > 0) {
                    if (obj_params['skip']) {
                        let ch = await window.__methods['getch']['callback'](
                            {
                                'delay': obj_params['delay'],
                                'skip': obj_params['skip']
                            }
                        );
                        if (ch !== "") {
                            obj_params['delay'] = 0;
                        }

                        __return_val = ch;
                    }
                    else {
                        await window.__methods['getch']['callback'](
                            {
                                'delay': obj_params['delay'],
                                'skip': obj_params['skip']
                            }
                        );
                    }
                }

            }

            return __return_val;

        };


    /**************************************************************************
     *  countlines()
     * 
     */
        const   countlines = (
            obj_params = []
        ) => {

            let     row = 0;
            let     column = 0;
            let     width = obj_params['width'];

            let     wrap = obj_params['wrap'];
            let     str = obj_params['string'];

            let     largest_word_size = __largest_word_size(str);

            let     start = 0;
            let     lines = 1;

            while (start < str.length) {
                
                let ch = str.substring(start, (start + 1));

                start++;

                let next_word_end = __next_word_length(str, start);

                if (
                    (wrap &&
                        (ch === " "  || ch === "\t") && 
                        (
                            ((column + largest_word_size) >= obj_params['width']) && 
                            ((next_word_end + column) >= (obj_params['column'] + obj_params['width']))
                        )
                    ) ||
                    ch === "\n"
                ) {
                    for ( ; column < (obj_params['column'] + width); column++) {
                        putchar({
                            'row': row,
                            'column': column,
                            'char': " "
                        });
                    }

                    ch = str.substring(start, (start + 1));

                    if (ch === " " || str === "\t") {
                        start++;
                    }

                    column = obj_params['column'];
                    row++;
                    lines++;

                    continue;
                }

                if (column >= (obj_params['column'] + width)) {
                    column = obj_params['column'];
                    row++;
                    lines++;
                }

            }

            return lines;

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
                'async':            true,
                'params':           [
                    { 'name': 'row',        'type': 'number' },
                    { 'name': 'column',     'type': 'number' },
                    { 'name': 'string',     'type': 'string' },
                    { 'name': 'delay',      'type': 'number',   'default': 0 },
                    { 'name': 'skip',       'type': 'boolean',  'default': false }
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

            },

            'clear':                {
                'callback':         clear,
                'async':            false,
                'params':           []
            },

            'putcolumn':            {
                'callback':         putcolumn,
                'async':            true,
                'params':           [
                    { 'name': 'row',        'type': 'number' },
                    { 'name': 'column',     'type': 'number' },
                    { 'name': 'width',      'type': 'number' },
                    { 'name': 'height',     'type': 'number' },
                    { 'name': 'string',     'type': 'string' },
                    { 'name': 'delay',      'type': 'number',   'default': 0 },
                    { 'name': 'skip',       'type': 'boolean',  'default': false },
                    { 'name': 'wrap',       'type': 'boolean',  'default': true },
                    { 'name': 'start_line', 'type': 'number',   'default': 0 },
                    { 'name': 'end',        'type': 'number',   'default': 0 }
                ]
            },

            'countlines':           {
                'callback':         countlines,
                'async':            false,
                'params':           [
                    { 'name': 'width',      'type': 'number' },
                    { 'name': 'string',     'type': 'string' },
                    { 'name': 'wrap',       'type': 'boolean',  'default': true }
                ]
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
