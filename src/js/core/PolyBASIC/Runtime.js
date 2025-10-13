/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/Runtime.js
 * 
 */

    import { Helpers } from "./../Helpers.js";

    import { Process } from "./Process.js";


    export const Runtime = () => {

        const   __helpers = Helpers();
        const   __process = Process();

        const   __indent_increment = 4;

        let     _proc = false;


    /**************************************************************************
     *  __resolve_node_path()
     * 
     */
        const   __resolve_node_path = (
            proc,
            tokens,
            start_token
        ) => {

            let result = {
                'status': "success",
                'tokens': tokens,
                'start': start_token,
                'end': start_token,
                'proc': proc,
                'reference': tokens[start_token],
                'mode': {
                    'private': false,
                    'read': false,
                    'write': false,
                    'locked': false,
                    'executable': false
                }
            };

            if (
                (start_token + 1) >= tokens.length ||
                (tokens[(start_token + 1)] !== "<-" && tokens[(start_token + 1)] !== "->")
            ) {
                return result;
            }

            if ((start_token + 2) >= tokens.length) {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Expected identifier`
                );
            }

            let operator = tokens[(start_token + 1)];
            let identifier = tokens[(start_token + 2)];


            for (let token = (start_token + 1); token < tokens.length;) {

                if (operator === "<-") {
                    if (proc.parent === false) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Attempt to access parent of "root" node`
                        );
                    }

                    proc = proc.parent;
                }
                else if (operator !== "->") {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Unexpected operator '${operator}'`
                    );
                }

                if (
                    (token + 1) >= tokens.length ||
                    (tokens[(token + 2)] !== "<-" && tokens[(token + 2)] !== "->")
                ) {
                    result.tokens = tokens;
                    result.start = start_token;
                    result.end = token;
                    result.proc = proc;
                    result.reference = identifier;

                    break;
                }

                if (operator === "->") {
                    if (proc.code[identifier] === undefined) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Reference to unknown block '${identifier}'`
                        );
                    }

                    proc = proc.code[identifier];
                }

                token += 2;

                operator = tokens[token];
                identifier = tokens[(token + 1)];

            }
          
            return result;

        };


    /**************************************************************************
     *  __resolve_node_base()
     * 
     */
        const   __resolve_node_base = (
            tokens,
            start_token
        ) => {

            if (start_token <= 2) {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Invalid token position`
                );
            }

            let token = (start_token - 1);

            while (token > 2) {
                let previous = tokens[token - 1];

                if (previous !== "->" && previous !== "<-") {
                    break;
                }

                token -= 2;
            }

            if (token < 2 || typeof tokens[token] !== "string") {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Expected valid base identifier`
                );
            }

            return {
                'status': "success",
                'tokens': tokens,
                'start': token,
                'end': start_token
            };
        };


    /**************************************************************************
     *  __handle_assignment()
     * 
     */
        const   __handle_assignment = (
            proc,
            tokens,
            token_start
        ) => {

            if (token_start < 3) {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Identifier expected before '='`
                );
            }

            let result = __resolve_node_base(tokens, token_start);

            if (result.status !== "success") {
                return result;
            }

            result = __resolve_node_path(proc, tokens, result.start);

            if (result.status !== "success") {
                return result;
            }

            tokens = result.tokens;

            if (proc.name[result.reference] === undefined) {
                proc.name[result.reference] = {};
            }

            result.proc.data[result.reference] = tokens[result.end + 2];
            tokens[result.start] = tokens[result.end + 2];

            return {
                'status': "success",
                'start': result.start,
                'end': result.end,
                'tokens': tokens
            };

        };


    /**************************************************************************
     *  __execute_translate_line()
     * 
     */
        const   __execute_translate_line = (
            proc,
            tokens
        ) => {

            // let result = __resolve_expression(tokens, 2, (tokens.length - 1));

            // if (result.status !== "success") {
            //     return result;
            // }

            for (let token = (tokens.length - 1); token > 1; token--) {

                if (tokens[token] === '=') {
                    let result = __handle_assignment(proc, tokens, token)

                    if (result.status !== "success") {
                        return result;
                    }

                    tokens = result.tokens;

                    tokens.splice(result.start + 1, (result.end - (result.start - 1)));
                    
                    token = tokens.length;

                    continue;
                }

                if (tokens[token] === 'here' || tokens[token] === 'global') {
                    let result;
                    
                    if (tokens[token] === 'here') {
                        result = __resolve_node_path(proc, tokens, token);
                    }
                    else {
                        result = __resolve_node_path(_proc, tokens, token);
                    }

                    if (result.status !== "success") {
                        return result;
                    }

                    tokens = result.tokens;

                    if (result.proc.name[result.reference] === undefined) {
                        tokens[result.start] = "(null)";
                    }
                    else {
                        tokens[result.start] = result.proc.data[result.reference];
                    }

                    tokens.splice(result.start + 1, (result.end - (result.start - 1)));

                    token = tokens.length;

                    continue;
                }

                if (tokens[token] === '=') {
                    let result = __handle_assignment(proc, tokens, token);

                    if (result.status !== "success") {
                        return result;
                    }

                    tokens = result.tokens;

                    continue;
                }

            }

            return {
                'status': "success",
                'tokens': tokens
            };

        };


    /**************************************************************************
     *  __execute_line()
     * 
     */
        const   __execute_line = (
            proc,
            tokens
        ) => {

            let result = __execute_translate_line(proc, tokens);

            if (result.status !== "success") {
                return result;
            }

            tokens = result.tokens;

            return {
                'status': "success",
                'tokens': tokens
            };

        };


    /**************************************************************************
     *  _execute()
     * 
     */
        const   _execute = (
            proc,
            indent = 0
        ) => {

            if (_proc === false) {
                _proc = proc;
            }

            let keys = Object.keys(proc.code);
            let path = proc.id;

            if (proc.parent !== false) {
                path = `${proc.path}.${proc.id}`;
            }

            __helpers.log(`>>> ${" ".repeat(indent)}Executing block: ${path}`);

            for (let line = 0; line < keys.length; line++) {

                let key = keys[line];

                let code = proc.code[key];
                let mode = proc.mode[key];
              
                if (! mode.execute) {
                    continue;
                }

    //  If the key is all digits then it's a line of code, otherwise it's
    //  a block.
    //
                if  (! /^[0-9_]+$/.test(key)) {
    //  Execute block.
    //
                    let result = _execute(code, (indent + __indent_increment));

                    if (result.status !== "success") {
                        return result;
                    }

                    __helpers.log(`>>> ${" ".repeat(indent + __indent_increment)}Returning to ${path}`);

                    continue;
                }

    //  Now the line of code is processed and a new set of tokens are
    //  generated.
    //


                let result = __execute_line(proc, code);

                if (result.status !== "success") {
                    return result;
                }

                __helpers.log(`>>> ${" ".repeat(indent + __indent_increment)}Executing line: ${result.tokens}`);
            }

            return {
                'status': "success"
            };

        };


        return {
        
            execute:        _execute

        };

    };
