///////////////////////////////////////////////////////////////////////////////
//  friktata/src/js/config/Display.config.js
//

    export const DisplayConfig = (() => {

        return {

            'terminal':         "outer",
            'testcell':         "testcell",

        //  The display is a grid of character cells.
            'columns': {
                'small':        { 'width': 560, 'columns': 40 },
                'medium':       { 'width': 768, 'columns': 60 },
                'large':        { 'width': 1024, 'columns': 80 },
                'wide':         { 'width': 1400, 'columns': 120 }
            }

        }

    })();
