/******************************************************************************
 *  friktata/src/js/core/Dsiplay.js
 * 
 */


    import { DisplayConfig } from "../config/Display.config.js";


    export const Display = (config) => {

        let __config = DisplayConfig;

        let __resize_handler = false;

        let _display_width;
        let _display_height;

        let _columns;
        let _rows;

        let _column_width;
        let _column_height;

        let _font_size;


    /**************************************************************************
     *  __number_of_columns()
     * 
     *  Returns the number of columns given the display width - see the
     *  ../config/Display.config.js file for more info.
     * 
     */
        const   __number_of_columns = () => {

            _display_width = document.getElementById(__config['terminal']).getBoundingClientRect().width;
            _display_height = document.getElementById(__config['terminal']).getBoundingClientRect().height;

            _columns = 0

            Object.keys(__config['columns']).forEach(key => {
                const width = __config['columns'][key]['width'];
                const columns = __config['columns'][key]['columns'];

                if (! _columns || _display_width > width) {
                    _columns = columns
                }
                else {
                    return;
                }
            });

        };


    /**************************************************************************
     *  __calculate_font_width()
     * 
     *  Calculates the required font width for the given number of columns
     *  on this display.
     * 
     */
        const   __calculate_font_width = () => {

            let last_font_size = 10;

            _font_size = last_font_size;

            __number_of_columns();

            while (true) {
                $(`#${__config['testcell']}`).css("font-size", `${_font_size}px`);

                _column_width = document.getElementById(__config['testcell']).getBoundingClientRect().width;
                _column_height = document.getElementById(__config['testcell']).getBoundingClientRect().height;

                if (((_column_width + .5) * _columns) >= _display_width) {
                    console.log(`Font size = ${last_font_size}, cell width = ${_column_width}`);
                    _rows = Math.floor(_display_height / _column_height);
                    break;
                }

                last_font_size = _font_size;
                _font_size += 1;
            }

            _font_size = last_font_size;

        };


    /**************************************************************************
     *  __build_display()
     * 
     *  Clears and builds the character-cell display dird.
     */
        const   __build_display = () => {

            __calculate_font_width();

            $(`#${__config['terminal']}`).html("");

            let html_out = "";

            let __top = Math.floor((_display_height - (_column_height * _rows)) / 2);
            let __left = Math.floor((_display_width - (_column_width * _columns)) / 2);

            for (let row = 0; row < _rows; row++) {
                for (let column = 0; column < _columns; column++) {
                    html_out += `
                        <div
                            id="cell_${column}_${row}"
                            class="cell"
                            style="
                                top: ${((row * _column_height) + __top)}px;
                                left: ${((column * _column_width) + __left)}px;
                                line-height: 0.8;
                                font-size: ${_font_size}px;
                                display: inline-block;
                                margin: 0;
                                padding: 0;
                            "
                        >
                            #
                        </div>
                    `
                }
            }

            $(`#${__config['terminal']}`).html(html_out);

        };


    /**************************************************************************
     *  __initialise()
     * 
     *  Builds the default display and initialises the resize handler.
     * 
     */
        const   __initialise = () => {

            console.log("Initialising Display");

            __build_display();

            $(window).on("resize", () => {
                if (__resize_handler) {
                    window.clearTimeout(__resize_handler);
                    __resize_handler = false;
                }

                __resize_handler = window.setTimeout(() => {
                    __build_display();
                }, 50);
            
                __build_display();
            });
        
        };


    /**************************************************************************
     *  _display_info()
     * 
     *  Returns an object with display parameters after the last build.
     * 
     */
        const   _display_info = () => {
        
            return {
                'display_width': _display_width,
                'display_height': _display_height,
                'column_width': _column_width,
                'column_height': _column_height,
                'columns': _columns,
                'rows': _rows,
                'font_size': _font_size
            };

        };

        __initialise();


        return {

            display_info: _display_info

        };

    };
