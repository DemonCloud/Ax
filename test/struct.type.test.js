'use strict';

const struct = require('../src/struct');
const isFn   = struct.type("fn"),
			isObj  = struct.type("object"),
			isStr  = struct.type("string"),
			isBool = struct.type("boolean"),
			isNum  = struct.type("number"),
			isPrim = struct.type("primitive"),
			isAry  = struct.type("array"),
			isAryL = struct.type("arraylike"),
			isIdt  = struct.type("idt"),
			isDef  = struct.type("def"),
			isEpt  = struct.type("ept"),
			isNat  = struct.type("native"),
			isNeed = struct.type("required"),
			isInt  = struct.type("int"),
			isFloat= struct.type("float"),
			typec  = struct.type();

test('type is [Object]', ()=> {
	expect(isObj({})).toBe(true);
	expect(isObj([])).toBe(true);
	expect(isObj(arguments)).toBe(true);
	expect(isObj(function(){})).toBe(true);
	expect(isObj(null)).toBe(false); // null is not Object by defaultWay
	expect(isObj(0)).toBe(false);
	expect(isObj(1)).toBe(false);
	expect(isObj("2")).toBe(false);
	expect(isObj("")).toBe(false);
	expect(isObj(true)).toBe(false);
	expect(isObj(false)).toBe(false);
	expect(isObj(NaN)).toBe(false);
	expect(isObj(void 0)).toBe(false);
});

test('type is [String]', ()=> {
	expect(isStr(null)).toBe(false);
	expect(isStr({})).toBe(false);
	expect(isStr([])).toBe(false);
	expect(isStr(arguments)).toBe(false);
	expect(isStr(function(){})).toBe(false);
	expect(isStr(0)).toBe(false);
	expect(isStr(1)).toBe(false);
	expect(isStr("2")).toBe(true);
	expect(isStr("")).toBe(true);
	expect(isStr(true)).toBe(false);
	expect(isStr(false)).toBe(false);
	expect(isStr(NaN)).toBe(false);
	expect(isStr(void 0)).toBe(false);
});

test('type is [Function]', ()=> {
	expect(isFn(null)).toBe(false);
	expect(isFn({})).toBe(false);
	expect(isFn([])).toBe(false);
	expect(isFn(arguments)).toBe(false);
	expect(isFn(function(){})).toBe(true);
	expect(isFn(0)).toBe(false);
	expect(isFn(1)).toBe(false);
	expect(isFn("2")).toBe(false);
	expect(isFn("")).toBe(false);
	expect(isFn(true)).toBe(false);
	expect(isFn(false)).toBe(false);
	expect(isFn(NaN)).toBe(false);
	expect(isFn(void 0)).toBe(false);
});

test('type is [Boolean]', ()=> {
	expect(isBool(null)).toBe(false);
	expect(isBool({})).toBe(false);
	expect(isBool([])).toBe(false);
	expect(isBool(arguments)).toBe(false);
	expect(isBool(function(){})).toBe(false);
	expect(isBool(0)).toBe(false);
	expect(isBool(1)).toBe(false);
	expect(isBool("2")).toBe(false);
	expect(isBool("")).toBe(false);
	expect(isBool(true)).toBe(true);
	expect(isBool(false)).toBe(true);
	expect(isBool(NaN)).toBe(false);
	expect(isBool(void 0)).toBe(false);
});

test('type is [Number]', ()=> {
	expect(isNum(null)).toBe(false);
	expect(isNum({})).toBe(false);
	expect(isNum([])).toBe(false);
	expect(isNum(arguments)).toBe(false);
	expect(isNum(function(){})).toBe(false);
	expect(isNum(0)).toBe(true);
	expect(isNum(1)).toBe(true);
	expect(isNum("2")).toBe(false);
	expect(isNum("")).toBe(false);
	expect(isNum(true)).toBe(false);
	expect(isNum(false)).toBe(false);
	expect(isNum(NaN)).toBe(false);
	expect(isNum(void 0)).toBe(false);
});

