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


    const   __donate_url = "https://donate.stripe.com/3cI5kDb07a1cg7ueq2dQQ00";


    export const TerminalIO = () => {

        let     __current_link = false;
        let     __current_page = false;

        let     __is_donate_link = false;

        let     __color_pairs = {
        };

        let     __color_stack = [];

        let     __attributes =  {
            'bold':             false,
            'italic':           false,
            'underline':        false
        };


        let     __cursor =      {
            'enabled':          false,
            'row':              0,
            'column':           0,
            'blinkrate':        500,
            'interval_id':      false,
            'on':               {
                'fg':           {
                    'red':          255,
                    'green':        255,
                    'blue':         255,
                    'alpha':        255
                },
                'bg':           {
                    'red':          0,
                    'green':        0,
                    'blue':         0,
                    'alpha':        255
                }
            },
            'off':              {
                'fg':           {
                    'red':          0,
                    'green':        0,
                    'blue':         0,
                    'alpha':        255
                },
                'bg':           {
                    'red':          255,
                    'green':        255,
                    'blue':         255,
                    'alpha':        255
                }
            }
        };


    /**************************************************************************
     *  __setpair()
     * 
     */
        const   __setpair = (
            tokens
        ) => {

            if (tokens.length != 10) {
                return "Error in setpair - command expects exactly 9 arguments";
            }

            __color_pairs[tokens[1]] = {
                'foreground':   {
                    'red':      parseInt(tokens[2]),
                    'green':    parseInt(tokens[3]),
                    'blue':     parseInt(tokens[4]),
                    'alpha':    parseInt(tokens[5])
                },
                'background':   {
                    'red':      parseInt(tokens[6]),
                    'green':    parseInt(tokens[7]),
                    'blue':     parseInt(tokens[8]),
                    'alpha':    parseInt(tokens[9])
                },
            };

            return "";

        };


    /**************************************************************************
     *  __enable_pair()
     * 
     */
        const   __enable_pair = (
            tokens
        ) => {

            if (tokens.length != 2) {
                return "Error in enablepair - command expects exactly 1 argument";
            }

            if (! __color_pairs.hasOwnProperty(tokens[1])) {
                return `Error in enablepair - pair '${tokens[1]}' not found`;
            }

            __color_stack.push({
                'foreground': structuredClone(window.__display.display_info().foreground),
                'background': structuredClone(window.__display.display_info().background)
            });

            setfg(__color_pairs[tokens[1]]['foreground']);
            setbg(__color_pairs[tokens[1]]['background']);

            return "";

        };


    /**************************************************************************
     *  __enable_pair()
     * 
     */
        const   __disable_pair = (
            tokens
        ) => {

            let color_pairs = Object.keys(__color_stack);

            if (color_pairs.length < 1) {
                return "";
            }
            
            let color_pair = __color_stack.pop();

            setfg(color_pair['foreground']);
            setbg(color_pair['background']);

            return "";

        };


    /**************************************************************************
     *  __set_attribute()
     * 
     */
        const   __set_attribute = (
            tokens,
            attribute
        ) => {

            if (tokens.length > 1) {
                if (tokens[1] === "on" || tokens[1] === "true") {
                    __attributes[attribute] = true;
                }
                else if (tokens[1] === "off" || tokens[1] === "false") {
                    __attributes[attribute] = false;
                }
                else {
                    return "Error in bold - parameter should be either 'on' or 'off'";
                }
            }
            else {
                __attributes[attribute] = ! __attributes[attribute];
            }

            return "";

        };


    /**************************************************************************
     *  __bold_attribute()
     * 
     */
        const   __bold_attribute = (
            tokens
        ) => {

            return __set_attribute(tokens, 'bold');

        };


    /**************************************************************************
     *  __italic_attribute()
     * 
     */
        const   __italic_attribute = (
            tokens
        ) => {

            return __set_attribute(tokens, 'italic');

        };


    /**************************************************************************
     *  __underline_attribute()
     * 
     */
        const   __underline_attribute = (
            tokens
        ) => {

            return __set_attribute(tokens, 'underline');

        };


    /**************************************************************************
     *  __external_link()
     * 
     */
        const   __external_link = (
            tokens
        ) => {

            if (tokens.length === 1) {
                __current_link = false;
            }
            else {
                __current_link = tokens[1];
            }

            return "";

        };


    /**************************************************************************
     *  __internal_link()
     * 
     */
        const   __internal_link = (
            tokens
        ) => {

            if (tokens.length === 1) {
                __current_page = false;
            }
            else {
                __current_page = tokens[1];
            }

            return "";

        };


    /**************************************************************************
     *  __donate_link()
     * 
     */
        const   __donate_link = (
            tokens
        ) => {

            if (__is_donate_link !== false) {
                __is_donate_link = false;
            }
            else {
                __is_donate_link = __donate_url;
            }

            return "";

        };


    /**************************************************************************
     *  All of these commands can be `embedded` within a string passed to
     *  the putcolumn() method.
     * 
     */
        const   __commands =    {
            'setpair':          __setpair,
            'enablepair':       __enable_pair,
            'disablepair':      __disable_pair,
            'bold':             __bold_attribute,
            'italic':           __italic_attribute,
            'underline':        __underline_attribute,
            'site':             __external_link,
            'page':             __internal_link,
            'donate':           __donate_link
        };


    /**************************************************************************
     *  __move_cursor()
     * 
     */
        const   __move_cursor = (
            row,
            column
        ) => {

            if (__cursor['enabled'] !== "on") {
                return;
            }

            if (! __cursor.hasOwnProperty('column_width')) {
                __cursor['column_width'] = window.__display.display_info().columns;
            }
            if (! __cursor.hasOwnProperty('column_height')) {
                __cursor['column_height'] = window.__display.display_info().rows;
            }

            if (++column >= (__cursor['column_width'] - __cursor['column_start'])) {
                column = __cursor['column_start'];
                if (++row >= (__cursor['column_height'] - __cursor['row_start'])) {
                    row--;
                }
            }

            let node = document.getElementById(`cell_${row}_${column}`);

            let top = node.getBoundingClientRect().top;
            let left = node.getBoundingClientRect().left;

            $(`#__cursor__`).css({
                'top': `${top}px`,
                'left': `${left}px`
            });

            __cursor['row'] = row;
            __cursor['column'] = column;

            __toggle_cursor(true);

        };


    /**************************************************************************
     *  __toggle_cursor()
     * 
     */
        const   __toggle_cursor = (
            on = false
        ) => {

            if (__cursor['enabled'] !== "on") {
                return;
            }

            let fg = __cursor['on']['fg'];
            let bg = __cursor['on']['bg'];

            if (on === true) {
                __cursor['state'] = "off";
                if (__cursor.hasOwnProperty('interval_id') && __cursor['interval_id'] !== false) {
                    clearInterval(__cursor['interval_id']);
                    __cursor['interval_id'] = setInterval(__toggle_cursor, __cursor['blinkrate']);
                }
            }

            if (__cursor['state'] === "on") {
                __cursor['state'] = "off";
            }
            else {
                __cursor['state'] = "on";
                
                fg = __cursor['off']['fg'];
                bg = __cursor['off']['bg'];
            }

            $(`#__cursor__`).css({
                'color': `rgba(${fg['red']}, ${fg['green']}, ${fg['blue']}, ${fg['alpha']})`,
                'background-color': `rgba(${bg['red']}, ${bg['green']}, ${bg['blue']}, ${bg['alpha']})`,
            });

        };


    /**************************************************************************
     *  putchar()
     * 
     */
        const   putchar = async (
            obj_params = [],
            z_index = 1
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

            let update_cursor = obj_params['update_cursor'] ?? false;

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
            if (char.trim() === "'") {
                char = "&#39;";
            }
            if (char.trim() === "\"") {
                char = "&quot;";
            }
            if (char.trim() === "&") {
                char = "&amp;";
            }

            let fg = window.__display.display_info().foreground;
            let bg = window.__display.display_info().background;

            let node = document.getElementById(`cell_${row.toString()}_${column.toString()}`);
            
            node.innerHTML = char;

            node.style.color = `rgba(${fg['red']}, ${fg['green']}, ${fg['blue']}, ${fg['alpha']})`;
            node.style.backgroundColor = `rgba(${bg['red']}, ${bg['green']}, ${bg['blue']}, ${bg['alpha']})`;

            if (__attributes['bold'] === true) {
                node.style.fontWeight = 'bold';
            }
            else {
                node.style.fontWeight = 'normal';
            }

            if (__attributes['italic'] === true) {
                node.style.fontStyle = 'italic';
            }
            else {
                node.style.fontStyle = 'normal';
            }

            if (__attributes['underline'] === true) {
                node.style.textDecoration = 'underline';
            }
            else {
                node.style.textDecoration = 'none';
            }

            node.style.zIndex = z_index;

            let __cell_prefix = "cell_";

            if (obj_params['bg'] === true) {
                __cell_prefix = "cell_bg_";
            }
                
            if (__current_link !== false) {
                let __link = __current_link;

                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).off();
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).on("click", () => {
                    window.open(__link, "_blank");
                });
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).attr('title', `Goto ${__link} (opens in new tab)`)
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).css('cursor', 'pointer');
            }
            
            else if (__current_page !== false) {
                let __page = __current_page;

                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).off();
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).on("click", () => {
                    window.__methods['exec']['callback']({
                        'script_path': __page
                    });
                });
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).attr('title', `Goto page ${__page}`)
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).css('cursor', 'pointer');
            }

            else if (__is_donate_link !== false) {
                let __link = __is_donate_link;

                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).off();
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).on("click", () => {
                    window.open(__link, "_blank");
                });
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).attr('title', `Chuck me a bob for a crust!`)
                $(`#${__cell_prefix}${row.toString()}_${column.toString()}`).css('cursor', 'pointer');
            }

            // $(`#cell_${row.toString()}_${column.toString()}`).css({
            //     'opacity': '0.99'
            // });

            if (update_cursor !== false) {
                __move_cursor(row, column);
            }

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
            let bg = obj_params['bg'];

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
                    'char': char,
                    'update_cursor': true,
                    'bg': bg
                });

                // if (blanks && char === ' ') {
                //     $(`#cell_${row}_${column}`).css('opacity', '0.01');
                // }

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

            if (color !== 'red' && color !== 'green' && color !== 'blue' && color !== 'alpha') {
                return `Error in foreground(): '${color}' is not a valid parameter`;
            }

            if (obj_params.value !== false) {
                fg[color] = obj_params['value'];
                window.__display.foreground(fg);
            }
            else {
                return fg[color];
            }

            return "";

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
                return `rgba(${bg['red']}, ${bg['green']}, ${bg['blue']}, ${bg['alpha']})`;
            }

            let color = obj_params['color'];

            if (color !== 'red' && color !== 'green' && color !== 'blue' && color !== 'alpha') {
                return `Error in background(): '${color}' is not a valid parameter`;
            }

            if (obj_params['value'] != false) {
                bg[color] = obj_params['value'];
                window.__display.foreground(bg);
            }
            else {
                return bg[color];
            }

            return "";

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

            $(`.cell`).html("");
            $(`.cell`).off();
            $(`.cell`).css('cursor', "text");
            $(`.cell`).attr('title', "");

        };


    /**************************************************************************
     *  cleararea()
     * 
     */
        const   cleararea = (
            obj_params = {}
        ) => {

            let row = obj_params['row'] ?? 0;
            let column = obj_params['column'] ?? 0;
            let width = obj_params['width'] ?? window.__display.display_info().columns;
            let height = obj_params['height'] ?? window.__display.display_info().rows;

            // alert(JSON.stringify(obj_params, null, 2))

            for (let r = row; r < (row + height); r++) {
                for (let c = column; c < (column + width); c++) {
                    $(`#cell_${r}_${c}`).html('');
                }
            }

            return "";

        };


    /**************************************************************************
     *  clear_row()
     * 
     */
        const   clear_row = async (
            obj_params = {}
        ) => {

            let row = obj_params['row'];
            let start = obj_params['start'];

            while (start < (window.__display.display_info().columns)) {
                await putchar({
                    'row': row,
                    'column': start++,
                    'char': " ",
                    'update_cursor': false
                });
            }

            return "";

        };


    /**************************************************************************
     *  __execute_commands()
     * 
     */
        const   __execute_commands = (
            commands
        ) => {

            let _commands = commands.split(";");
            let __return_val = "";

            for (let index = 0; index < _commands.length; index++) {

                let command = _commands[index];
                
                if (command.trim() === "") {
                    continue;
                }

                let tokens = command.trim().split(/\s+/);

                if (tokens.length < 1) {
                    continue;
                }

                if (! __commands.hasOwnProperty(tokens[0])) {
                    return `Error - style command '${tokens[0]}' not found`;
                }

                __return_val = __commands[tokens[0]](tokens);

                if (__return_val.trim() !== "") {
                    console.error(__return_val);
                }

                if (__return_val !== "") {
                    break;
                }

            }

            return __return_val;

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
            let     bg = obj_params['bg'];

            let     start = 0;
            let     str = obj_params['string'];
            let     end = str.length;

            let     largest_word_size = __largest_word_size(str);

            let     __return_val = "";
            let     lines = 1;

            if (typeof start_line === 'string') {
                start_line = parseInt(start_line);
            }

            __cursor['row_start'] = row;
            __cursor['column_start'] = column;
            __cursor['column_width'] = width;
            __cursor['column_height'] = height;

            __attributes['bold'] = __attributes['italic'] = __attributes['underline'] = false;
            __current_link = __current_page = false;

            $(`.cell`).off();
            $(`.cell`).css('cursor', "text");
            $(`.cell`).attr('title', "");

            while (true) {

                if ((lines - start_line) >= height) {
                    break;
                }

                if (lines === start_line) {
                    row = obj_params['row'] - 1;
                    column = obj_params['column'];
                }

                let ch = " ";

                if (row >= (obj_params['row'] + obj_params['height'])) {
                    if (column >= (obj_params['column'] + obj_params['width'])) {
                        break;
                    }
                }
                
                if (start < str.length) {
                    ch = str.substring(start, (start + 1));
                }

                start++;

                if (ch === "`") {
                    let commands = "";

                    while (start < str.length) {
                        ch = str.substring(start, (start + 1));
                        start++;
                        
                        if (ch === "`") {
                            break;
                        }

                        commands += ch;
                    }

                    __execute_commands(commands);
                    continue;
                }

                let next_word_end;
                
                if (start < str.length) {
                    next_word_end = __next_word_length(str, start);
                }

                let z_index = (999999 - start);

                if (bg === true) {
                    z_index = (49999 - start);
                }
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
                                'char': " ",
                                'update_cursor': false,
                                'bg': bg
                            }, z_index);
                        }
                    }

                    ch = "";

                    if (start < str.length) {
                        ch = str.substring(start, (start + 1));
                    }

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
                    if (lines >= start_line || start >= str.length)
                    break;
                }

                if (lines >= start_line) {
                    if (row < (obj_params['row'] + height) && column < (obj_params['column'] + width)) {
                        if (ch === "") {
                            ch = " ";
                        }

                        if (start <= str.length) {
                            putchar({
                                'row': row,
                                'column': column,
                                'char': ch,
                                'update_cursor': true,
                                'bg': bg
                            }, z_index);
                        }

                        column++;

                        if (start < str.length && obj_params['delay'] > 0) {
                            if (obj_params['skip'] === "true" || obj_params['skip'] === true) {
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
                }

            }

            while (Object.keys(__color_stack).length > 0) {
                __disable_pair();
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

                if (ch === "`") {
                    while (start < str.length) {
                        ch = str.substring(start, (start + 1));
                        start++;

                        if (ch === "`") {
                            break;
                        }
                    }

                    continue;
                }

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

            return lines + 4;

        };


    /*************************************************************************
     *  cursor()
     * 
     */
        const   cursor = (
            obj_params = {}
        ) => {

            let mode = obj_params['mode'];
            let row = obj_params['row'];
            let column = obj_params['column'];
            let blinkrate = obj_params['blinkrate'];

            if (mode !== "on" && mode !== "true" && mode !== "off" && mode !== "false") {
                return `Error in cursor(): Invalid 'mode' option '${mode}'`;
            }

            if (typeof row !== 'number') {
                row = 0;
            }
            if (typeof column !== 'number') {
                column = 0;
            }
            if (typeof blinkrate !== 'number') {
                blinkrate = 500;
            }

            __cursor['row'] = row;
            __cursor['column'] = column;
            __cursor['blinkrate'] = blinkrate;
            __cursor['enabled'] = mode;
            __cursor['row_start'] = row;
            __cursor['column_start'] = column;

            if (! __cursor.hasOwnProperty('interval_id')) {
                __cursor['interval_id'] = false;
            }

            if (mode == 'on' && __cursor['interval_id'] === false) {
                $(`#__cursor__`).css('visibility', "visible");
                __cursor['interval_id'] = setInterval(__toggle_cursor, __cursor['blinkrate']);
                __move_cursor(row, column);
            }
            
            if (mode == 'off' && __cursor['interval_id'] !== false) {
                $(`#__cursor__`).css('visibility', "hidden");
                clearInterval(__cursor['interval_id']);
                __cursor['interval_id'] = false;
            }

            return "";

        };


        const   _methods =          {
            
            'putchar':              {
                'callback':         putchar,
                'async':            false,
                'params':           [
                    { 'name': 'row',        'type': 'number' },
                    { 'name': 'column',     'type': 'number' },
                    { 'name': 'char',       'type': 'string' },
                    { 'name': 'bg',         'type': 'boolean',  'default': false }
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
                    { 'name': 'skip',       'type': 'boolean',  'default': false },
                    { 'name': 'bg',         'type': 'boolean',  'default': false }
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

            'cleararea':            {
                'callback':         cleararea,
                'async':            false,
                'params':           [
                    { 'name': 'row',        'type': 'number' },
                    { 'name': 'column',     'type': 'number' },
                    { 'name': 'width',      'type': 'number' },
                    { 'name': 'height',     'type': 'number' }
                ]
            },

            'clear_row':            {
                'callback':         clear_row,
                'async':            true,
                'params':           [
                    { 'name': 'row',    'type': 'number',   'default': 0 },
                    { 'name': 'start',  'type': 'number',   'default': 0 }
                ]
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
                    { 'name': 'end',        'type': 'number',   'default': 0 },
                    { 'name': 'bg',         'type': 'boolean',  'default': false }
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
            },

            'cursor':               {
                'callback':         cursor,
                'async':            false,
                'params':           [
                    { 'name': 'mode',       'type': 'string',   'default': 'on' },
                    { 'name': 'row',        'type': 'number',   'default': 0 },
                    { 'name': 'column',     'type': 'number',   'default': 0 },
                    { 'name': 'blinkrate',  'type': 'number',   'default': 500 }
                ]
            }
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
