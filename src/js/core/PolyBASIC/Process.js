/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/Process.js
 * 
 */

    import { PolyBASICConfig } from "../../config/PolyBASIC.config.js";

    import { Helpers } from "../Helpers.js";


    export const Process = () => {

        const   __polybasic_config = PolyBASICConfig;
        const   __helpers = Helpers();

        const   __keywords = __polybasic_config['keywords'];


        let     __line_no = 0;
        let     __line_id = {};

        let     _lines = false;
        let     _proc = false;


    /**************************************************************************
     *  __process_new()
     * 
     */
        const   __process_new = (
            process_parent = false,
            process_id = __polybasic_config['root_node_id']
        ) => {
            
            let process_path = "";
            
            if (process_parent !== false) {
                process_path = process_parent.path + process_parent.id;
            };

            return {
                'path':         process_path,
                'parent':       process_parent,
                'id':           process_id,
                'code':         [],
                'name':         [],
                'data':         [],
                'mode':         []
            };

        };

    
    /**************************************************************************
     *  __process_mode()
     * 
     */
        const   __process_mode = (
            proc,
            tokens,
            obj_line
        ) => {

            obj_line['status'] = "success";

    //  We have a mode definition string if token 2 is the [
    //  character and token 4 is the ] character. The mode
    //  string is token 3.
    //
            if (tokens[2] !== "[") {
                return obj_line;
            }

            if (tokens.length < 5 || tokens[4] !== "]") {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Malformed mode string.`
                );
            }

            for (let char_no = 0; char_no < tokens[3].length; char_no++) {
                let char = tokens[3].substring(char_no, (char_no + 1));

                if (char === 'l') {
                    obj_line['mode']['locked'] = ! obj_line['mode']['locked'];
                }
                else if (char === 'r') {
                    obj_line['mode']['read'] = ! obj_line['mode']['read'];
                }
                else if (char === 'w') {
                    obj_line['mode']['write'] = ! obj_line['mode']['write'];
                }
                else if (char === 'x') {
                    obj_line['mode']['execute'] = ! obj_line['mode']['execute'];
                }
                else {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Unknown mode switch '${char}'`
                    );
                }
            }

    //  All of the mode tokens are removed.
    //
            tokens.splice(2, 3);

            return obj_line;

        };


    /**************************************************************************
     *  __process_validate_label()
     * 
     */
        const   __process_validate_label = (
            label,
            tokens
        ) => {

            if (__keywords.includes(label) || window.__methods.hasOwnProperty(label)) {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Label '${label}' matches reserved keyword.`
                );
            }

            if (! /^[a-zA-Z_]+$/.test(label.substring(0, 1))) {
                return __helpers.err_object(
                    `Error in ${tokens[0]} on line ${tokens[1]}: Invalid label prefix'${label.substring(0, 1)}'.`
                );
            }

            return {
                'status': "success"
            };

        };


    /**************************************************************************
     *  __process_line()
     * 
     */
        const   __process_line = (
            proc,
            tokens
        ) => {

            let process_path = _process_path(proc);

    //  Assume a blocked/scoped line...
    //
            let obj_line = {
                'status':       "success",
                'type':         "line",
                'line_id':      false,
                'mode':         structuredClone(__polybasic_config['line_mode_default'])
            };

    //  Is this the root node?
    //
            if (proc.id === __polybasic_config['root_node_id'] && proc.parent === false) {
                obj_line['mode'] = structuredClone(__polybasic_config['root_mode_default']);
            }

    //  Is this a block or a line?
    //
            if (tokens[2] === "block") {
                tokens.splice(2, 1);

                obj_line['type'] = "block";
                obj_line['mode'] = structuredClone(__polybasic_config['block_mode_default']);

                if (__polybasic_config['block_inherit']) {
                    if (proc.parent !== false) {
                        obj_line['mode'] = structuredClone(proc.parent.mode[proc.id]);
                    }
                }

                obj_line = __process_mode(proc, tokens, obj_line);

                if (tokens.length < 3) {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Block identifier expected`
                    )
                }
                if (tokens.length > 3) {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Junk tokens following block declaration`
                    )
                }

                let response = __process_validate_label(tokens[2], tokens);

                if (response.status !== "success") {
                    return response;
                }

                obj_line['line_id'] = tokens[2];
            }
            else {
    //  Does this line have an id? If so, store it in obj_line and remove
    //  the token.
    //
                if (/^[0-9]+$/.test(tokens[2])) {
                    obj_line['line_id'] = parseInt(tokens[2]);

                    __line_id[process_path] = obj_line['line_id'];
                
                    tokens.splice(2, 1);
                }
                else {
    //  There is no line number so we need to generate one, we do this using
    //  the current __line_id value..
    //
                    if (__polybasic_config['line_mode'] === 'increment') {
    //  If line_mode is increment we just add the line_increment value.
    //
                        __line_id[process_path] += __polybasic_config['line_increment'];
                    }
                    else {
    //  Otherwise we increase __line_id to the next multiple of line_increment.
    //
                        const increment = __polybasic_config['line_increment'];
                        
                        if (tokens[2] !== "endblock") {
                            if (__line_id[process_path] < increment) {
                                __line_id[process_path] = increment;
                            }
                            else {
                                let result = (__line_id[process_path] % increment) * increment;

                                if (result == 0) {
                                    result = increment;
                                }

                                __line_id[process_path] += result;
                            }    
                        }
                    }

                    obj_line['line_id'] = __line_id[process_path];
                }

              
                if (proc.id === __polybasic_config['root_node_id'] && proc.parent === false) {
                    obj_line['mode'] = structuredClone(__polybasic_config['root_mode_default']);
                }
                else {
                    obj_line['mode'] = structuredClone(__polybasic_config['line_mode_default']);
                }

                if (__polybasic_config['line_inherit']) {
                    if (proc.parent !== false) {
                        obj_line['mode'] = structuredClone(proc.parent.mode[proc.id]);
                    }
                }
                
                obj_line = __process_mode(proc, tokens, obj_line);

            }

            // console.log(JSON.stringify(obj_line, null, 3))

            return obj_line;

        };


    /**************************************************************************
     *  __process_lines()
     * 
     */
        const   __process_lines = proc => {

    //  Keep track of the __line_id for each individual process.
    //
            let process_path = _process_path(proc);

            if (! __line_id.hasOwnProperty(process_path)) {
                __line_id[process_path] = 0;
            }

            // __helpers.log(`>>> Processing block: ${process_path}`);

            for (; __line_no < _lines.length; __line_no++) {

                let tokens = _lines[__line_no];

                let response = __process_line(proc, tokens);

                if (response.status !== "success") {
                    return response;
                }

                if (response.type === "line") {
                    if (tokens[2] === "endblock") {
                        if (proc.id === "root" && proc.parent === false) {
                            return __helpers.err_object(
                                `Error in ${tokens[0]} on line ${tokens[1]}: Endblock not expected in root scope.`
                            );
                        }

                        __helpers.log(`>>> Returning from block ${proc.id} to ${_process_path(proc.parent)}`);

                        return {
                            'status': "success"
                        };
                    }

    //  Add a line of code to the current proc - if a line currently exists
    //  it will be overwritten.
    //
                    proc.name[response.line_id] = response.line_id;
                    proc.code[response.line_id] = tokens;
                    proc.mode[response.line_id] = response.mode;

                    // __helpers.log(`>>> Wrote line ${response.line_id} to ${process_path}: ${JSON.stringify(tokens, null, 3)}`);
                
                    continue;
                }

                if (proc.code[response.line_id] === undefined) {
                    proc.name[response.line_id] = response.line_id;
                    proc.code[response.line_id] = __process_new(_process_path(proc));
                    proc.mode[response.line_id] = response.mode;
                    
                    proc.code[response.line_id].id = response.line_id;
                    proc.code[response.line_id].parent = proc;
                }

                if (proc.parent) {
                    if (proc.parent.id === __polybasic_config['root_node_id']) {
                        proc.code[response.line_id].path = `${proc.parent.id}.${proc.id}`;
                    }
                    else {
                        proc.code[response.line_id].path = `${proc.path}.${proc.id}`;
                    }
                }
                else {
                    proc.code[response.line_id].path = __polybasic_config['root_node_id'];
                }
            
                __line_no++;

                let result = __process_lines(proc.code[response.line_id]);

                if (result.status !== "success") {
                    return result;
                }
                
            }

            return {
                'status': "success"
            };

        };


    /**************************************************************************
     *  _process_path()
     * 
     */
        const _process_path = proc => {

            if (proc.parent === false) {
                return proc.id;
            }

            return `${proc.path}.${proc.id}`;
        };


    /**************************************************************************
     *  __process_line_mode()
     * 
     */
        const   __process_line_mode = obj_mode => {

            let mode_str = "[";

            mode_str += (obj_mode.locked) ? "l" : "-";
            mode_str += (obj_mode.read) ? "r" : "-";
            mode_str += (obj_mode.write) ? "w" : "-";
            mode_str += (obj_mode.execute) ? "x" : "-";

            return `${mode_str}]`;

        };


    /**************************************************************************
     *  __process_print()
     *
     */
        function __process_print(
            proc,
            indent = 0,
            mode = __process_line_mode(__polybasic_config['root_mode_default'])
        ) {

            let _indent = " ".repeat(indent);
            let _indent_increment = 4;

            let path_info = "";

            if (proc.parent !== false) {
                path_info = `${proc.path}.`;
                mode += " ";
            }
            else {
                mode = "";
            }

            __helpers.log(`${_indent}${mode}${path_info}${proc.id}, ${proc.code.length} lines:\n`);
            
            let keys = Object.keys(proc.code);

            for (let line = 0; line < keys.length; line++) {
                let tokens = proc.code[keys[line]];
                let mode = __process_line_mode(proc.mode[keys[line]]);
                let str = `${_indent}${" ".repeat(4)}${mode} Line ${keys[line]}: `;
                
                if (Array.isArray(tokens)) {
                    for (let token = 0; token < tokens.length; token++) {
                        if (token) {
                            str += `, ${tokens[token]}`;
                        }
                        else {
                            str += tokens[token];
                        }
                    }

                    __helpers.log(`${str}`);

                    continue;
                }

                __process_print(tokens, (indent + _indent_increment), mode);
            }
        }


    /**************************************************************************
     *  _process()
     * 
     */
        const   _process = lines => {

            __helpers.log(`>>> Processing ${lines.length} lines...\n`);

            _proc = structuredClone(__process_new());
            _lines = lines;

    //  This keeps track of the current line being processed, i.e:
    //
    //      _lines[__process_line];
    //
            __line_no = 0;

            let response = __process_lines(_proc);

            if (response.status !== "success") {
                return response;
            }

            __process_print(_proc);

            return {
                'status': "success",
                'proc': _proc
            };

        };


        return {

            process:        _process

        };

    };
    