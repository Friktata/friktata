/******************************************************************************
 *  friktata/src/js/config/PolyBASIC.config.js
 * 
 */

    export const PolyBASICConfig = (() => {

        return {

            'include_path':         'xxxx',

            'root_mode_default':    {
                'read':             false,
                'write':            false,
                'execute':          true,
                'locked':           true
            },

            'line_mode_default':    {
                'read':             true,
                'write':            true,
                'execute':          true,
                'locked':           false
            },

            'block_mode_default':   {
                'read':             true,
                'write':            true,
                'execute':          false,
                'locked':           false
            },

            'root_node_id':         "root",

            'inherit_modes':        false,

            'line_start':           0,

            'line_mode':            "mult",

            'line_increment':       10,

            'keywords':             [
                'block',
                'endblock'
            ]

        }

    })();
