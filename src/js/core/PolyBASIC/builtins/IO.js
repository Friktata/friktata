/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/IO.js
 * 
 */

    export const IO = () => {

    /**************************************************************************
     *  print()
     */
        const   print = (
            obj_params = []
        ) => {

            console.log(obj_params['string']);

            return "OK";

        };


    /**************************************************************************
     *  sleep()
     */
        const   sleep = async (
            obj_params = []
        ) => {

            if (! obj_params.hasOwnProperty('duration')) {
                return "Error in sleep(): Function expects exactly 1 parameter"
            }

            let duration = obj_params['duration'];

            if (duration <= 0) {
                return;
            }
            
            return new Promise(resolve => setTimeout(resolve, duration));

        };


    /**************************************************************************
     *  getch()
     * 
     */
        const   getch = async (
            obj_params = []
        ) => {
            
            let delay = obj_params['delay'];

            if (delay <= 0) {
                return new Promise(resolve => {
                    const handler = (event) => {
                        document.removeEventListener('keydown', handler);
                        resolve(event.key);
                    }
                    document.addEventListener("keydown", handler);
                });
            }

            return new Promise(resolve => {
                const handler = (event) => {
                    clearTimeout(timeoutId);
                    document.removeEventListener('keydown', handler);
                    resolve(event.key); 
                };

                document.addEventListener('keydown', handler);

                let timeoutId;

                timeoutId = setTimeout(() => {
                    document.removeEventListener('keydown', handler);
                    resolve("");
                }, delay);
            });

        };


    /**************************************************************************
     *  getscroll()
     * 
     */
        const   getscroll = async (
            obj_params = {}
        ) => {

            let delay = obj_params['delay'] ?? 0;

            if (delay <= 0) {
                return new Promise(resolve => {
                    const handler = (event) => {
                        event.stopPropagation();
                        document.removeEventListener('wheel', handler);
                        resolve(event.deltaY < 0 ? "up" : "down");
                    };
                    document.addEventListener("wheel", handler, { passive: true });
                });
            }

            return new Promise(resolve => {
                const handler = (event) => {
                    event.stopPropagation();
                    clearTimeout(timeoutId);
                    document.removeEventListener('wheel', handler);
                    resolve(event.deltaY < 0 ? "ScrollUp" : "ScrollDown");
                };

                document.addEventListener('wheel', handler, { passive: true });

                const timeoutId = setTimeout(() => {
                    document.removeEventListener('wheel', handler);
                    resolve("");
                }, delay);
            });

        };


    /**************************************************************************
     *  getclick()
     * 
     */
        const   getclick = async (
            obj_params = {}
        ) => {

            let delay = obj_params['delay'] ?? 0;

            const getButtonName = (button) => {
                switch (button) {
                    case 0: return "left";
                    case 1: return "middle";
                    case 2: return "right";
                    default: return "unknown";
                }
            };

            if (delay <= 0) {
                return new Promise(resolve => {
                    const handler = (event) => {
                        document.removeEventListener('mousedown', handler);
                        resolve(getButtonName(event.button));
                    };
                    document.addEventListener("mousedown", handler);
                });
            }

            return new Promise(resolve => {
                const handler = (event) => {
                    clearTimeout(timeoutId);
                    document.removeEventListener('mousedown', handler);
                    resolve(getButtonName(event.button));
                };

                document.addEventListener('mousedown', handler);

                const timeoutId = setTimeout(() => {
                    document.removeEventListener('mousedown', handler);
                    resolve("");
                }, delay);
            });

        };
        
    /**************************************************************************
     *  getinput()
     * 
     */
        const getinput = async (
            obj_params = {}
        ) => {

            const delay = obj_params['delay'] ?? 0;

            const getButtonName = (button) => {
                switch (button) {
                    case 0: return "left";
                    case 1: return "middle";
                    case 2: return "right";
                    default: return "unknown";
                }
            };

            return new Promise(resolve => {
                let timeoutId;

                const cleanup = () => {
                    document.removeEventListener("keydown", onKey);
                    document.removeEventListener("wheel", onWheel);
                    document.removeEventListener("mousedown", onClick);
                    if (timeoutId) clearTimeout(timeoutId);
                };

                const onKey = (event) => {
                    cleanup();
                    resolve(event.key);
                };

                const onWheel = (event) => {
                    event.stopPropagation();
                    cleanup();
                    resolve(event.deltaY < 0 ? "ScrollUp" : "ScrollDown");
                }

                const onClick = (event) => {
                    cleanup();
                    resolve(getButtonName(event.button));
                };

                document.addEventListener("keydown", onKey);
                document.addEventListener("wheel", onWheel, { passive: true });
                document.addEventListener("mousedown", onClick);

                if (delay > 0) {
                    timeoutId = setTimeout(() => {
                        cleanup();
                        resolve("");
                    }, delay);
                }
            });
            
        };


    /**************************************************************************
     *  regex_test()
     * 
     */
        const regex_test = (
            obj_params = {}
        ) => {

            let string = obj_params['string'];
            let pattern = obj_params['pattern'];

            if (typeof pattern === 'string') {
                const match = pattern.match(/^\/(.*)\/([gimsuy]*)$/);
                if (match) {
                    pattern = new RegExp(match[1], match[2]);
                } else {
                    pattern = new RegExp(pattern);
                }
            }

            if (!(pattern instanceof RegExp)) {
                throw new TypeError(`Invalid regex pattern: ${pattern}`);
            }

            if (pattern.test(string)) {
                return "true";
            }
            else {
                return "false";
            }

        };


    /**************************************************************************
     *  randomnum()
     * 
     */
        const randomnum = (
            obj_param = {}
        ) => {

            let { lower_bound = 0, upper_bound = 1 } = obj_param;
            
            return `"${Math.floor(Math.random() * ((upper_bound - lower_bound)) + lower_bound)}"`;

        };



    /**************************************************************************
     *  All builtin modules and plugins must follow this simple format.
     *
     *  This is required by the Depmanager.js code module to register
     *  modules and the methods they expose to our PolyBASIC scripts.
     *
     *  See the core/Depmanager.js file for more detailed info.
     *  
     */
        const   _methods =          {
            
            'print':                {
                'callback':         print,
                'async':            false,
                'params':           [
                    { 'name': 'string',     'type': 'string' }
                ]
            },

            'sleep':                {
                'callback':         sleep,
                'async':            true,
                'params':           [
                    { 'name': 'duration',   'type': 'number' }
                ]
            },

            'getch':                {
                'callback':         getch,
                'async':            true,
                'params':           [
                    { 'name': 'delay',      'type': 'number',   'default': 0 }
                ]
            },

            'getscroll':            {
                'callback':         getscroll,
                'async':            true,
                'params':           [
                    { 'name': 'delay',      'type': 'number',   'default': 0 }
                ]
            },

            'getclick':             {
                'callback':         getclick,
                'async':            true,
                'params':           [
                    { 'name': 'delay',      'type': 'number',   'default': 0 }
                ]
            },

            'getinput':             {
                'callback':         getinput,
                'async':            true,
                'params':           [
                    { 'name': 'delay',      'type': 'number',   'default': 0 }
                ]
            },

            'regex_test':           {
                'callback':         regex_test,
                'async':            false,
                'params':           [
                    { 'name': 'string',     'type': 'string' },
                    { 'name': 'pattern',    'type': 'string' }
                ]
            },

            'randomnum':            {
                'callback':         randomnum,
                'async':            false,
                'params':           [
                    { 'name': 'lower_bound',    'type': 'number',   'default': 0 },
                    { 'name': 'upper_bound',    'type': 'number',   'default': 10 }
                ]
            },
            
        };


        return {

            'methods':      function() { return _methods; }

        };

    };
