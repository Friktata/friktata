/******************************************************************************
 *  friktata/src/js/config/Depmanager.config.js
 * 
 */

    let builtins_path = "./builtins";
    let plugins_path  = "./../../PolyBASIC_plugins";

    console.log(`HOST = ${window.location.host}`)

    if (window.location.host.substring(0, 9) === "127.0.0.1" || window.location.host.substring(0, 11) === "localhost") {
        modules_path = "https://github.com/Friktata/friktata/tree/master/src/js/core/PolyBASIC/builtins";
        plugins_path = "https://github.com/Friktata/friktata/tree/master/src/js/PolyBASIC_plugins";
    }

    export const DepmanagerConfig = (() => {

        return {

            'builtins_path':    builtins_path,

            'builtins':         [
                'IO',
                'File',
                'Strings'
            ],

            'plugins_path':     plugins_path,

            'plugins':          [
                'TerminalIO'
            ]

        };

    })();
