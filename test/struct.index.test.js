'use strict';

const struct = require('../src/struct');

const index = struct.index();
const one = struct.index('one');
const first = struct.index('first');
const last = struct.index('last');

test('index Array/Object', ()=>{
	expect(true).toBe(true);
});
