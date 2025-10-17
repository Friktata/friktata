/******************************************************************************
 *  friktata/src/js/config/PolyBASIC.config.js
 * 
 */

    let assets_path = "../../../assets";

    console.log(`HOST = ${window.location.host}`)

    if (window.location.host.substring(0, 9) === "127.0.0.1" || window.location.host.substring(0, 11) === "localhost") {
        assets_path = "https://github.com/Friktata/friktata/tree/master/pages";
    }

    export const PolyBASICConfig = (() => {

        return {

            'include_path':         'xxxx',

            'root_mode_default':    {
                'read':             false,
                'write':            false,
                'execute':          true,
                'locked':           true,
                'private':          false   // NOTE: This should always be false.
            },

            'line_mode_default':    {
                'read':             true,
                'write':            true,
                'execute':          true,
                'locked':           false,
                'private':          false
            },

            'block_mode_default':   {
                'read':             true,
                'write':            true,
                'execute':          false,
                'locked':           false,
                'private':          false
            },

            'root_node_id':         "root",

            'block_inherit':        false,
            'line_inherit':         false,

            'line_start':           0,

            'line_mode':            "mult",

            'line_increment':       10,

            'keywords':             [
                'block',
                'endblock',
                'global',
                'here',
                'parent',
                'private',
                'if',
                'elseif',
                'else',
                'goto',
                'exec'
            ],

            'file_path':            './../../assets'

        }

    })();