test('type is [Primitive]', ()=> {
	expect(isPrim(null)).toBe(true);
	expect(isPrim({})).toBe(false);
	expect(isPrim([])).toBe(false);
	expect(isPrim(arguments)).toBe(false);
	expect(isPrim(function(){})).toBe(true);
	expect(isPrim(0)).toBe(true);
	expect(isPrim(1)).toBe(true);
	expect(isPrim("2")).toBe(true);
	expect(isPrim("")).toBe(true);
	expect(isPrim(true)).toBe(true);
	expect(isPrim(false)).toBe(true);
	expect(isPrim(NaN)).toBe(true);
	expect(isPrim(void 0)).toBe(true);
});

test('type is [Array]', ()=> {
	expect(isAry(null)).toBe(false);
	expect(isAry({})).toBe(false);
	expect(isAry([])).toBe(true);
	expect(isAry(arguments)).toBe(false);
	expect(isAry(function(){})).toBe(false);
	expect(isAry(0)).toBe(false);
	expect(isAry(1)).toBe(false);
	expect(isAry("2")).toBe(false);
	expect(isAry("")).toBe(false);
	expect(isAry(true)).toBe(false);
	expect(isAry(false)).toBe(false);
	expect(isAry(NaN)).toBe(false);
	expect(isAry(void 0)).toBe(false);
});

test('type if [ArrayLike]', ()=> {
	expect(isAryL(null)).toBe(false);
	expect(isAryL({})).toBe(false);
	expect(isAryL([])).toBe(true);
	expect(isAryL(arguments)).toBe(true);
	expect(isAryL(function(){})).toBe(false);
	expect(isAryL(0)).toBe(false);
	expect(isAryL(1)).toBe(false);
	expect(isAryL("2")).toBe(false);
	expect(isAryL("")).toBe(false);
	expect(isAryL(true)).toBe(false);
	expect(isAryL(false)).toBe(false);
	expect(isAryL(NaN)).toBe(false);
	expect(isAryL(void 0)).toBe(false);
});

test('type if [Define]', ()=> {
	expect(isDef(null,"Null")).toBe(true);
	expect(isDef({},"Object")).toBe(true);
	expect(isDef([],"Array")).toBe(true);
	expect(isDef(arguments,"Arguments")).toBe(true);
	expect(isDef(function(){},"Function")).toBe(true);
	expect(isDef(0,"Number")).toBe(true);
	expect(isDef(1,"Number")).toBe(true);
	expect(isDef("2","String")).toBe(true);
	expect(isDef("","String")).toBe(true);
	expect(isDef(true,"Boolean")).toBe(true);
	expect(isDef(false,"Boolean")).toBe(true);
	expect(isDef(NaN,"Number")).toBe(true);
	expect(isDef(void 0,"Undefined")).toBe(true);
});

test('type if [Empty]', ()=> {
	expect(isEpt(null)).toBe(true);
	expect(isEpt({})).toBe(true);
	expect(isEpt({a:1})).toBe(false);
	expect(isEpt([])).toBe(true);
	expect(isEpt([2,3,1,4])).toBe(false);
	expect(isEpt(arguments)).toBe(false);
	expect(isEpt(function(){})).toBe(true);
	expect(isEpt(0)).toBe(true);
	expect(isEpt(1)).toBe(true);
	expect(isEpt("2")).toBe(false);
	expect(isEpt("")).toBe(true);
	expect(isEpt(true)).toBe(true);
	expect(isEpt(false)).toBe(true);
	expect(isEpt(NaN)).toBe(true);
	expect(isEpt(void 0)).toBe(true);
});

test('type if [Nactive]', ()=> {
	expect(isNat(null)).toBe(false);
	expect(isNat({})).toBe(false);
	expect(isNat({a:1})).toBe(false);
	expect(isNat([])).toBe(false);
	expect(isNat([2,3,1,4])).toBe(false);
	expect(isNat(arguments)).toBe(false);
	expect(isNat(function(){})).toBe(false);
	expect(isNat(0)).toBe(false);
	expect(isNat(1)).toBe(false);
	expect(isNat("2")).toBe(false);
	expect(isNat("")).toBe(false);
	expect(isNat(true)).toBe(false);
	expect(isNat(false)).toBe(false);
	expect(isNat(NaN)).toBe(false);
	expect(isNat(void 0)).toBe(false);
});

