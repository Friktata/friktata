///////////////////////////////////////////////////////////////////////////////
//  friktata/src/js/core/Router.js
//

    import { RouterConfig } from "./../config/Router.config.js";


    export const Router = async () => {

        const __config = RouterConfig;


        let _current_page = __config['default_page'];
        let _page_path = false;

        let _page_cache = {};


        const __fetch_page = async page_path => {

            const response = await fetch(page_path);

            if (! response.ok) {
                return false;
            }

            const contentType = response.headers.get("content-type") || "";

            // if (contentType.includes("application/json") || page_path.endsWith(".json")) {
            //     return response.json();
            // }

            // if (contentType.includes("text/") || page_path.endsWith(".txt") || page_path.endsWith(".csv") || page_path.endsWith(".html")) {
            //     return response.text();
            // }

            // if (contentType.includes("image/")) {
            //     return response.blob();
            // }

            return response.text();
            
        };


        const __load_page = async (
            page_name = false
        ) => {

            let page = window.location.hash;

            _page_path = false;

            if (page_name) {
                page = page_name;
            }

            if (page !== "" && page !== "#") {
                if (page.substring(0, 1) === "#") {
                    page = page.substring(1);
                }

                if (page.length != __config['page_digits'] || ! /^[0-9]+$/.test(page)) {
                    page = _page_path = `${__config['page_path']}${__config['not_found_page']}`;
                }
            }
            
            if (_page_path === false) {
                if (page === "" || page === "#") { 
                    page = __config['default_page'];
                }

                let page_range = "";

                for (let digit = 0; digit < __config['page_digits']; digit++) {
                    page_range += page.substring(digit, 1);
                }

                _page_path = `${__config['page_path']}${page_range}/${page}`;
            }

            let page_data = await __fetch_page(_page_path);


            console.log(`>>>>>>>>>>>>Set page to ${_page_path}`);
            if (page_data === false) {
                page = __config['undefined_page'];
                _page_path = `${__config['page_path']}${page}`;
                page_data = await __fetch_page(`${_page_path}`);
            }

            console.log(`Set page to ${_page_path}:\n${page_data}`);

        };


        const __initialise = async () => {
            
            await __load_page();

        };


        await __initialise();


        return {

        };

    };
