///////////////////////////////////////////////////////////////////////////////
//  griktata/src/js/app.js
//

    import { Controller } from "./core/Controller.js";
    

    (async function Main() {

        document.fonts.ready.then(async () => {
            const   __controller = await Controller();
        });

    })();
    