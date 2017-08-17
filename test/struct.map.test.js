'use strict';

const struct = require('../src/struct');

const map = struct.map();
const mapkey = struct.map("key");

test('map [Array]', ()=>{
	const arr = [1,2,3,4,5];

	const mapper = map(arr,val=>val*val);

	expect(mapper).toEqual([1,4,9,16,25]);
});

test('map [Object]', ()=>{
	const obj = {
		a:1,
		b:2,
		c:3,
		d:4
	};

	const mapper = map(obj,val=>val%2);

	expect(mapper).toEqual({
		a:1,
		b:0,
		c:1,
		d:0
	});
});

test('mapkey [Object]', ()=>{
	const obj = {
		a:1,
		b:2,
		c:3,
		d:4
	};

	const mapper = mapkey(obj,(val,key)=>key+key);

	expect(mapper).toEqual({
		aa:1,
		bb:2,
		cc:3,
		dd:4
	});

});
