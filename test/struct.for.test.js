'use strict';

const struct = require('../src/struct');

const each = struct.each();

const arrayforEach = struct.each("array");
const objectforEach = struct.each("object");

test('forEach with array/object', ()=> {
	// expect(isObj(void 0)).toBe(false);
	const arr = [1,2,3,4,5];
	const obj = { a:1,b:2,c:3 };
	const arr2 = [1,2,3,4,5,6];

	arrayforEach(arr,(item,index)=>{
		arr[index] = item+1;
	});

	objectforEach(obj,(item,key)=>{
		obj[key] = item+1;
	});

	each(arr2,(item,index)=>{
		arr2[index] = item*item;
	});

	expect(arr).toEqual([2,3,4,5,6]);
	expect(obj).toEqual({ a:2, b:3, c:4 });
	expect(arr2).toEqual([1,4,9,16,25,36]);
});
