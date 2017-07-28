'use strict';

const struct = require('../src/struct');
const toStr = struct.convert("string"),
			toNum = struct.convert("number"),
			toAry = struct.convert('array');

test("convert [toString]", ()=>{
	expect(toStr(null)).toBe("");
	expect(toStr(void 0)).toBe("");
	expect(toStr(1)).toBe("1");
	expect(toStr(1.234)).toBe("1.234");
	expect(toStr(-3.21)).toBe("-3.21");
	expect(toStr([])).toBe("");
	expect(toStr([1,2,3])).toBe("1,2,3");
	expect(toStr({a:1})).toBe("[object Object]");
	expect(toStr({})).toBe("[object Object]");
	expect(toStr(function(){})).toBe("function () {}");
	expect(toStr(true)).toBe("true");
	expect(toStr(false)).toBe("false");
});

test("convert [toNumber]",()=>{
	expect(toNum(null)).toBe(0);
	expect(toNum(void 0)).toBe(0);
	expect(toNum(1)).toBe(1);
	expect(toNum(1.234)).toBe(1.234);
	expect(toNum(-3.21)).toBe(-3.21);
	expect(toNum([])).toBe(0);
	expect(toNum([1,2,3])).toBe(0);
	expect(toNum({a:1})).toBe(0);
	expect(toNum({})).toBe(0);
	expect(toNum(function(){})).toBe(0);
	expect(toNum(true)).toBe(1);
	expect(toNum(false)).toBe(0);
});

test("convert [toArray]",()=>{
	expect(toAry(null)).toEqual([]);
	expect(toAry(void 0)).toEqual([]);
	expect(toAry(1)).toEqual([1]);
	expect(toAry(1.234)).toEqual([1.234]);
	expect(toAry(-3.21)).toEqual([-3.21]);
	expect(toAry([])).toEqual([]);
	expect(toAry("")).toEqual([]);
	expect(toAry("abcd")).toEqual(['a','b','c','d']);
	expect(toAry([1,2,3])).toEqual([1,2,3]);
	expect(toAry({a:1})).toEqual([1]);
	expect(toAry({})).toEqual([]);
	expect(toAry(true)).toEqual([true]);
	expect(toAry(false)).toEqual([false]);
});
