/******************************************************************************
 *  friktata/src/js/core/Controller.js
 * 
 */

    import { Display } from "./Display.js";
    import { Router } from "./Router.js";

    import { PolyBASIC } from "./PolyBASIC.js";


    export const Controller = async () => {

        const   __display = Display();
        const   __router = await Router();

        const   __polybasic = await PolyBASIC();

        const   __script_path = __router.get_page_path();
        const   __script_data = await __router.get_page_data();

        await __polybasic.exec_script(__script_path, __script_data);

    };
