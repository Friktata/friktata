/******************************************************************************
 *  friktata/src/js/PolyBASIC_extensions/SpaceInvaders.js
 */

    export const SpaceInvaders = () => {

        const   __game_ticks    = 5;

        const   __enemy_types   = [
        
            {
                'face':         ">@<",
                'shield':       1,
                'damage':       10,
                'recharge':     20,
                'color':        {
                    'red':      255,
                    'green':    64,
                    'blue':     220
                }
            },

            {
                'face':         "]x[",
                'shield':       2,
                'damage':       20,
                'recharge':     15,
                'color':        {
                    'red':      32,
                    'green':    220,
                    'blue':     220
                }
            },

            {
                'face':         "}#{",
                'shield':       2,
                'damage':       20,
                'recharge':     10,
                'color':        {
                    'red':      64,
                    'green':    220,
                    'blue':     128
                }
            },

            {
                'face':         "|=|",
                'shield':       2,
                'damage':       25,
                'recharge':     10,
                'color':        {
                    'red':      64,
                    'green':    255,
                    'blue':     220
                }
            },

            {
                'face':         "=|=",
                'shield':       3,
                'damage':       25,
                'recharge':     5,
                'color':        {
                    'red':      255,
                    'green':    220,
                    'blue':     64
                }
            }

        ];


        const   __enemy_speeds          = [
            6,
            6,
            5,
            5,
            5,
            5,
            4,
            4,
            4,
            3
        ];


        const   __enemy_spreads         = [

            [
                [ 0, 1, 1, 0 ],
                [ 1, 0, 0, 1 ],
                [ 0, 1, 1, 0 ]
            ],

            [
                [ -1, 1, 0, 0, 1, -1 ],
                [ 1, 0, 2, 2, 0, 1 ],
                [ -1, 1, 0, 0, 1, -1 ]
            ],

            [
                [ -1, 2, 2, 2, 2, -1 ],
                [ 2, 1, 1, 1, 1, 2 ],
                [ 2, 1, 1, 1, 1, 2 ],
                [ -1, 2, 0, 0, 2, -1 ]
            ],

            [
                [ 0, 2, 2, 2, 2, 0 ],
                [ -1, 1, 3, 3, 1, -1 ],
                [ -1, 2, 2, 2, 2, -1 ],
                [ 0, 1, 3, 3, 1, 0 ]
            ],

            [
                [ 1, 3, 2, 2, 3, 1 ],
                [ 0, 0, 1, 1, 0, 0 ],
                [ 0, 0, 1, 1, 0, 0 ],
                [ 1, 3, 2, 2, 3, 1 ]
            ],

            [
                [ 0, 2, 2, 2, 2, 0 ],
                [ -1, 1, 3, 3, 1, -1 ],
                [ -1, 3, 1, 1, 3, -1 ],
                [ 0, 2, 2, 2, 2, 0 ]
            ],

            [
                [ 3, 1, 2, 2, 1, 3 ],
                [ 1, 2, 4, 4, 2, 1 ],
                [ 1, 2, 4, 4, 2, 1 ],
                [ 2, 3, 1, 1, 3, 2 ]
            ],

            [
                [ 0, 4, 3, 1, 1, 3, 4, 0 ],
                [ 3, 4, 2, 3, 3, 2, 4, 3 ],
                [ 3, 2, 3, 1, 1, 3, 2, 3 ],
                [ -1, 4, 0, 1, 1, 0, 4, -1 ]
            ],

            [
                [ -1, 4, 2, 3, 3, 2, 4, -1 ],
                [ 4, 2, 3, 4, 4, 3, 2, 4 ],
                [ 3, 0, 3, 4, 4, 3, 0, 3 ],
                [ -1, 4, 2, 1, 1, 2, 4, -1 ]
            ],

            [
                [ 4, 0, 2, 3, 3, 2, 0, 4 ],
                [ 4, 4, 3, 4, 4, 3, 4, 4 ],
                [ 3, 4, 1, 4, 4, 1, 4, 3 ],
                [ 4, 4, 3, 4, 4, 3, 4, 4 ],
                [ 4, 0, 2, 1, 1, 2, 0, 4 ]
            ]

        ];


        const   __level_background          = [

            `
    _____             ___          
   /     \\  ___      /   \\____   __/ 
__/       \\/   \\ ___/_       _\\_/_  
 /         \\    /     \\     /     \\  
/           \\__/       \\___/       \\ 
`

        ];


        let     __enemy_bullets         = [];
        let     __player_bullets        = [];

        let     __enemies               = [];
        let     __hits                  = [];
        let     __enemy_pos             = [];


        const   __draw_background = async level => {

            window.__methods['setfg']['callback']({
                'red': 255,
                'green': 0,
                'blue': 0,
                'alpha': 255
            });

            await window.__methods['putstring']['callback']({
                'row': level['display_top'] + 10,
                'column': level['display_left'] + 1,
                'string': __level_background[0],
                'bg': true
            });

            window.__methods['setfg']['callback']({
                'red': 32,
                'green': 220,
                'blue': 128,
                'alpha': 255
            });

        };


        const   __draw_spread = async (
            level,
            first = false
        ) => {

            let __display_width = window.__display.display_info().columns;
            let __display_left = Math.floor((__display_width - 40) / 2);
            let __enemy_left = Math.floor(__display_left + level['enemy_x_pos']);

            level['display_left'] = __display_left;
            level['enemy_left'] = __enemy_left;

            for (let row = 0; row < level['spread'].length; row++) {
                for (let column = 0; column < (level['spread'][row].length * 4); column += 4) {
                    
                    let enemy_index = level['spread'][row][column / 4];
                    
                    if (first && column === 0) {
                        __enemies[row] = [];
                        __hits[row] = [];
                        __enemy_pos[row] = [];
                    }
                
                    if (first && enemy_index !== -1) {
                        __enemies[row][column / 4] = structuredClone(__enemy_types[enemy_index]);
                        __hits[row][column / 4] = [];
                        __hits[row][column / 4][0] = __enemy_types[enemy_index]['shield'];
                        __hits[row][column / 4][1] = __enemy_types[enemy_index]['shield'];
                        __hits[row][column / 4][2] = __enemy_types[enemy_index]['shield'];
                    }
                    else if (enemy_index === -1) {
                        __enemies[row][column / 4] = {
                            'face': "   "
                        };
                        __hits[row][column / 4] = [];
                        __hits[row][column / 4][0] = 0;
                        __hits[row][column / 4][1] = 0;
                        __hits[row][column / 4][2] = 0;
                    }

                    __enemy_pos[row][column / 4] = {
                        'row': (row + level['enemy_y_pos']),
                        'column': (__enemy_left + column)
                    };

                    if (enemy_index === -1) {
                        await window.__methods['putstring']['callback']({
                            'row': (row + level['enemy_y_pos']),
                            'column': (__enemy_left + column),
                            'string': "   "
                        });
                    }

                    else {
                        window.__methods['setfg']['callback']({
                            'red': __enemy_types[enemy_index]['color']['red'],
                            'green': __enemy_types[enemy_index]['color']['green'],
                            'blue': __enemy_types[enemy_index]['color']['blue'],
                            'alpha': 255,
                        });

                        for (let b = 0; b < 3; b++) {
                            if (__enemies[row][column / 4]['face'].substring(b, (b + 1)) === ' ') {
                                continue;
                            }

                            await window.__methods['putchar']['callback']({
                                'row': (row + level['enemy_y_pos']),
                                'column': (__enemy_left + (column + b)),
                                'char': __enemies[row][column / 4]['face'].substring(b, (b + 1)),
                                'delay': 0
                            });
                        }

                        window.__methods['setfg']['callback']({
                            'red': 32,
                            'green': 220,
                            'blue': 128,
                            'alpha': 255,
                        });
                    }
                }
            }

        };


        const   __draw_player = async level => {

            window.__methods['setfg']['callback']({
                'red': 32,
                'green': 128,
                'blue': 220,
                'alpha': 255
            });
            
            await window.__methods['putstring']['callback']({
                'row': level['display_top'] + 16,
                'column': (level['display_left'] + 1),
                'string': "______________________________________"
            });

            window.__methods['setbg']['callback']({
                'red': 32,
                'green': 128,
                'blue': 220,
                'alpha': 255
            });

            await window.__methods['putchar']['callback']({
                'row': level['display_top'] + 16,
                'column': (level['display_left'] + level['player_pos']),
                'char': "&nbsp;"
            });

            window.__methods['setfg']['callback']({
                'red': 32,
                'green': 220,
                'blue': 128,
                'alpha': 255
            });

            window.__methods['setbg']['callback']({
                'red': 0,
                'green': 0,
                'blue': 0,
                'alpha': 255
            });

        };


        const   __draw_player_stats = async level => {

            window.__methods['setfg']['callback']({
                'red': 255,
                'green': 255,
                'blue': 255,
                'alpha': 255
            });

            await window.__methods['putstring']['callback']({
                'row': level['display_top'] + 2,
                'column': level['display_left'] + 2,
                'string': 'Score                       Level'
            });

            if (level['player_score'] <= 0) {
                window.__methods['setfg']['callback']({
                    'red': 255,
                    'green': 32,
                    'blue': 32,
                    'alpha': 255
                });
            }
            else {
                window.__methods['setfg']['callback']({
                    'red': 32,
                    'green': 220,
                    'blue': 128,
                    'alpha': 255
                });
            }

            await window.__methods['putstring']['callback']({
                'row': (level['display_top'] + 2),
                'column': (level['display_left'] + 8),
                'string': `${level['player_score'].toString()}                `
            });

            window.__methods['setfg']['callback']({
                'red': 32,
                'green': 220,
                'blue': 128,
                'alpha': 255
            });

            await window.__methods['putstring']['callback']({
                'row': (level['display_top'] + 2),
                'column': (level['display_left'] + 36),
                'string': (level['level'] + 1).toString()
            });

            await window.__methods['putstring']['callback']({
                'row': (level['display_top'] + 17),
                'column': (level['display_left'] + 8),
                'string': level['player_lives'].toString()
            });

        };


        const   __shift_enemy = level => {

            if (level['enemy_direction'] === "left") {
                if ((level['enemy_x_pos'] + level['display_left']) <= (level['display_left'] + 2)) {
                    level['enemy_y_pos']++;
                    level['enemy_direction'] = "right";
                }
                else {
                    level['enemy_x_pos']--;
                }
            }
            else {
                if ((level['enemy_x_pos'] + level['display_left']) >= (level['display_left'] + (40 - level['spread_width']))) {
                    level['enemy_y_pos']++;
                    level['enemy_direction'] = "left";
                }
                else {
                    level['enemy_x_pos']++;
                }
            }

        };


        const   __detect_clash = (
            level,
            index
        ) => {

            for (let row = 0; row < __enemy_pos.length; row++) {
                for (let column = 0; column < __enemy_pos[row].length; column++) {
                    let enemy_row = __enemy_pos[row][column]['row'];
                    let enemy_column= __enemy_pos[row][column]['column'];

                    if (index === -1 && level['game_enabled']) {
                        if (enemy_row >= (16 + level['display_top'])) {
                            let __has_enemies = false;
                            for (let c = 0; c < 3; c++) {
                                if (__enemies[row][column]['face'].substring(c, (c + 1)) !== " ") {
                                    __has_enemies = true;
                                    break;
                                }
                            }
                            if (__has_enemies) {
                                if (level['player_lives'] > 0) {
                                    level['player_lives']--;
                                    level['game_enabled'] = false;
                                    level['restart_level'] = true;
                                    return;
                                }
                                else {
                                    level['game_enabled'] = false;
                                    level['game_over'] = true;
                                    level['restart_level'] = true;
                                    return;
                                }
                            }
                        }

                        continue;
                    }

                    if (index > -1 && enemy_row === __player_bullets[index]['row']) {
                        if (
                            (__player_bullets[index]['column'] + level['display_left']) >= enemy_column &&
                            (__player_bullets[index]['column'] + level['display_left'])  < (enemy_column + 3)
                        ) {
                            let str_index = Math.floor((enemy_column - (__player_bullets[index]['column'] + level['display_left']) + 2));

                            str_index = (2 - str_index);
                            let shield = __hits[row][column][str_index];

                            if (__enemies[row][column]['face'].substring(str_index, (str_index + 1)) === " ") {
                                continue;
                            }

                            if (shield > 1) {
                                level['player_score'] += 10;
                                __hits[row][column][str_index]--;
                                __player_bullets.splice(index, 1);
                                return;
                            }
                            else {
                                if (str_index === 0)
                                    __enemies[row][column]['face'] = " " + __enemies[row][column]['face'].substring(1);
                                else
                                    __enemies[row][column]['face'] = __enemies[row][column]['face'].substring(0, str_index) + ' ' + __enemies[row][column]['face'].substring(str_index + 1);
                                
                                level['player_score'] += 25;

                                __player_bullets.splice(index, 1);
                                level['total_enemies']--;

                                return;
                            }
                        }
                    }
                }
            }

        };


        const   __draw_player_bullets = async level => {

            for (let index = 0; index < __player_bullets.length; index++) {

                let __bullet_left = (level['display_left'] + __player_bullets[index]['column']);

                if (__player_bullets[index]['tick'] >= __player_bullets[index]['ticks']) {
                    __player_bullets[index]['tick'] = 0;

                    if (__player_bullets[index]['row'] <= (level['display_top']) + 3) {
                        __player_bullets.splice(index, 1);
                        level['player_score'] -= 2;
                        continue;
                    }

                    __player_bullets[index]['row']--;
                }
                else {
                    __player_bullets[index]['tick']++;
                }

                window.__methods['setfg']['callback']({
                    'red': 255,
                    'green': 255,
                    'blue': 255,
                    'alpha': 255
                });
                    
                window.__methods['setbg']['callback']({
                    'red': 0,
                    'green': 0,
                    'blue': 0,
                    'alpha': 0,
                });

                await window.__methods['putchar']['callback']({
                    'row': __player_bullets[index]['row'],
                    'column': __bullet_left,
                    'char': "."
                });

                window.__methods['setfg']['callback']({
                    'red': 32,
                    'green': 220,
                    'blue': 128,
                    'alpha': 255
                });
                    
                window.__methods['setbg']['callback']({
                    'red': 0,
                    'green': 0,
                    'blue': 0,
                    'alpha': 255,
                });

                __detect_clash(level, index);

            }

        };


        const   __player_fire = level => {

            if (__player_bullets.length >= level['max_bullets']) {
                return;
            }

            __player_bullets.push({
                'row': level['display_top'] + 15,
                'column': level['player_pos'],
                'speed': level['fire_speed'],
                'tick': 0,
                'ticks': 10
            });

        };


        const   __play_level = async level => {

            let     __enemy_ticks = 0;
            let     __is_first = true;

            __enemies = [];
            __hits = [];
            __enemy_pos = [];

            let __space = false;
            let __arrow_left = false;
            let __arrow_right = false;

            let __fire_ticks = 0;
            let __move_ticks = 0;

            while (true) {

                if (level['total_enemies'] <= 0) {
                    level['restart_level'] = false;
                    level['game_over'] = false;
                    level['level_complete'] = true;
                    return;
                }

                window.__methods['cleararea']['callback']({
                    'row': level['display_top'] + 3,
                    'column': (level['display_left'] + 1),
                    'width': 38,
                    'height': 14
                });

                if (! __is_first) { 
                    await __draw_background(level);
                }

                await __draw_spread(level, __is_first);
                await __draw_player_stats(level);
                await __draw_player(level);
                await __draw_player_bullets(level);

                if (level['restart_level'] === true || level['game_over'] === true) {
                    return false;
                }

                if (__is_first === true) {
                    __is_first = false;
                    level['game_enabled'] = true;
                }

                if (! __is_first) {
                    __detect_clash(level, -1);
                }

                if (level['restart_level'] === true || level['game_over'] === true) {
                    return false;
                }

                let kbdevent = await window.__methods['getkbdevent']['callback']({
                    'delay': __game_ticks
                });

                if (kbdevent !== "") {

                    if (kbdevent['event'] === "keydown") {
                        if (kbdevent['key'] === "ArrowLeft") {
                            __arrow_left = true;
                            __arrow_right = false;
                            __move_ticks = 2;
                        }
                        else if (kbdevent['key'] === "ArrowRight") {
                            __arrow_left = false;
                            __arrow_right = true;
                            __move_ticks = 2;
                        }
                        else if (kbdevent['key'] === " ") {
                            __space = true;
                            __fire_ticks = 3;
                        }
                    }

                    if (kbdevent['event'] === "keyup") {
                        if (kbdevent['key'] === "ArrowLeft") {
                            __arrow_left = false;
                            __move_ticks = 0;
                        }
                        else if (kbdevent['key'] === "ArrowRight") {
                            __arrow_right = false;
                            __move_ticks = 0;
                        }
                        else if (kbdevent['key'] === " ") {
                            __space = false;
                        }
                    }

                }

                if (__arrow_left) {
                    if (__move_ticks === 2) {
                        if (level['player_pos'] > 1) {
                            level['player_pos']--;
                        }
                        __move_ticks = 0;
                    }
                    else {
                        __move_ticks++;
                    }
                }
                
                if (__arrow_right) {
                    if (__move_ticks === 2) {
                        if (level['player_pos'] < 38) {
                            level['player_pos']++;
                        }
                        __move_ticks = 0;
                    }
                    else {
                        __move_ticks++;
                    }
                }

                if (__space) {
                    if (__fire_ticks >= 4) {
                        __fire_ticks = 0;
                        __player_fire(level);
                    }
                    else {
                        __fire_ticks++;
                    }
                }

                if (__enemy_ticks == level['enemy_speed']) {
                    __shift_enemy(level);
                    __enemy_ticks = 0;
                }
                else {
                    __enemy_ticks++;
                }

            }

        };


        const   __flash_display = async (
            level
        ) => {

            let rgb = [
                255,
                255,
                255
            ];

            for (let f = 0; f < 24; f++) {

                let mod = (f % 3);

                if (rgb[mod] === 255) {
                    rgb[mod] = 32;
                }
                else {
                    rgb[mod] = Math.floor(rgb[mod] + (255 / 3));
                }

                $('.cell').css({
                    'color': `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 255)`
                });

                window.__methods['setfg']['callback']({
                    'red': 255,
                    'green': 0,
                    'blue': 0,
                    'alpha': 255
                });

                let display_message = "__Mm155i0on FaiL_d, M3@7b46__";

                if (level['game_over'] === true) {
                    display_message = "__gGam_E Oov3r, y9ou fA1l3d__";
                }
                
                await window.__methods['putstring']['callback']({
                    'row': level['display_top'] + 8,
                    'column': level['display_left'] + 3,
                    'string': "**                               **"
                });

                window.__methods['setfg']['callback']({
                    'red': 255,
                    'green': 255,
                    'blue': 255,
                    'alpha': 255
                });

                await window.__methods['putstring']['callback']({
                    'row': level['display_top'] + 8,
                    'column': level['display_left'] + 6,
                    'string': display_message
                });

                await window.__methods['getch']['callback']({
                    'delay': 5
                });
            }

            $('.cell').css({
                'color': `rgba(32, 220, 128, 255)`
            });

            return;

        };


        const   __count_enemies = (
            level
        ) => {

            level['total_enemies'] = 0;

            for (let row = 0; row < level['spread'].length; row++) {

                for (let column = 0; column < level['spread'][row].length; column++) {

                    if (level['spread'][row][column] !== -1) {
                        level['total_enemies'] += 3;
                    }

                }

            }

        };


        const   space_invaders = async (
            obj_params = {}
        ) => {

            let level = obj_params['level'];
            let score = obj_params['score'];
            let lives = obj_params['lives'];

            level--;

            let     _level =        {
                'spread':           __enemy_spreads[level],
                'enemy_direction':  "left",
                'enemy_speed':      __enemy_speeds[level],
                'enemy_fire_speed': 2,
                'player_pos':       19,
                'player_lives':     1,
                'level':            level,
                'game_over':        false,
                'restart_level':    false,
                'player_score':     score
            };

            while (true) {

                if (level < 0 || level >= 10) {
                    return false;
                }

                let __spread_height = _level['spread'].length;
                let __spread_width = _level['spread'][0].length * 4;

                let __enemy_x_pos = ((39 - __spread_width) / 2);

                _level['spread_width'] = __spread_width;
                _level['enemy_x_pos'] = __enemy_x_pos;
                _level['fire_speed'] = 5;
                _level['max_bullets'] = 15;
                _level['player_pos'] = 19;

                __count_enemies(_level);

                let __display_height = window.__display.display_info().rows;
                let __display_top = Math.floor((__display_height - 20) / 2);
                let __enemy_y_pos = (__display_top + 4);

                _level['enemy_y_pos'] = __enemy_y_pos;
                _level['display_top'] = __display_top;

                __enemy_bullets         = [];
                __player_bullets        = [];

                __enemies               = [];
                __hits                  = [];
                __enemy_pos             = [];

                _level['game_enabled'] = true;
                _level['restart_level'] = false;

                await __play_level(_level);
                
                if (_level['restart_level'] ===  true || _level['game_over'] === true) {
                    await __flash_display(_level);
                    if (_level['game_over'] === true) {
                        return "game_over";
                    }

                    if (_level['restart_level'] === false) {
                        break;
                    }
                }
                else {

                    if (_level['level_complete'] && _level['level_complete']) {
                        // _level =                {
                        //     'player_x':         19,
                        //     'enemy_direction':  "left",
                        //     'enemy_fire_speed': 2,
                        //     'player_pos':       19,
                        //     'player_lives':     1,
                        //     'game_over':        false,
                        //     'level_complete':   false
                        // };

                        _level['player_pos'] = 19;
                        _level['enemy_direction'] = "left";
                        _level['level'] = ++level;
                        _level['spread'] = __enemy_spreads[level];
                        _level['enemy_speed'] = __enemy_speeds[level];
                    }

                    continue;
                }
            }

        };


        const   _methods = {
            
            'SpaceInvaders':        {
                'callback':         space_invaders,
                'async':            true,
                'params':           [
                    { 'name': 'level',      'type': 'number' },
                    { 'name': 'lives',      'type': 'number' },
                    { 'name': 'score',      'type': 'number' }
                ]
            }

        };


        return {

            'methods':      function() { return _methods; }

        };


    };