test('type if [Requested]', ()=> {
	expect(isNeed(null)).toBe(true);
	expect(isNeed({})).toBe(true);
	expect(isNeed({a:1})).toBe(true);
	expect(isNeed([])).toBe(true);
	expect(isNeed([2,3,1,4])).toBe(true);
	expect(isNeed(arguments)).toBe(true);
	expect(isNeed(function(){})).toBe(true);
	expect(isNeed(0)).toBe(true);
	expect(isNeed(1)).toBe(true);
	expect(isNeed("2")).toBe(true);
	expect(isNeed("")).toBe(true);
	expect(isNeed(true)).toBe(true);
	expect(isNeed(false)).toBe(true);
	expect(isNeed(NaN)).toBe(true);
	expect(isNeed(void 0)).toBe(false);
});

test('type if [Int]', ()=> {
	expect(isInt(null)).toBe(false);
	expect(isInt({})).toBe(false);
	expect(isInt({a:1})).toBe(false);
	expect(isInt([])).toBe(false);
	expect(isInt([2,3,1,4])).toBe(false);
	expect(isInt(arguments)).toBe(false);
	expect(isInt(function(){})).toBe(false);
	expect(isInt(0)).toBe(true);
	expect(isInt(1)).toBe(true);
	expect(isInt(110)).toBe(true);
	expect(isInt(-9)).toBe(true);
	expect(isInt(-9.23)).toBe(false);
	expect(isInt(1.3232342)).toBe(false);
	expect(isInt("2")).toBe(false);
	expect(isInt("")).toBe(false);
	expect(isInt(true)).toBe(false);
	expect(isInt(false)).toBe(false);
	expect(isInt(NaN)).toBe(false);
	expect(isInt(void 0)).toBe(false);
});

test('type if [Float]', ()=> {
	expect(isFloat(null)).toBe(false);
	expect(isFloat({})).toBe(false);
	expect(isFloat({a:1})).toBe(false);
	expect(isFloat([])).toBe(false);
	expect(isFloat([2,3,1,4])).toBe(false);
	expect(isFloat(arguments)).toBe(false);
	expect(isFloat(function(){})).toBe(false);
	expect(isFloat(0)).toBe(false);
	expect(isFloat(1)).toBe(false);
	expect(isFloat(110)).toBe(false);
	expect(isFloat(-9)).toBe(false);
	expect(isFloat(-9.23)).toBe(true);
	expect(isFloat(1.3232342)).toBe(true);
	expect(isFloat("2")).toBe(false);
	expect(isFloat("")).toBe(false);
	expect(isFloat(true)).toBe(false);
	expect(isFloat(false)).toBe(false);
	expect(isFloat(NaN)).toBe(false);
	expect(isFloat(void 0)).toBe(false);
});

test('type if [Identifier]', ()=> {
	expect(isIdt("2asdc")).toBe(false);
	expect(isIdt("_snsad_sd")).toBe(true);
	expect(isIdt("@ekdd")).toBe(false);
	expect(isIdt("$qwiod_dd")).toBe(true);
});

test('type if [Type]', ()=> {
	expect(typec(null)).toBe('null');
	expect(typec({})).toBe('object');
	expect(typec({a:1})).toBe('object');
	expect(typec([])).toBe('array');
	expect(typec([2,3,1,4])).toBe('array');
	expect(typec(arguments)).toBe('arguments');
	expect(typec(function(){})).toBe('function');
	expect(typec(0)).toBe('number');
	expect(typec(1)).toBe('number');
	expect(typec("2")).toBe('string');
	expect(typec("")).toBe('string');
	expect(typec(true)).toBe('boolean');
	expect(typec(false)).toBe('boolean');
	expect(typec(NaN)).toBe('number');
	expect(typec(void 0)).toBe('undefined');
});
