///////////////////////////////////////////////////////////////////////////////
//  friktata/src/js/config/Router.config.js
//

    export const RouterConfig = (() => {
        
        return {

            'page_path':        '../../../pages/',

            'default_page':     '0001',

            'undefined_page':   '9000/9999',

            'not_found_page':   '404',

    //  Numbers of digits in a page name, a value of 4 gives us up to
    //  10,000 pages (0000 - 9999).
    //
            'page_digits':      4
            
        };

    })();
