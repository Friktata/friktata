
/******************************************************************************
 *  friktata/src/js/core/PolyBASIC/builtins/Stack.js
 * 
 */

    export const Stack = () => {

        let     _stacks = {};


    /**************************************************************************
     *  newstack()
     * 
     */
        const   newstack = (
            obj_params = {}
        ) => {

            if (_stacks.hasOwnProperty(obj_params['stack_id'])) {
                return `Error in newstack(): Stack ${obj_params['stack_id']} exists`;
            }

            _stacks[obj_params['stack_id']] = [];

            return "";

        };


    /**************************************************************************
     *  pushstack()
     * 
     */
        const   pushstack = (
            obj_params = {}
        ) => {

            if (! _stacks.hasOwnProperty(obj_params['stack_id'])) {
                _stacks[obj_params['stack_id']] = [];
            }

            _stacks[obj_params['stack_id']].push(obj_params['value']);

            return "";

        };


    /**************************************************************************
     *  popstack()
     * 
     */
        const   popstack = (
            obj_params = {}
        ) => {

            if (! _stacks.hasOwnProperty(obj_params['stack_id'])) {
                return `Error in popstack(): Stack ${obj_params['stack_id']} doesn't exist`;
            }

            if (_stacks[obj_params['stack_id']].length < 1) {
                return false;
            }

            return `"${_stacks[obj_params['stack_id']].pop(obj_params['value'])}"`;

        };


    /**************************************************************************
     *  countstack()
     * 
     */
        const   countstack = (
            obj_params = {}
        ) => {

            if (! _stacks.hasOwnProperty(obj_params['stack_id'])) {
                return `Error in countstack(): Stack ${obj_params['stack_id']} doesn't exist`;
            }

            return `"${_stacks[obj_params['stack_id']].length}"`;

        };


    /**************************************************************************
     *  peekstack()
     * 
     */
        const   peekstack = (
            obj_params = {}
        ) => {

            if (! _stacks.hasOwnProperty(obj_params['stack_id'])) {
                return `Error in peekstack(): Stack ${obj_params['stack_id']} doesn't exist`;
            }

            let index = parseInt(obj_params['index']);

            if (! /^[0-9]+$/.test(obj_params['index'])) {
                index = obj_params['index'];
            }

            if (index < 0 || index >= _stacks[obj_params['stack_id']]. length) {
                return `Error in peekstack(): Index ${index} is out of range`;
            }

            return `"${_stacks[obj_params['stack_id']][index]}"`;

        };


    /**************************************************************************
     *  updatestack()
     * 
     */
        const   updatestack = (
            obj_params = {}
        ) => {

            if (! _stacks.hasOwnProperty(obj_params['stack_id'])) {
                return `Error in updatestack(): Stack ${obj_params['stack_id']} doesn't exist`;
            }

            let index = parseInt(obj_params['index']);
            let value = obj_params['valie'];

            if (index < 0 || index >= _stacks[obj_params['stack_id']]. length) {
                return `Error in updatestack(): Index ${obj_params['stack_id']} is out of range`;
            }

            _stacks[obj_params['stack_id']][index] = value;

            return "";

        };


    /**************************************************************************
     *  clearstack()
     * 
     */
        const   clearstack = (
            obj_params = {}
        ) => {

            _stacks[obj_params['stack_id']] = [];

            return "";

        };


    /**************************************************************************
     *  clearstacks()
     * 
     */
        const   clearstacks = (
            obj_params = {}
        ) => {

            _stacks = [];

            return "";

        };


    /**************************************************************************
     *  insertstack()
     * 
     */
        const   insertstack = (
            obj_params = {}
        ) => {

            if (! _stacks.hasOwnProperty(obj_params['stack_id'])) {
                return `Error in insertstack(): Stack ${obj_params['stack_id']} doesn't exist`;
            }

            _stacks[obj_params['stack_id']][obj_params['index']] = obj_params['value'];

            return "";

        };


        const   _methods = {

            'newstack':             {
                'callback':         newstack,
                'async':            false,
                'params':           [
                    { 'name': 'stack_id',       'type': 'string' }
                ]
            },

            'pushstack':            {
                'callback':         pushstack,
                'async':            false,
                'params':           [
                    { 'name': 'stack_id',       'type': 'string' },
                    { 'name': 'value',          'type': 'default' }
                ]
            },

            'popstack':             {
                'callback':         popstack,
                'async':            false,
                'params':           [
                    { 'name': 'stack_id',       'type': 'string' }
                ]
            },

            'countstack':           {
                'callback':         countstack,
                'async':            false,
                'params':           [
                    { 'name': 'stack_id',       'type': 'string' }
                ]
            },

            'peekstack':            {
                'callback':         peekstack,
                'async':            false,
                'params':           [
                    { 'name': 'stack_id',       'type': 'string' },
                    { 'name': 'index',          'type': 'default' }
                ]
            },

            'updatestack':          {
                'callback':         updatestack,
                'async':            false,
                'params':           [
                    { 'name': 'stack_id',       'type': 'string' },
                    { 'name': 'index',          'type': 'number' },
                    { 'name': 'value',          'type': 'default' }
                ]
            },

            'clearstack':           {
                'callback':         clearstack,
                'async':            false,
                'params':           [
                    { 'name': 'stack_id',       'type': 'string' }
                ]
            },

            'clearstacks':          {
                'callback':         clearstacks,
                'async':            false,
                'params':           []
            },

            'insertstack':          {
                'callback':         insertstack,
                'async':            false,
                'params':           [
                    { 'name': 'stack_id',       'type': 'string' },
                    { 'name': 'index',          'type': 'default' },
                    { 'name': 'value',          'type': 'default' }
                ]
            },

        };


        return {

            'methods':      function() { return _methods; }

        };

    };
