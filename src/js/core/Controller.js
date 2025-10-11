/******************************************************************************
 *  friktata/src/js/core/Controller.js
 * 
 */

    import { DepmanagerConfig } from "../config/Depmanager.config.js";

    import { Display } from "./Display.js";
    import { Router } from "./Router.js";

    import { Depmanager } from "./PolyBASIC/Depmanager.js";

    import { PolyBASIC } from "./PolyBASIC.js";


    export const Controller = async () => {

        const   __display = Display();
        const   __router = await Router();

        const   __depmanager = await Depmanager();

        let     result = await __depmanager.modules_load(
            DepmanagerConfig['builtins_path'],
            DepmanagerConfig['builtins']
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

        await __polybasic.exec_script(__script_path, __script_data);

    };
