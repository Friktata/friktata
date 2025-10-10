/******************************************************************************
 *  friktata/src/js/config/Router.config.js
 * 
 */

    export const RouterConfig = (() => {
        
        return                  {

    //  Relative path to all pages.
            'page_path':        '../../../pages',

    //  Default page displayed if no specific page is requested.
            'default_page':     '0001',

    //  Page to display for 'undefined' pages - what does this mean?
    //  Some pages may not exist, e.g we might request page 1234, if
    //  there is no page 1234 this page is run in its place.
            'undefined_page':   '9999',

    //  Not found, this is what is returned when an invalid page is
    //  requested. Page 1234 might not exist, but it's still a valid
    //  page number hence 'undefined' page.
            'not_found_page':   '404',

    //  Numbers of digits in a page name, a value of 4 gives us up to
    //  10,000 pages (0000 - 9999).
            'page_digits':      4
            
        };

    })();
