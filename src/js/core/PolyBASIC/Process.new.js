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
                'code':         new Map(),
                'name':         new Map(),
                'data':         new Map(),
                'mode':         new Map()
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
                obj_line['mode'] = structuredClone(__polybasic_config['block_mode_default']);
            }

            if (__polybasic_config['inherit_modes']) {
                if (proc.parent !== false) {
                    obj_line['mode'] = structuredClone(proc.parent.mode[proc.id]);
                }
            }
            
            obj_line = __process_mode(proc, tokens, obj_line);

            if (obj_line.status !== "success") {
                return obj_line;
            }

    //  Is this a block or a line?
    //
            if (tokens[2] === "block") {
                obj_line['type'] = "block";
                obj_line['mode'] = structuredClone(__polybasic_config['block_mode_default']);

                if (tokens.length < 4) {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Block identifier expected`
                    )
                }
                if (tokens.length > 4) {
                    return __helpers.err_object(
                        `Error in ${tokens[0]} on line ${tokens[1]}: Junk tokens following block declaration`
                    )
                }
                obj_line['line_id'] = tokens[3];

                // if (__polybasic_config['inherit_modes']) {
                //     if (proc.parent !== false) {
                //         obj_line['mode'] = scructuredClose(proc.parent.mode[proc.id]);
                //     }
                //     // else {
                //     //     obj_line['mode'] = __polybasic_config['root_mode_default']
                //     // }
                //     // obj_line['mode'] = structuredClone();
                // }
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
                        __line_id[process_path] += __polybasic_config['line_increment'];
                    }
                    else {
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
            }

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

                        return {
                            'status': "success"
                        };
                    }

                    proc.name.set(response.line_id, response.line_id);
                    proc.code.set(response.line_id, tokens);
                    proc.mode.set(response.line_id, response.mode);
                
                    continue;
                }

                if (!proc.code.has(response.line_id)) {
                    proc.name.set(response.line_id, response.line_id);
                    proc.code.set(response.line_id, __process_new(_process_path(proc)));
                    proc.mode.set(response.line_id, response.mode);
                    
                    proc.code.get(response.line_id).id = response.line_id;
                    proc.code.get(response.line_id).parent = proc;
                }

                if (proc.parent) {
                    if (proc.parent.id === __polybasic_config['root_node_id']) {
                        proc.code.get(response.line_id).path = `${proc.parent.id}.${proc.id}`;
                    }
                    else {
                        proc.code.get(response.line_id).path = `${proc.path}.${proc.id}`;
                    }
                }
                else {
                    proc.code.get(response.line_id).path = __polybasic_config['root_node_id'];
                }
            
                __line_no++;

                let result = __process_lines(proc.code.get(response.line_id));

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
        const   _process_path = proc => {

            if (proc.parent === false) {
                return proc.id;
            }

            return `${proc.path}.${proc.id}`;
        };


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
     *  Dumps the process tree in classic BASIC listing style.
     */
        const   __process_print = (
            proc,
            indent = 0
        ) => {

            let _indent = " ".repeat(indent);
            let _indent_increment = 4;

            let path_info = "";
            let line_mode;

            if (proc.parent !== false) {
                path_info = `${proc.path}.`;
            }

            let line_count = 0;
            let block_count = 0;

            for (let entry of proc.code.values()) {
                if (Array.isArray(entry)) {
                    line_count++;
                }
                else if (entry instanceof Map || typeof entry === "object") {
                    block_count++;
                }
            }

            let block_info = block_count > 0 ? `, ${block_count} block${block_count > 1 ? "s" : ""}` : "";
            line_mode = __process_line_mode(proc.mode.get(proc.id));

            __helpers.log(`${_indent}${path_info}${line_mode}${proc.id} (${line_count} lines${block_info})`);

            let keys = Array.from(proc.code.keys()).sort((a, b) => {
                if (!isNaN(a) && !isNaN(b)) return a - b;
                return a.toString().localeCompare(b.toString());
            });

            for (let line_id of proc.code.keys()) {
                let tokens = proc.code.get(line_id);
                line_mode = __process_line_mode(proc.mode.get(line_id));

                let line_prefix = `${_indent}${" ".repeat(4)}${line_id} `;

                if (Array.isArray(tokens)) {
                    let content = tokens.join(" ").trim();
                    __helpers.log(`${line_prefix}${line_mode}${content}`);
                    continue;
                }

                __process_print(tokens, indent + _indent_increment);
                __helpers.log(`${_indent}${" ".repeat(4)}endblock ${tokens.id}`);
            }
        };


    /**************************************************************************
     *  _process()
     * 
     */
        const   _process = lines => {

            __helpers.log(`>>> Processing ${lines.length} lines...\n`);

            _proc = structuredClone(__process_new());
            _lines = lines;
            __line_id = {};

            __line_no = 0;

            let response = __process_lines(_proc);

            if (response.status !== "success") {
                return response;
            }

            __process_print(_proc);

            return response;

        };


        return {

            process:        _process

        };

    };
