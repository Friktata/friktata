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
            ]

        }

    })();
