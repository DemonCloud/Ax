'use strict';

const struct = require('../src/struct');

const has = struct.has();
const hasKey = struct.has("key");


test('has Array/Object', ()=>{
	const arr = [1,2,3,4,5,6,7,8];
	const obj = { a:1,b:2,c:3,d:4 };

	expect(has(arr,2)).toBe(true);
	expect(has(arr,0)).toBe(false);
	expect(has(obj,2)).toBe(true);
	expect(has(obj,6)).toBe(false);
});

test('has Array/Object [use equal]', ()=>{
	const arr = [{a:1},{b:2},{c:3}];
	const obj = {
		a: { b:1 },
		b: { a:1 },
		c: { c:0 }
	};

	const pvoit = {a:1};


	expect(has(arr,pvoit,true)).toBe(true);
	expect(has(arr,pvoit,false)).toBe(false);
	expect(has([1,2],pvoit,true)).toBe(false);
	expect(has([1,3],pvoit,false)).toBe(false);

	expect(has(obj,pvoit,true)).toBe(true);
	expect(has(obj,pvoit,false)).toBe(false);
	expect(has({a:1},pvoit,true)).toBe(false);
	expect(has({b:1},pvoit,false)).toBe(false);
});

test('hasKey Array/Object',()=> {
	const arr = [1,3,4];
	const obj = { aa:0, bb:0, cc:0 };

	expect(hasKey(arr,0)).toBe(true);
	expect(hasKey(arr,2)).toBe(true);
	expect(hasKey(obj,"a")).toBe(false);
	expect(hasKey(obj,"cc")).toBe(true);
});
