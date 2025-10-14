/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/Parser.js
 * 
 */

	import { Helpers } from "./../Helpers.js";


    export const Parser = () => {

        const   __helpers = Helpers();

        let     __script_data;
        let     __script_byte;


    /**************************************************************************
     *  __get_next_byte()
     * 
     */
        const   __get_next_byte = () => {

            if (__script_byte >= __script_data.length) {
                return false
            }

            let next_byte = __script_data.substring(__script_byte, (__script_byte + 1));

            if (next_byte === "\r") {
                let following_byte = __script_data.substring((__script_byte + 1), (__script_byte + 2));
                
                __script_byte++;

                if (following_byte === "\n") {
                    __script_byte++;
                    return "\r\n";
                }

                return "\n";
            }

            if (next_byte === "/") {
                let following_byte = __script_data.substring((__script_byte + 1), (__script_byte + 2));

                if (following_byte === "/") {
                    __script_byte += 2;
                    return "//";
                }
            }

            __script_byte++;

            return next_byte;

        };


    /**************************************************************************
     *  __peek_next_byte()
     * 
     */
        const   __peek_next_byte = () => {

            let next_byte = __get_next_byte();

            if (next_byte !== false) {
                __script_byte--;
            }
            
            return next_byte;

        };


    /**************************************************************************
     *  __get_next_string()
     * 
     */
        const   __get_next_string = quote_char => {

            let token_buffer = quote_char;
            let last_byte = "";

            while (true) {
                let next_byte = __get_next_byte();

                if (next_byte === false) {
                    break;
                }

                last_byte = next_byte;
                token_buffer += next_byte;

                if (next_byte === quote_char && last_byte !== "\\") {
                    break;
                }
            }

            return token_buffer;

        };


    /**************************************************************************
     *  __get_next_token()
     * 
     */
        const   __get_next_token = next_byte => {

            let token_buffer = next_byte;
            let last_byte = "";

            while (true) {
                let next_byte = __get_next_byte();

                if (next_byte === false) {
                    break;
                }
                
                if (last_byte !== "\\") {
                    if (
                        __is_newline(next_byte)     ||
                        __is_quote(next_byte)       ||
                        __is_single(next_byte)      ||
                        __is_digit(next_byte)       ||
                        __is_whitespace(next_byte)
                    ) {
                        if (! __is_newline(next_byte) && !__is_whitespace(next_byte)) {
                            __script_byte--;
                        }

                        break;
                    }
                }

                last_byte = next_byte;
                token_buffer += next_byte;
            }

            return token_buffer;

        };


    /**************************************************************************
     *  __get_next_number()
     * 
     */
        const   __get_next_number = next_byte => {

            let token_buffer = next_byte;

            while (true) {
                let next_byte = __get_next_byte();

                if (next_byte === false) {
                    break;
                }

                if (! __is_digit(next_byte)) {
                    __script_byte--;
                    break;
                }

                token_buffer += next_byte;
            }

            return token_buffer;

        };

    
    /**************************************************************************
     *  __is_newline()
     */
        const   __is_newline = char => {

            return (
                char === "\n"       ||
                char === "\r\n"
            )
            ? true : false;

        };

    
    /**************************************************************************
     *  __is_quote()
     */
        const   __is_quote = char => {

            return (
                char === "'"        ||
                char === `"`        ||
                char === '`'
            )
            ? true : false;

        };

    
    /**************************************************************************
     *  __is_whitespace()
     */
        const   __is_whitespace = char => {

            return (
                char === " "        ||
                char === "\t"
            )
            ? true : false;

        };


    /**************************************************************************
     *  __is_digit()
     * 
     */
        const   __is_digit = char => {

            return (
                char >= '0' && char <= '9'
            )
            ? true : false;

        };

    
    /**************************************************************************
     *  __is_double()
     * 
     */
        const   __is_double = char => {

            const   next_byte = __peek_next_byte();

            if (char === '+') {
                return (
                    next_byte === '+'   ||
                    next_byte === '='
                ) ? true : false;
            }

            if (char === '-') {
                return (
                    next_byte === '-'   ||
                    next_byte === '='   ||
                    next_byte === '>'
                ) ? true : false;
            }

            if (char === '*') {
                return (
                    next_byte === '='
                ) ? true : false;
            }

            if (char === '/') {
                return (
                    next_byte === '='
                ) ? true : false;
            }

            if (char === '^') {
                return (
                    next_byte === '='
                ) ? true : false;
            }

            if (char === '|') {
                return (
                    next_byte === '|'   ||
                    next_byte === '='
                ) ? true : false;
            }

            if (char === '&') {
                return (
                    next_byte === '&'
                ) ? true : false;
            }

            if (char === '<') {
                return (
                    next_byte === '<'   ||
                    next_byte === '='   ||
                    next_byte === '-'
                ) ? true : false;
            }

            if (char === '>') {
                return (
                    next_byte === '>'   ||
                    next_byte === '='
                ) ? true : false;
            }

            if (char === '=') {
                return (
                    next_byte === '='
                ) ? true : false;
            }

            if (char === '!') {
                return (
                    next_byte === '='
                ) ? true : false;
            }

            return false;

        };

    
    /**************************************************************************
     *  __is_single()
     */
        const   __is_single = char => {

            return (
                char === "/"        ||
                char === "*"        ||
                char === "+"        ||
                char === "-"        ||
                char === "{"        ||
                char === "}"        ||
                char === "("        ||
                char === ")"        ||
                char === "["        ||
                char === "]"        ||
                char === ","        ||
                char === "~"        ||
                char === "!"        ||
                char === "%"        ||
                char === "^"        ||
                char === "="        ||
                char === "|"        ||
                char === "?"        ||
                char === "<"        ||
                char === ">"        ||
                char === '#'
            )
            ? true : false;

        };


    /**************************************************************************
     *  __eat_my_comment()
     */
        const   __eat_my_comment = () => {
            while (__script_byte < __script_data.length) {
                let next_byte = __get_next_byte();

                if (__is_newline(next_byte)) {
                    if (next_byte === "\r\n") {
                        __script_byte -= 2;
                    }
                    else {
                        __script_byte--;
                    }

                    return;
                }
            }
        };


    /**************************************************************************
     *  _get_tokens()
     * 
     */
        const   _get_tokens = script_line => {

            let tokens = [];

            let token_buffer = "";

            const   __add_token = () => {

                if (token_buffer.trim() !== "") {
                    tokens.push(token_buffer);
                    token_buffer = "";
                }

            };

            __script_byte = 0;
            __script_data = script_line;

            while (true) {
                let next_byte = __get_next_byte();

                if (next_byte === false) {
                    break;
                }

                if (__is_whitespace(next_byte) || __is_newline(next_byte)) {
                    continue;
                }

                if (__is_double(next_byte)) {
                    token_buffer = next_byte + __get_next_byte()
                    __add_token();
                    continue;
                }

                if (__is_single(next_byte)) {
                    if (next_byte === ",") {
                        continue;
                    }
                    
                    token_buffer = next_byte;
                    __add_token();
                    continue;
                }

                if (__is_quote(next_byte)) {
                    token_buffer = __get_next_string(next_byte);
                    __add_token();
                    continue;
                }

                if (__is_digit(next_byte)) {
                    token_buffer = __get_next_number(next_byte);
                    __add_token();
                    continue;
                }

                token_buffer = __get_next_token(next_byte);
                __add_token();
            }

            return {
                'status': "success",
                'tokens': tokens
            };

        };

    
    /**************************************************************************
     *  _get_lines()
     * 
     */
        const   _get_lines = (
            script_name,
            script_data
        ) => {

            let lines = [];

            let line_number = 1;
            let line_start = 1;
            let line_buffer = "";

            let last_byte = "";

            let quoted_string = false;
            let quoted_string_start = 1;

            const   __add_line = () => {

                if (line_buffer.trim() !== "") {
                    lines.push(`"${script_name}" ${line_start} ${line_buffer.trim()}`);
                    line_buffer = "";
                }

            }

            __script_data = script_data;
            __script_byte = 0;

            while (true) {
                let next_byte = __get_next_byte();

                if (next_byte === false) {
                    break;
                }

                if (next_byte === "//") {
                    __add_line();
                    __eat_my_comment();
                    continue;
                }

                if (__is_newline(next_byte)) {
                    line_number++;
                    
                    if (line_buffer.trim() === "") {
                        line_start = line_number;
                    }
                    if (! quoted_string && last_byte !== "\\") {
                        __add_line();
                        continue;
                    }
                }

                if (next_byte === ";" && ! quoted_string) {
                    __add_line();
                    continue;
                }

                if (__is_quote(next_byte) && last_byte !== "\\") {
                    if (quoted_string === false) {
                        quoted_string_start = line_start;
                        quoted_string = next_byte;
                    }
                    else {
                        if (quoted_string === next_byte) {
                            quoted_string = false;
                        }
                    }
                }

                if (line_buffer.trim() === "") {
                    line_start = line_number;
                }

                line_buffer += next_byte;
                last_byte = next_byte;
            }

            if (quoted_string) {
                return __helpers.err_object(`Error in file ${script_name} on line ${line_start}: Unterminated quoted string`);
            }

            __add_line();

            return {
                'status': 'success',
                'lines': lines
            };

        };


        return {
            
            get_lines:      _get_lines,
            get_tokens:     _get_tokens

        };

    };
