/******************************************************************************
 *  friktata/src/js/core/Controller.js
 * 
 */

    import { DepmanagerConfig } from "../config/Depmanager.config.js";

    import { Display } from "./Display.js";
    import { Router } from "./Router.js";
    import { Helpers } from "./Helpers.js";

    import { Depmanager } from "./PolyBASIC/Depmanager.js";

    import { PolyBASIC } from "./PolyBASIC.js";


    export const Controller = async () => {

        const   __display = Display();
        const   __router = await Router();
        const   __helpers = Helpers();

        const   __depmanager = await Depmanager();

        __helpers.log(`>>> I am PolyBASIC`)
        __helpers.log(`>>>`);
        __helpers.log(`>>> Initialising core modules from ${DepmanagerConfig['builtins_path']}...`);
        __helpers.log(`>>>`);

        let     result = await __depmanager.modules_load(
            DepmanagerConfig['builtins_path'],
            DepmanagerConfig['builtins']
        );

        if (result.status !== "success") {
            throw new Error(result.message);
        }

        __helpers.log(`>>> Initialising plugin modules from ${DepmanagerConfig['plugins_path']}...`);
        __helpers.log(`>>>`);

        result = await __depmanager.modules_load(
            DepmanagerConfig['plugins_path'],
            DepmanagerConfig['plugins']
        );

        if (result.status !== "success") {
            throw new Error(result.message);
        }

        window.__display = __display;
        window.__modules = __depmanager.modules;
        window.__methods = __depmanager.methods;

        const   __polybasic = await PolyBASIC();

        const   __script_path = __router.get_page_path();
        const   __script_data = await __router.get_page_data();

        result = await __polybasic.exec_script(__script_path, __script_data);

        if (result.status === "success") {
            __helpers.log(`>>>`);
            __helpers.log(`>>> That is a nice, clean exit|`);
        }
        else {
            throw new Error(result.message);
        }

        return result;

    };
