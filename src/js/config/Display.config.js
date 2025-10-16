/******************************************************************************
 *  friktata/src/js/config/Display.config.js
 * 
 */

    export const DisplayConfig = (() => {

        return                      {

        //  The terminal option specifies the target HTML element
        //  id.
            'terminal':             "outer",

        //  The testcell is used to figure out the optimal font size given
        //  the number of columns.
            'testcell':             "testcell",

        //  The display is a grid of character cells.
            'columns': {
                'small':            { 'width': 560, 'columns': 40 },
                'medium':           { 'width': 768, 'columns': 60 },
                'large':            { 'width': 1024, 'columns': 80 },
                'wide':             { 'width': 1400, 'columns': 120 }
            },

            'cell_style':           {
                'foreground':       {
                    'red':          32,
                    'green':        220,
                    'blue':         127,
                    'alpha':        255
                },
                'background':       {
                    'red':          0,
                    'green':        0,
                    'blue':         0,
                    'alpha':        255
                }
            }

        }

    })();
