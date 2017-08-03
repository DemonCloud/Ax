'use strict';

const struct = require('../src/struct');
const extend = struct.extend();

test('extend two object', ()=> {
  expect(extend({a:1},{b:2,c:3})).toEqual({a:1,b:2,c:3});

  expect(extend({a:1,b:3,c:5,d:4},{b:2,c:3})).toEqual({a:1,b:2,c:3,d:4});
});

test('extend object with ignoreProperties', ()=> {
	expect(extend({a:1,b:2,c:3},{b:4,c:6},"b")).toEqual({a:1,b:2,c:6});
});

test('extend to mapping origin object',()=> {
	let o = {a:1,b:2};
	expect(extend(o,{c:3,d:4})).toBe(o);
});

test('extend for array', ()=> {
	let a = [1,2,3,4,5];
	expect(extend(a,[2,3,4])).toEqual([2,3,4,4,5]);
});

test('extend for array ignoreProperties', ()=> {
	let a = [2,1,3,4,5];
	expect(extend(a,[2,2,4],2)).toEqual([2,2,3,4,5]);
	expect(extend(a,[2,2,4,5],[2,3])).toEqual([2,2,3,4,5]);
});
