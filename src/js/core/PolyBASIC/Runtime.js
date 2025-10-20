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

        let     __goto = false;

        let     _proc = false;

        let     __lines = [];
        let     __procs = [];


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
                    (token + 2) >= tokens.length ||
                    (tokens[(token + 2)] !== "<-" && tokens[(token + 2)] !== "->")
                ) {
                    result.tokens = tokens;
                    result.start = start_token;
                    result.end = token;
                    result.proc = proc;
                    result.reference = identifier;

                    break;
                }

                // if (operator === "->") {
                    if (proc.code[identifier] === undefined) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Reference to unknown block '${identifier}'`
                        );
                    }

                    proc = proc.code[identifier];
                // }

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

            if (start_token < 2) {
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

            let response = __resolve_node_base(tokens, token_start);

            if (response.status !== "success") {
                return result;
            }

            let base_end = response.end;
            let result;

            if (tokens[response.start] === 'global') {
                result = __resolve_node_path(_proc, tokens, response.start);
            }
            else {
                result = __resolve_node_path(proc, tokens, response.start);
            }

            if (result.status !== "success") {
                return result;
            }

            tokens = result.tokens;

            if (result.proc.name[result.reference] === undefined) {
                result.proc.name[result.reference] = {};
            }

            if (typeof tokens[(base_end + 1)] === 'string') {
                if (tokens[(base_end + 1)].trim() === "") {
                    tokens[(base_end + 1)] = `"${tokens[(base_end + 1)]}"`;
                }
            }

            result.proc.data[result.reference] = tokens[(base_end + 1)];
            
            tokens.splice(result.start, (result.end - result.start));
            tokens[result.start] = tokens[base_end + 1];

            return {
                'status': "success",
                'start': result.start,
                'end': result.end,
                'tokens': tokens
            };

        };


    /**************************************************************************
     *  __execute_function()
     * 
     */
        const   __execute_function = async (
            proc,
            tokens,
            token_start,
            operator = -1
        ) => {

            let function_name = tokens[token_start];
            let position = (token_start + 1);

            let token_end;

            for (token_end = position; token_end < tokens.length; token_end++) {
                if (tokens[token_end] === ']') {
                    break;
                }
            }

            if (token_end >= tokens.length) {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Expected ']' token`
                );
            }

    //  Does the function even exist? It might not!
    //
    //  I mean...right?
    //
            if (! window.__methods.hasOwnProperty(function_name)) {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Call to unknown function '${function_name}'`
                );
            }

            if (tokens[position] !== "[" || tokens[token_end] !== "]") {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Malformed call to function '${function_name}'`
                );
            }

            position++;

            let params = {};
            let f_params = window.__methods[function_name]['params'];
            let last_param = false;

            for (let param = 0; param < f_params.length; param++) {
                if (tokens[(position + param)] === "]") {
                    last_param = true;
                }

                // if ((position + param) >= tokens.length) {
                //     return __helpers.err_object(
                //         `Error in ${tokens[0]} on line ${tokens[1]}: Function '${function_name}' expects ${f_params.length} parameters`
                //     );
                // }

                if (typeof tokens[(position + param)] === 'string') {
                    tokens[(position + param)] = __helpers.strip_quotes(tokens[(position + param)]);
                }

                if (last_param === true) {
                    if (! f_params[param].hasOwnProperty('default')) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}, ${function_name}: The '${f_param[param]['name']}' parameter is required`
                        );
                    }

                    params[f_params[param]['name']] = f_params[param]['default'];
                    continue;
                }

                if (f_params[param]['type'] === 'number') {
                    params[f_params[param]['name']] = parseInt(tokens[(position + param)]);
                }
                else {
                    params[f_params[param]['name']] = tokens[(position + param)]
                }
            }

            let result;
            
            if (window.__methods[function_name]['async'] === true) {
                result = await window.__methods[function_name]['callback'](params);
            }
            else {
                result = window.__methods[function_name]['callback'](params);
            }

            if (result === "undefined" || typeof result === "undefined") {
                result = 0;
            }

            if (operator > 2) {
                if ((operator + 1) >= tokens.length) {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Operand expected following '${tokens[operator]}' operator`
                    );
                }

                tokens.splice((token_start + 1), (token_end - (token_start - 1)));

                result = __handle_expression(proc, tokens, (token_start + 1));

                if (result.status !== "success") {
                    return result;
                }
            }
            else {
                tokens.splice((token_start + 1), (token_end - (token_start)));
            }

            if (token_start > 2) {
                tokens[token_start] = result;
            }
            else {
                tokens.splice(2, 1);
            }
            
            return {
                'status': "success",
                'tokens': tokens
            };

        };


    /**************************************************************************
     *  __translate_var()
     * 
     */
        const   __translate_var = (
            proc,
            tokens,
            token,
            operator = -1
        ) => {

            let result;

            if (tokens[token] === 'here') {
                result = __resolve_node_path(proc, tokens, token);
            }
            else if (tokens[token] === "global") {
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
            
            if (operator > 2) {
                operator -= (result.end - (result.start - 1));

                if ((operator + 1) >= tokens.length) {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Operand expected following '${tokens[operator]}' operator`
                    );
                }

                result = __handle_expression(proc, tokens, result.start, operator);

                if (result.status !== "success") {
                    return result;
                }
            }

            return {
                'status': "success",
                'tokens': tokens
            };

        };


    /**************************************************************************
     *  __is_expr()
     */
        const   __is_expr = (
            token
        ) => {

            return (
                token === "+"       ||
                token === "-"       ||
                token === "*"       ||
                token === "/"       ||
                token === "=="      ||
                token === "!="      ||
                token === "<="      ||
                token === ">="      ||
                token === "<"       ||
                token === ">"       ||
                token === "&&"      ||
                token === "||"
            ) ?  true : false;

        };


    /**************************************************************************
     *  __handle_expression()
     * 
     */
        const   __handle_expression = (
            proc,
            tokens,
            token_start
        ) => {

            let operator = tokens[token_start + 1];

            let result;

            let l_value = __helpers.strip_quotes(tokens[token_start]);
            let r_value = __helpers.strip_quotes(tokens[(token_start + 2)]);

            if (typeof l_value === "string" && typeof r_value !== "string") {
                l_value = parseInt(l_value);
            }
            if (typeof r_value === "string" && typeof l_value !== "string") {
                r_value = parseInt(r_value);
            }

            // if (operator === "+" || operator === "-" || operator === "/" || operator === "*") {
            if (operator !== "==" && operator !== "!=") {
                if (typeof l_value === 'string') l_value = parseInt(l_value);
                if (typeof r_value === 'string') r_value = parseInt(r_value);
            }

            // console.log(`>>> TESTING ${l_value} (${typeof l_value}) ${operator} ${r_value} (${typeof r_value})`)

            switch (operator) {

                case '+':
                    result = (l_value + r_value);
                    break;
                case '-':
                    result = (l_value - r_value);
                    break;
                case '*':
                    result = (l_value * r_value);
                    break;
                case '/':
                    result = (l_value / r_value);
                    break;
                case '==':
                    result = (l_value == r_value);
                    break;
                case '!=':
                    result = (l_value != r_value);
                    break;
                case '<=':
                    result = (l_value <= r_value);
                    break;
                case '>=':
                    result = (l_value >= r_value);
                    break;
                case '<':
                    result = (l_value < r_value);
                    break;
                case '>':
                    result = (l_value > r_value);
                    break;
                case '&&':
                    result = (l_value && r_value);
                    break;
                case '||':
                    result = (l_value || r_value);
                    break;
                default:
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Unknown operator '${operator} ${tokens}'`
                    );
            }

            if (typeof result === "number") {
                result = Math.floor(result);
            }
            
            tokens[token_start] = result.toString();
            tokens.splice((token_start + 1), 2);

            return {
                'status': "success",
                'tokens': tokens
            };

        };


    /**************************************************************************
     *  __execute_goto()
     * 
     */
        const   __execute_goto = (
            proc,
            tokens,
            token_start
        ) => {

            let next_node = false;
            let next_proc = proc;

            for (let token = token_start + 1; token <= tokens.length; token += 2) {

                if (
                    token >= tokens.length ||
                    (tokens[token] !== "<-" && tokens[token] !== "->")
                ) {
                    token--;

                    if (/^[0-9]+$/.test(tokens[token])) {
                        __goto = {
                            'next_line': `${tokens[token]}`,
                            'proc': next_proc,
                            'tokens': tokens
                        };
                        return {
                            'status': "success",
                            'tokens': tokens
                        };
                    }
                    else {
                        __goto = {
                            'next_line': false,
                            'proc': next_proc,
                            'tokens': tokens
                        };
                        return {
                            'status': "success",
                            'tokens': tokens
                        };
                    }
                }

                if (tokens[token] === "<-") {
                    if (next_proc.parent === false) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Attempt to access parent node of "root"`
                        );
                    }

                    next_proc = next_proc.parent;
                    token--;

                    continue;
                }
                else {
                    if (tokens[token] === "->") {
                        if ((token + 1) >= tokens.length) {
                            return __helpers.err_object(
                                `Error in ${tokens[0]} on line ${tokens[1]}: Expected identifier following 'goto->'`
                            );
                        }

                        next_node = tokens[(token + 1)];

                        if (! /^[0-9]+$/.test(next_node)) {
                            if (! next_proc.code.hasOwnProperty(next_node)) {
                                return __helpers.err_object(
                                    `Error in ${tokens[0]} on line ${tokens[1]}: Reference to undefined procedure '${next_node}' in '${proc.path}->${proc.id}'`
                                );
                            }

                            next_proc = next_proc.code[next_node];
                        }
                    }
                    else {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Expected identifier`
                        );
                    }
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
        const   __execute_line = async (
            proc,
            tokens,
            token_start = false
        ) => {

            let token = token_start;
            let operator = -1;

            if (token === false) {
                token = (tokens.length - 1);
            }

            let result;

            for (; token >= 2; token--) {

                if (__is_expr(tokens[token])) {
                    operator = token;
                    continue;
                }

    //  Is this a variable reference? If so it will start with either
    //  'here' or 'global'.
    //
                if (tokens[token] === 'here' || tokens[token] === 'global') {
                    result = __translate_var(proc, tokens, token, operator);

                    if (result.status !== "success") {
                        return result;
                    }

                    tokens = result.tokens;
                    token = tokens.length;

                    operator = -1;

                    continue;
                }

    //  Dot concatenation.
    //
                if ((token + 1) < tokens.length && tokens[(token + 1)] === ".") {
                    if ((token + 2) >= tokens.length) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Expected token following '.'`
                        );
                    }
                    
                    if (tokens[(token - 1)] !== "<-" && tokens[(token - 1)] !== "->") {  
                        let l_string = __helpers.strip_quotes(tokens[token]);
                        let r_string = __helpers.strip_quotes(tokens[(token + 2)]);

                        tokens[token] = `"${l_string}${r_string}"`;
                        tokens.splice(token + 1, 2);
                        token = tokens.length;

                        continue;
                    }
                }

    //  Is this a variable reference? If so it will start with either
    //  'here' or 'global'.
    //
                if (tokens[token] === 'goto') {
                    if (
                        (token + 1) >= tokens.length || 
                        (tokens[(token + 1)] !== "->" && tokens[(token + 1)] !== "<-")
                    ) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Directional operator expected following '${tokens[token]}'`
                        );
                    }

                    if ((token + 2) >= tokens.length) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Identifier expected following '${tokens[token]}${tokens[(token + 1)]}'`
                        );
                    }

                    if (tokens[token] === 'goto') {
                        result = __execute_goto(proc, tokens, token);
                    }

                    if (result.status !== "success") {
                        return result;
                    }

                    continue;
                }

    //  Handle assignments.
    //
                if (tokens[token] === '=') {
                    result = __handle_assignment(proc, tokens, token)

                    if (result.status !== "success") {
                        return result;
                    }

                    tokens = result.tokens;
                    tokens.splice(result.start + 1, (result.end - (result.start - 1)));
                    token = tokens.length;

                    continue;
                }

    //  Close a mathematical/logical expression.
    //
                if (tokens[token] === '(') {
                    if (token_start === false) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Unexpected '(' token`
                        );
                    }

                    tokens.splice(token, 1);

                    return {
                        'status': "success",
                        'token_position': token,
                        'tokens': tokens
                    };
                }
                
    //  Open a new mathematical/logical expression.
    //
                if (tokens[token] === ')') {
                    tokens.splice(token--, 1);

                    if (token < 2) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${token[1]}: Unexpected ')' token`
                        );
                    }

                    result = await __execute_line(proc, tokens, token);

                    if (result.status !== "success") {
                        return result;
                    }

                    tokens = result.tokens;
                    token = tokens.length;

                    operator = -1;

                    continue;
                }

    //  Handle function calls.
    //
                if (window.__methods.hasOwnProperty(tokens[token])) {
                    result = await __execute_function(proc, tokens, token, operator);

                    if (result.status !== "success") {
                        return result;
                    }

                    tokens = result.tokens;
                    token = tokens.length;

                    operator = -1;

                    continue;
                }

                if (operator !== -1 && tokens[token] !== "<-" && tokens[token] !== "->") {
                    if ((token - 1) >= 2 && (tokens[(token - 1)] !== "<-" && tokens[(token - 1)] !== "->")) {
                        result = __handle_expression(proc, tokens, token);

                        if (result.status !== "success") {
                            return result;
                        }

                        tokens = result.tokens;
                        token = tokens.length;

                        operator = -1;
                    }
                }

            }

            if (token_start !== false) {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Expected '(' token`
                )
            }

            return {
                'status': "success",
                'tokens': tokens
            };

        };

    /**************************************************************************
     *  __parse_conditional_expression()
     * 
     */
        const   __parse_conditional_expression = (
            proc,
            tokens,
            token_start
        ) => {

            let parens = 0;
            let blocks = 0;
            
            if (tokens[token_start] !== '[' && tokens[token_start] !== '(') {
                return {
                    'status': "success",
                    'start': token_start,
                    'enx': token_start,
                    'tokens': tokens,
                    'expr_tokens': tokens[token_start]
                };
            }

            if (tokens[token_start] === '[') {
                tokens[token_start] = '(';
                blocks++;
            }
            else {
                parens++;
            }

            let expr_tokens = [
                tokens[0],
                tokens[1],
                tokens[token_start]
            ];

            for (let token = (token_start + 1); token < tokens.length; token++) {

                if (blocks === 0 && parens === 0) {
                    if (expr_tokens[(expr_tokens.length - 1)] === ']') {
                        expr_tokens[(expr_tokens.length - 1)] = ')';
                    }

                    return {
                        'status': "success",
                        'start': token_start,
                        'end': token,
                        'tokens': tokens,
                        'expr_tokens': expr_tokens
                    };
                }

                if (tokens[token] === '[') {
                    blocks++;
                }
                else if (tokens[token] === ']') {
                    blocks--;
                }
                else if (tokens[token] === '(') {
                    parens++;
                }
                else if (tokens[token] === ')') {
                    parens--;
                }

                tokens[token] = __helpers.strip_quotes(tokens[token]);

                if (tokens[token].trim() === "") {
                    tokens[token] = `"${tokens[token]}"`;
                }

                expr_tokens.push(tokens[token]);

            }

            return __helpers.err_object(
                `Error in ${tokens[0]} on line ${tokens[1]}: Maformed expression`
            );

        };


    /**************************************************************************
     *  __execute_conditional_line()
     * 
     */
        const   __execute_conditional_line = async (
            proc,
            tokens,
            indent,
            __indent_increment
        ) => {

            let obj_expr =      {
                '__if':         [],
                '__elseif':     [],
                '__else':       []
            };

            let obj_code =      {
                '__if':         [],
                '__elseif':     [],
                '__else':       []
            };

            let is_true = false;

            let condition = '__if';

            for (let token = 3; token < tokens.length; token++) {

                if (tokens[token] === 'if') {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Unexpected 'if' token`
                    );
                }

                if (tokens[token] === 'elseif') {
                    if (obj_expr['__if'].length === 0) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Missing expression for 'if'`
                        );
                    }
                    if (obj_expr['__else'].length > 0) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Unexpected 'elseif'`
                        );
                    }

                    condition = '__elseif';
                    token++;
                }

                if (tokens[token] === "else") {
                    if (obj_expr['__if'].length === 0) {
                        return __helpers.err_object(
                            `Error in ${tokens[0]} on line ${tokens[1]}: Missing expression for 'if'`
                        );
                    }

                    condition = '__else';
                    token++;
                }
                
                let expr_tokens = [];
                let expr_code = [
                    tokens[0],
                    tokens[1]
                ];

                if (condition !== "__else") {
                    let result = __parse_conditional_expression(proc, tokens, token);

                    if (result.status !== "success") {
                        return result;
                    }

                    tokens = result.tokens;
                    expr_tokens = result.expr_tokens;

                    tokens.splice(result.start, (result.end - result.start));

                    token = result.start;
                }

                while (token < tokens.length) {
                    if (tokens[token] === 'elseif' || tokens[token] === 'else') {
                        token--;
                        break;
                    }

                    expr_code.push(tokens[token++]);
                }

                if (condition === '__elseif') {
                    obj_expr[condition].push(expr_tokens);
                    obj_code[condition].push(expr_code);
                }
                else {
                    obj_expr[condition] = [ ... expr_tokens ];
                    obj_code[condition] = [ ... expr_code ];
                }

            };

            let result = await __execute_line(proc, obj_expr['__if']);

            if (result.status !== "success") {
                return result;
            }

            if (obj_expr['__if'][2] !== "false" && obj_expr['__if'][2] !== false && obj_expr['__if'][2] !== 0) {
                is_true = true;
                result = await __execute_line(proc, obj_code['__if']);

                if (result.status !== "success") {
                    return result;
                }
            }

            for (let elseif = 0; elseif < obj_expr['__elseif'].length; elseif++) {
                result = await __execute_line(proc, obj_expr['__elseif'][elseif]);

                if (result.status !== "success") {
                    return result;
                }

                obj_expr['__elseif'][elseif] = result.tokens;

                if (obj_expr['__elseif'][elseif][2] !== "false" && obj_expr['__elseif'][elseif][2] !== false && obj_expr['__elseif'][elseif][2] !== 0) {
                    is_true = true;

                    result = await __execute_line(proc, obj_code['__elseif'][elseif]);

                    if (result.status !== "success") {
                        return result;
                    }
                }
            }

            if (! is_true && obj_code['__else'].length > 0) {
                result = await __execute_line(proc, obj_expr['__else']);

                if (result.status !== "success") {
                    return result;
                }

                if (obj_expr['__if']) {
                    is_true = true;

                    result = await __execute_line(proc, obj_code['__else']);

                    if (result.status !== "success") {
                        return result;
                    }                
                }
            }

            return {
                'status':   "success",
                'tokens':   tokens
            };

        };


    /**************************************************************************
     *  _execute()
     * 
     */
        const   _execute = async (
            proc,
            indent = 0,
            start_token = false
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
            window.__methods['setproc']['callback'](_proc);

            for (let line = 0; line <= keys.length; line++) {


                if (_proc.hasOwnProperty('status')) {
                    if (_proc['status'] == 'stop') {
                        return {
                            'status': "success"
                        };
                    }
                }

                if (line >= keys.length) {
                    if (__procs.length > 0) {
                        proc = __procs.pop();
                        line = __lines.pop();

                        keys = Object.keys(proc.code);
                        path = proc.id;
                    }
                    else {
                        if (__goto === false) {
                            break;
                        }
                    }
                }

                if (__goto === false) {
                    if (line >= keys.length)
                        break;
                }

                if (__goto !== false) {
                    if (__goto['next_line'] === false) {
                        __procs.push(proc);
                        __lines.push(line);

                        proc = __goto['proc'];
                        
                        keys = Object.keys(proc.code);
                        path = proc.id;

                        line = 0;
                    }
                    else {
                        if (! keys.includes(`__${__goto['next_line']}__`)) {
                            return __helpers.err_object(
                                `Error in ${__goto.tokens[0]} on line ${__goto.tokens[1]}: Reference to undefined line '${__goto['next_line']}' in '${proc.path} ${proc.id}'`
                            );
                        }

                        line = (keys.indexOf(`__${__goto['next_line']}__`));
                    }
                    __goto = false;
                }

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
                    let result = await _execute(code, (indent + __indent_increment));

                    if (result.status !== "success") {
                        return result;
                    }

                    __helpers.log(`>>> ${" ".repeat(indent + __indent_increment)}Returning to ${path}`);

                    continue;
                }

    //  If statements must be handled here - we check the 3rd
    //  token (code[2])
    // 
                if (code[2] === 'if') {
                    let result = await __execute_conditional_line(proc, [ ... code ], indent, __indent_increment);

                    if (result.status !== "success") {
                        return result;
                    }

                    continue;
                }

    //  Execute line.
    //
                let result = await __execute_line(proc, [ ... code ]);

                if (result.status !== "success") {
                    return result;
                }

                __helpers.log(`>>> ${" ".repeat(indent + __indent_increment)}Executed line: ${code} -- ${result.tokens}`);
            }

            return {
                'status': "success"
            };

        };

    
    /**************************************************************************
     *  _reset()
     * 
     */
        const   _reset = () => {

            __goto = false;
            _proc = false;

            __procs = [];
            __lines = [];

        };


        return {
        
            execute:        _execute,
            reset:          _reset

        };

    };
