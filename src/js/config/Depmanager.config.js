/******************************************************************************
 *  friktata/src/js/config/Depmanager.config.js
 * 
 */

    export const DepmanagerConfig = (() => {

        return {

            'builtins_path':    './builtins',

            'builtins':         [
                'IO',
                'File',
                'Strings'
            ],

            'plugins_path':     './../../PolyBASIC_plugins',

            'plugins':          [
                'TerminalIO'
            ]

        };

    })();
