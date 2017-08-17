'use strict';

const struct = require('../src/struct');

const slimUnique = struct.unique();
const fastUnique = struct.unique('fast');

test('unique [Array]', ()=>{
	const arr = [1,5,6,4,4,3,2,1,5,7,8,9,0,3,5,6,8,9,6,5,4,3,6,8,5,7,2,1,3,4,5,6,9,5,5,2,1,1,0,3,0];
	const pvoit = [0,1,2,3,4,5,6,7,8,9];

	expect(slimUnique(arr).sort()).toEqual(pvoit);
	expect(fastUnique(arr).sort()).toEqual(pvoit);
});
