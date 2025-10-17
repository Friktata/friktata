/******************************************************************************
 *  friktata/src/js/core/Helpers.js
 * 
 */

    import { Config } from "./../config/Config.js"


    export const Helpers = () => {

        const   __config = Config;


    /**************************************************************************
     *  _log()
     * 
     */
        const _log = log_message => {

            if (__config['enable_logging']) {
                console.log(log_message);
            }

        };


    /**************************************************************************
     *  _err_object()
     * 
     */
        const   _err_object = error_message => {
        
            return {
                'status': "failure",
                'message': error_message
            };

        };

    /**************************************************************************
     *  _strip_quotes()
     * 
     */
        const   _strip_quotes = string => {

            if (! string) {
                return;
            }

            if (typeof string === 'string') {
                string = string.trim();

                if (string.length < 2) {
                    return string;
                }

                let first_byte = string.substring(0, 1);
                let last_byte = string.substring((string.length - 1));

                if (first_byte !== last_byte) {
                    return string;
                }

                if (first_byte === '"' || first_byte === "`" || first_byte === `'`) {
                    return string.substring(1, (string.length - 1));
                }
            }

            return string;

        };


    /**************************************************************************
     *  _path_base()
     * 
     */
        const   _path_base = (
            path,
            separator = "/"
        ) => {

            if (! path || path.trim() === "") {
                return "";
            }

            let parts = path.split(separator);

            parts.pop();

            return parts.join(separator);

        };


    /**************************************************************************
     *  _path_name()
     * 
     */
        const   _path_name = (
            path,
            separator = "/"
        ) => {

            if (! path || path.trim() === "") {
                return "";
            }

            let parts = path.split(separator);

            return parts.pop();

        };

    
    /**************************************************************************
     *  _path_new()
     * 
     */
        const _path_new = (
            old_path,
            new_path,
            separator = '/'
        ) => {

            if (old_path.trim() === "") {
                return {
                    'status': "success",
                    'path': new_path
                };
            }

            if (new_path.trim() === "") {
                return {
                    'status': "success",
                    'path': old_path
                };
            }

            let _old = old_path.split(separator);
            let _new = new_path.split(separator);

            for (let index = 0; index < _new.length; index++) {
                if (_new[index] == ".") {
                    continue;
                }

                if (_new[index] == "..") {
                    if (_old.length < 1) {
                        return _err_object(`Error in _path_new(): Invalid path "${old_path}"`);
                    }
                    _old.pop();
                    continue;
                }

                _old.push(_new[index]);
            }

            if (_old.length) {
                return {
                    'status': "success",
                    'path': _old.join(separator)
                };
            }

            return {
                'status': "success",
                'path': ""
            };

        };


    /**************************************************************************
     *  _path_reduce()
     * 
     */
        const _path_reduce = (
            path,
            separator = '/'
        ) => {

            if (! path || path.trim() === "") {
                return {
                    'status': "success",
                    'path': path
                };
            }

            let parts = path.split(separator);
            
            if (parts.length === 1 && parts[0] === "..") {
                return _err_object(`Error in _path_reduce(): Invalid path "${path}"`);
            }

            for (let index = (parts.length + 1); index > 0; index--) {

                if (parts.length === 1 && parts[0] === "..") {
                    parts = [];
                    break;
                }

                if (parts[index] === "..") {
                    parts.splice(--index, 2);
                }
            }

            if (! parts.length) {
                return {
                    'status': "success",
                    'path': ""
                }
            }

            if (parts.length === 1) {
                return {
                    'status': "success",
                    'path': parts[0]
                }
            }

            return {
                'status': "success",
                'path': parts.join(separator)
            };

        }


        return {

            log:            _log,
            err_object:     _err_object,
            strip_quotes:   _strip_quotes,
            path_base:      _path_base,
            path_name:      _path_name,
            path_new:       _path_new,
            path_reduce:    _path_reduce

        };

    };
