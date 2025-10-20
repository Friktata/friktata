/******************************************************************************
 *  friktata/src/js/core/Router.js
 * 
 */

    import { RouterConfig } from "./../config/Router.config.js";


    export const Router = async () => {

        const   __config = RouterConfig;


        let     _current_path = false;
        let     _current_page = false;

        let     _current_data = false;


    /**************************************************************************
     *  __validate_page_name()
     * 
     *  Page name must:
     * 
     *      Contain exactly __config['page_digits'] bytes
     *      Contain digits 0-9 only
     * 
     *  Anything else is invalid.
     * 
     */
        const   __validate_page_name = page_name => {

            if (page_name == '404') {
                return true;
            }

            if (page_name.length != __config['page_digits']) {
                return false;
            }

            if (! /^[0-9]+$/.test(page_name)) {
                return false;
            }

            return true;

        };


    /**************************************************************************
     *  __set_page()
     * 
     */
        const   __set_page = page_name => {

            if (page_name != 404) {
                _current_path = `${page_name.substring(0, 1)}000`;
            }

            _current_page = page_name;

        };


    /**************************************************************************
     *  __set_current_page()
     * 
     */
        const   __set_current_page = (
            page_name = false
        ) => {

            let hash = window.location.hash

            if (page_name !== false) {
                hash = page_name;
            }

            if (hash === "" || hash === "#") {
                hash = __config['default_page'];
            }

            if (hash.substring(0, 1) === "#") {
                hash = hash.substring(1);
            }

            if (! __validate_page_name(hash)) {
                hash = __config['not_found_page'];
            }

            __set_page(hash);

        };

    
    /**************************************************************************
     *  __fetch_page()
     * 
     */
        const   _fetch_page = async page_path => {

            const response = await fetch(page_path);

            if (! response.ok) {
                return false;
            }

            return response.text();
            
        };



    /**************************************************************************
     *  _load_page()
     * 
     */
        const   _load_page = async (
            page_name = false
        ) => {

            let page_path = _get_page_path(page_name);

            _current_data = _fetch_page(page_path);

            return _current_data;

        };


    /**************************************************************************
     *  _get_page_path()
     * 
     */
        const   _get_page_path = (
            page_path = false
        ) => {

            __set_current_page(page_path);

            if (_current_path === false || _current_path === "") {
                return `${__config['page_path']}/${_current_page}`;
            }

            return `${__config['page_path']}/${_current_path}/${_current_page}`;

        };

    
    /**************************************************************************
     *  _get_page_data()
     * 
     */
        const   _get_page_data = async (
            page_name = false
        ) => {

            if (page_name === false) {
                return _current_data;
            }

            let page_data = await _load_page();

            if (page_data === false) {
                page_data = await _load_page(__config['undefined_page']);
            }

        };

    
    /**************************************************************************
     *  _get_page_name()
     * 
     */
        const   _get_page_name = async (
            page_name = false
        ) => {

            let hash = window.location.hash;

            if (hash.substring(0, 1) === "#") {
                hash = hash.substring(1);
            }

            return hash;

        };


    /**************************************************************************
     *  __initialise()
     * 
     */
        const   __initialise = async () => {

            if (window.location.hash === "" || window.location.hash === "#") {
                window.location.hash = __config['default_page'];
            }

            let page_data = await _load_page();

            if (page_data === false) {
                page_data = await _load_page(__config['undefined_page']);
            }
            
        };


        const   _reset = async () => {

            await __initialise();

        };


        await __initialise();


        return {

            fetch_page:     _fetch_page,
            load_page:      _load_page,
            get_page_path:  _get_page_path,
            get_page_data:  _get_page_data,
            get_page_name:  _get_page_name,
            reset:          _reset

        };

    };
