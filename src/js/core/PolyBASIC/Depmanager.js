/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/Depmanager.js
 * 
 */

    import { DepmanagerConfig } from "../../config/Depmanager.config.js";

    import { Helpers } from "../Helpers.js";


    export const Depmanager = async () => {

        const   __config = DepmanagerConfig;

        const   __helpers = Helpers();


        let     _modules = [];
        let     _methods = {};


    /**************************************************************************
     *  __module_load()
     * 
     */
        const __module_load = async (script_name) => {
            try {
                const path = `./${script_name}.js`;

                const mod = await import(path);

                return {
                    'status': "success",
                    'module': mod
                };
            } catch (err) {
                return __helpers.err_object(`Failed to load script "${script_name}": ${err}`);
            }
        };


    /**************************************************************************
     *  __module_register_methods()
     * 
     */
        const __module_register_methods = (mod_name) => {

            if (typeof _modules[mod_name].methods !== "function") {
                return __helpers.err_object(
                    `Error in __module_register_methods(): Module '${mod_name}' doesn't expose a valid 'methods()' function.`
                );
            }

            const methods = _modules[mod_name].methods();

            if (!methods || typeof methods !== "object") {
                return __helpers.err_object(
                    `Error in __module_register_methods(): Module '${mod_name}' returned invalid methods.`
                );
            }

            for (const method_name in methods) {
                if (_methods[method_name] !== undefined) {
                    return __helpers.err_object(
                        `Error in __module_register_methods(): Method '${method_name}' from module '${mod_name}' already exists.`
                    );
                }

                _methods[method_name] = methods[method_name];
                __helpers.log(`>>>     Registered method '${method_name}' from module '${mod_name}'`);
            }

            return {
                'status': "success" 
            };

        };


    /**************************************************************************
     *  _modules_load()
     * 
     */
        const _modules_load = async (
            deps_path,
            modules
        ) => {

            for (let mod = 0; mod < modules.length; mod++) {

                let script_path = `${deps_path}/${modules[mod]}`;

                __helpers.log(`>>> Registering module ${modules[mod]} (${script_path}.js)...`);

                if (_modules[modules[mod]] !== undefined) {
                    return __helpers.err_object(
                        `Error in _modules_load(): Module '${modules[mod]}' defined more than once.`
                    );
                }

                let response = await __module_load(script_path);

                if (response.status !== "success") {
                    return response;
                }

                const module_factory = response.module[modules[mod]];
                if (typeof module_factory !== "function") {
                    return __helpers.err_object(
                        `Error in _modules_load(): Module '${modules[mod]}' does not export a callable function.`
                    );
                }

                _modules[modules[mod]] = module_factory(); // <-- instantiate the module
                                
                response = __module_register_methods(modules[mod]);

                if (response.status !== "success") {
                    return response;
                }

                __helpers.log(`>>> Done!`);

            }
            
            __helpers.log(`>>>`);
            __helpers.log(`>>> Total modules: ${Object.keys(_modules).length}`);
            __helpers.log(`>>> Total methods: ${Object.keys(_methods).length}`);
            __helpers.log(`>>>`);

            return {
                'status': "success"
            };

        };


        return {

            modules_load:   _modules_load,
            modules:        _modules,
            methods:        _methods

        };

    };
