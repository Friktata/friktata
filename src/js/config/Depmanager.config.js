/******************************************************************************
 *  friktata/src/js/config/Depmanager.config.js
 * 
 */

    let builtins_path = "./builtins";
    let plugins_path  = "./../../PolyBASIC_plugins";

    console.log(`HOST = ${window.location.hostname}`)

    if (window.location.hostname !== "127.0.0.1" && window.location.hostname !== "localhost") {
        builtins_path = "https://github.com/Friktata/friktata/tree/master/src/js/core/PolyBASIC/builtins";
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
