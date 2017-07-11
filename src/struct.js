/* 
 * Struct
 *
 * The C Lang Javascript construction lib
 *
 * C & Trunk with <The C programming language>
 * Hats off to K&R
 * Support Web Browser And Node
 *
 * Desktop Browser Support (ES3 ES5 redict)
 *  Chrome 30+
 *  FireFox 4+
 *  IE 9+
 *  Android 4+
 *  Safari 6+
 *
 * Server Version With
 *  Node 6.0+ (Full support with ES6)
 *
 * @Author  : YiJun
 * @Date    : 2017.2.28 - now
 */

(function(root,struct,factory,_){
	_ = factory(struct);

	if(typeof define === 'function' && define.amd)
		// Ruler by UMD Javascript
		// support AMD define
		define('struct',[],function(){ return _; });
	else if(typeof exports === "object" && typeof module !== "undefined"){
		if(module.exports && !module.nodeType) // support CommonJS exports
			exports = module.exports = _;
		exports.struct = _;
	} else
		// build on browser global object
		root.struct = root._ = _;

	// due to [ Webpack ] fucking should return [ Window ]
}(this, function(root){ 
	if(typeof self !== "undefined") root = self; 
	else root = this || global;
	return root;
}, function(struct){
'use strict';

// Strict model
// Link to Ax.VERSION
// define const
struct.VERSION = "3.3.3";

// base method
var or = {},
    ar = [],
    st = "",
    slc = ar.slice,
    ts = or.toString,
    tm = st.trim,
    cot = ar.concat,
  	ev = eval,

  	broken = Object.freeze({});

// strict mode hack this
// hack* =>
// var root = this
// var root = (function(){ return this || ev("this"); }());
var root = struct();

// Sub struct return pointer
// Zub struct with custom method in function
function nub(fn,name){ 
	struct[name] = function(){ return fn; };
}

function zub(fn,name){ 
	struct[name] = function(use){ 
		return fn[trim(toString(use).toLowerCase())] || fn.default; 
	};
}

// extend Object-assign or pub struct method
// @use has
// @use depclone
// @export extend
// @export *depextend
function extend(o1,o2,nothisproperty){
	if(nothisproperty)
		fov(o2,function(v,k){
			if(isArray(nothisproperty) ? 
				!has(nothisproperty,k) :
				(nothisproperty != null ? k !== nothisproperty : true))
				o1[k] = v; 
		});
	else
		fov(o2,function(v,k){ o1[k] = v; });
	return o1;
}

// extend object or define module for struct
function depextend(a,b,nothisproperty){
	return extend(extend(isArrayLike(a)?[]:{},a),b,nothisproperty);
}

// define Property [ ES5 method ]
// @use object.defineProperty
function define(obj,prop,st){
	return isObj(prop) ?
		Object.defineProperties(obj,prop) :
		Object.defineProperty(obj,prop,st);
}

// create itree function [ method ]
// save the arguments to next apply
function cit(fn){
	var args = slice(arguments,1);
	return function(){
		return fn.apply(null,args.concat(slice(arguments))); 
	};
}

// check -> function
// a
function citd(fn,check){
	return function(){
		return (check.apply(null,arguments) ? fn : cool).apply(null,arguments);
	};
}
	
// Typeof Check List
// @ Object
// @ Primitive
// @ Identifier
// @ Error
// @ ArrayLike
// @ NaN
// @ Int
// @ Float
// @ Date
// @ Empty
// @ Element [ Node ]
// @ Native
// @ *Define [ contain ]

// @ exprot type[name] 
var reHostCtor = /^\[object .+?Constructor\]$/,
	// Compile a regexp using a common native method as a template.
	// We chose `Object#toString` because there's a good chance it is not being mucked with.
	reNative = RegExp('^' +
		// Coerce `Object#toString` to a string
		String(ts)
		// Escape any special regexp characters
		.replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
		// Replace mentions of `toString` with `.*?` to keep the template generic.
		// Replace thing like `for ...` to support environments like Rhino which add extra info
		// such as method arity.
		.replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

// Function [ type ]
function isFn(e){
	return typeof e === "function" && e === e && !!e;
}

// Object [ type ]
function isObj(e){
	return !!e && (typeof e === "object" || isFn(e));
}

// String [ type ]
function isStr(e){
	return typeof e === "string" || e+"" === e;
}

// Boolean [ type ]
function isBool(e){
	return typeof e === "boolean" && (!!e) === e;
}

// Number [ type ]
function isNum(e){
	return typeof e === "number" && e === +e;
}

// Primitive [ type ]
function isPrimitive(e){
	return e == null || typeof e !== "object" ;
}

// Native isArray
var isArray = Array.isArray;

// Identifier [ type ]
var rident = /^[a-z$_]+[a-z$_0-9]*$/i;
function isIdentifier(e){
	return e!=null ? rident.test(e) : false;
}

function isRequired(e){
	return 0 in arguments && e !== void 0;
}

// Error [ type ]
function isError(obj){
	return obj !== null &&
		typeof obj === "object" &&
		typeof obj.message === "string" &&
		typeof obj.name === "string";
}

// Define the typename [ type ]
function isDefine(obj,name){
	return ts.call(obj) === '[object ' + name + ']';
}

// ArrayLike [ type ] 
function isArrayLike(obj){
	return obj !==null && (typeof obj.length === "number" && isObj(obj)) &&(
				 isArray(obj) ||
				 isDefine(obj,"Arguments") ||
				 isDefine(obj,"NodeList") ||
				 isDefine(obj,"HTMLCollection")||
				 isDefine(obj,"Storage"));
}

// isNaN [ ES6 Method ]
function isNaN(n){
	return typeof n === "number" && n !== n;
}

function isInt(n){
	return +n===n && n%1 === 0;
}

function isFloat(n){
	return +n===n && n%1 !== 0;
}

function isDate(n){
	return n instanceof Date;
}

function isEmpty(n){
	return isPrimitive(n) ? false : !size(n);
}

function isDOM(e){
	return isObj(e) && e.nodeType > 0 && (e instanceof Node || e instanceof Element);
}

function isElement(e){
	return e instanceof Element;
}

function isNode(e){
	return e instanceof Node;
}

// Detect if a Function is Native Code with JavaScript
function isNative(api){
  return typeof api === 'function' ?
  // Use `Function#toString` to bypass the value's own `toString` method
  // and avoid being faked out.
     reNative.test(Function.prototype.toString.call(api)) :
  // Fallback to a host object check because some environments will represent
  // things like typed arrays as DOM methods which may not conform to the
  // normal native pattern.
     (api && typeof api === 'object' && reHostCtor.test(ts.call(api))) || false;
}

var typeArray = [
  'array',
  'function',
  'null',
  'undefined',
  'arguments',
  'boolean',
  'string',
  'number',
  'date',
  'regexp',
  'nodeList',
  'htmlcollection'
];

// Typec advance typeof [ method ]
function typec(e){
  var types = [
  	isArray(e),
		isFn(e),
		e === null,
		e === void 0,
		isDefine(e,"Arguments"),
		isDefine(e,"Boolean"),
		isDefine(e,"String"),
		isDefine(e,"Number"),
		isDefine(e,"Date"),
		isDefine(e,"RegExp"),
		isDefine(e,"NodeList"),
		isDefine(e,"HTMLCollection")
	];

	return typeArray[index(types,fseq(true))] || "object"; 
}


// Optimze V8 compress
// check form bluebird.js ( miss *ASSERT checker )
function v8(obj){
	var $ = function(){};
	$.prototype = obj;
	
	var l = 8;
	while(l--) new $();
	return obj;
	// Prevent the function from being optimized through dead code elimination
	// or further optimizations. This code is never reached but even using eval
	// in unreachable code causes v8 to not optimize functions.
	// eslint [ eval not ]
	eval(obj);
}

// #NEW V8 compress
// function v8(obj){
// 	function Sub(){}
// 	Sub.prototype = obj;
// 	var receiver = new Sub();

// 	function ic(){ return typeof receiver._ }
// 	ic(); ic();

// 	return obj;
// 	eval('o'+o);
// }

// noop function pointer
// cool function return origin value
function noop(){}
function cool(e){ 
	return e;
}

// safe convert [ method ]
// @use toString
// @use toNumber
// @use toRGB => HexToRGB
// @use toHEX => RGBToHex
// @export convert(method)
function toString(s){
	return s!=null ? (typeof s.toString === "function" ? s.toString() : s+'') : '';
}

function toNumber(s){
	return (typeof +s === "number" && +s===+s) ? +s : s>>0;
}

// HEX Create RGB object
function toRGB(hex){
	var h = parseInt((!~hex.indexOf('#') ? hex : hex.substr(1)),16);
	return { r: h>>16, g:(h&0x00FF00)>>8, b:(h&0x0000FF) };
}

// RGB object to HEX
function toHEX(rgb){
	// var hex = [
	// 	rgb.r.toString(16),
	// 	rgb.g.toString(16),
	// 	rgb.b.toString(16)
	// ];

	// return '#'+hex.map(function(val){
	// 	return (val.length === 1 ? '0' : '') + val;
	// }).join('');
	
	return ((1<<24) + (rgb.r<<16) + (rgb.g<<8) + rgb.b).toString(16).substr(1);
}

function toArray(n){
	var res = [];
	if(isObj(n)||isDefine(n,"String"))
		res = values(n);
	else if(n!=null)
		res.push(n);
	return res;
}

function toMinus(n){
	return -toNumber(n);
}

// XOR operation, 
// details: http://en.wikipedia.org/wiki/XOR_swap_algorithm
function swap(a,b){
	a^=b;
	b^=a;
	a^=b;
}

// cast arguments to Array
function castArray(){
	return slice(arguments);
}

function slice(ary,n,e){
	return isArrayLike(ary) ? slc.call(ary,n,e) : [];
}

function keys(e){
	if(e !=null){
		if(isArray(e))
			return Object.keys(e).map(toNumber);
		return Object.keys(e);
	}
	return [];
}

// Loop Array ^ Object
// @use al
// @use ol
// @export *op
// @alias each
function al(ary,fn,ts){
	for(var i=0, l=ary.length; i<l; i++)
		fn.call(2 in arguments ? ts : ary, ary[i], i, ary);
	return ary;
}

function ol(obj,fn,ts){
	var _ = function(key){ fn.call(this,obj[key],key,obj); };
	al(keys(obj), _, 2 in arguments ? ts : obj);
	return obj;
}

function fov(list){
	if(isArray(list))
		return al.apply(list,arguments);
	else if(isObj(list) && !isFn(list) && list !== null)
		return ol.apply(list,arguments);
	return list;
}

// Simple Clone [ fast , signet ]
// @use depclone
// @export *clone
// @alias(deep) depclone

// Simple clone [ fast ]
function clone(l,deep){
	if(deep)
		return depclone(l);
	if(isArrayLike(l))
		return slice(l);
	if(!isPrimitive(l))
		return JSON.parse(JSON.stringify(l));
	return l;
}

var p_ = function(){};
// Deeping Clone [ fast , complicated ]
function depclone(l){
	var res = l;
	if(isArrayLike(l)){
		// clone array 
		res = slice(l).map(citd(depclone,negate(isPrimitive)));
	}else if(!isPrimitive(l) && !(l instanceof Node)){
		var prt = p_.prototype = l.constructor.prototype;
		// clone object ^ with copy prototype
		ol(l, function(val,key){
			this[key] = isPrimitive(val) ? val : depclone(val);
		},res = (prt !== Object.prototype ? new p_ : {} ));
	}
	return res;
}

function regCheck(reg,n){
	return reg.test(n);
}

// List has [ method ]
// Identifier if has value in array
// @use has
// @use hasKey
// @export *has

// has([1,2,3],2) => true;
function has(list,n,ueq){
	var compare = isDefine(n,"RegExp") ? regCheck : (ueq ? eq : seq),
			idf = false , key = isPrimitive(list) ? [] : keys(list);
	for(var i=key.length; i--;)
		if((idf=compare(n,list[key[i]])))
			break;
	return idf;
}

// hasKey({a:1,b:2},'a') => true;
// hasKey({a:1,b:2},'c') => false;
function hasKey(list,key,ueq){
	return has(isPrimitive(list) ? [] : keys(list), key , ueq);
}

// Array not [ array method ]
// @use notdel
// @export *not
// pull a element in array ^ object
function notdel(list,k,isarr){
	return isarr ? list.splice(k,1) : delete list[k];
}

// not([1,2,3,2,3,4,5],3) => [1,2,2,4,5]
function not(list,n,useq){
	var check = isDefine(n,"RegExp") ? regCheck : (useq ? eq : seq),
			isarr = isArray(list),
			p = keys(list);
	for(var i=0 ; i<p.length ; i++)
		if(check(n,list[p[i]]))
			if(notdel(list,p[i],isarr) && isarr)
				p.pop(i--);
	return list;
}

// List filter [ method ]
// @use filter
// @use find
// @use index
// @use reject
// support regexp && value filter
function filter(list,idf,reskey){
	var res = [], 
			fn = isDefine(idf,'RegExp') ? cit(regCheck,idf) :
			(isFn(idf) ? idf : fseq(idf));
	fov(clone(list),function(val,key,that){
		if(fn.apply(that,arguments)) 
			this.push(reskey ? key : val);
	},res);
	return res;
}

function reject(list,idf,reskey){
	return filter(list,negate(idf),reskey);
}

function every(list,idf){
	var res = true;
	for(var key = keys(list),i=key.length;i--;)
		if(!(res=idf(list[key[i]],key[i],list)))
			break;
	return res;
}

function some(list,idf){
	var res = false;
	for(var key = keys(list),i=key.length;i--;)
		if((res=idf(list[key[i]],key[i],list)))
			break;
	return res;
}

// filter indexkey
// FindIndex array [ method ]
// @use index
// @use firstindex
// @use lastindex
// @use one
// @export *index
//
// index([1,2,3,1,2,4,1],1) => [0,3,6]
function index(list,idf){
	var res = filter(list,idf,true);
	return res.length === 1 ? res.pop() : (res.length ? res : null);
}

function lastindex(list,idf){
	var res = index(list,idf);
	return isPrimitive(res) ? res : res.pop();
}

function firstindex(list,idf){
	var res = index(list,idf);
	return isPrimitive(res) ? res : res.shift();
}

// the one what found in this array [ method ]
// @fix index
// export one (single)
function one(list,idf){
	var res = firstindex(list,idf);
	return res === null ? res : list[res];
}

// Get first element in array [ method ]
// @export last
// @export first
// @alias *head (first)
function first(ary){
	return isArrayLike(ary) ? ary[0] : ary;
}

function last(ary){
	return isArrayLike(ary) ? ary[ary.length-1] : ary;
}

// List map [ method ]
// values map
// @use mapValue
// @use mapKey
// @export map
function mapValue(list,fn){
	return fov(clone(list),function(val,key,list){
		list[key] = this ? fn.apply(list,arguments) : val[fn];
	},isFn(fn));
}

// function mapKey [ method ]
// map the [ Object ] keys
function mapKey(list,fn){
	var res = {};
	ol(list,function(val){
		res[fn.apply(list,arguments)] = val;
	});
	return res;
}

// List cat [ method ]
function cat(list,idf){
	var res = [],
			fn = isDefine(idf,'RegExp') ? cit(regCheck,idf) :
			(isFn(idf) ? idf : fseq(idf));

	if(isArray(list)){
		for(var i=0,l=list.length; i<l; i++)
			if(fn.call(list,list[i],i,list))
				res.push(list.splice(i,1).pop(i--));
	}else if(isObj(list)){
		for(var k in list){
			if(list.hasOwnProperty(k))
				if(fn.call(list,list[k],k,list)){
					var po = {};
					po[k] = list[k];
					res.push(po);
					delete list[k];
				}
		}
	}
	return res;
}

// Array Unique [ array method ]
// @use eq
// @use seq
// @fix *fseq
// @use fastunqiue [ pure type ] [ fast n]
// @use slimunqiue [ all allow ] [ slim n^n-1 ]
// @export unique(method)
function seq(a,b){
	return a===b;
}

function nseq(a,b){
	return a!==b;
}

function fseq(a){
	return function(n){
		return n === a;
	};
}

function fastUnique(ary){
	var u = {}, n = typeof first(ary) === 'number';

	for(var i = 0 ; i<ary.length; i++){
		if(u[ary[i]]) continue;
		u[ary[i]] = true;
	}

	return keys(u).map(n ? toNumber : cool);
}

function slimUnique(ary,ueq){
	var c = slice(ary);
	for(var check = ueq ? eq : seq, i = 0 ; i<c.length; i++)
		if(i !== c.length-1)
			for(var j=i+1; j<c.length; j++)
				if(check(c[i],c[j])) c.splice(j--,1);
	return c;
}

// advance map [ method ]
function hook(list,hookname){
	var func = isFn(hookname);
	return mapValue(list,function(val){
		return (func ? hookname : val[hookname]).apply(val,arguments);
	});
}

// pluck contain [ method ]
function pluck(list,mapkey,dowith){
	var res = [], keyname = toString(mapkey);
	fov(list,function(item){
		var v = getProp(item,mapkey,dowith);
		return v !== void 0 && this.push(v);
	},res);
	return res;
}

// groupBy [ method ]
function groupBy(list,by){
	var group = {},
		func  = isFn(by);
	fov(list,function(val){
		var key = func ? by(val) : getProp(val,by);
		if(key){
			if(!this[key])
				// first time should init group check
				this[key] = [val];
			else
				this[key].push(val);
		}
	},group);
	return group;
}

// countBy [ method ]
// countBy(['abc','de','fg'],'length') => {2: 2, 3: 1}
// countBy([3.1, 1.4, 1.2, 2.2],Math.floor) => {1: 2, 2: 1, 3: 1}
function countBy(list,by){
	var res = {},
		fn = isFn(by);
	fov(list,function(val){
		var key = fn ? by(val) : getProp(val,by);
		if(key){
			if(!res[key])
				this[key] = 1;
			else
				this[key] += 1;
		}
	},res);
	return res;
}

// Pairs Object to array 
// @use pairs
// @use unpairs
// @export *pair(s)
//
// pairs({a:1,b:2}) => [['a',1],['b',2]]
// unpairs([['a',1],['b',2]]) => {a:1,b:2}
function pairs(obj){
	var res = [];
	var key = keys(obj);
	for(var i=0,l=key.length; i<l ; i++)
		res.push([key[i],obj[key[i]]]);
	return res;
}

function unpairs(ary){
	var res = {};
	for(var i=0,l=ary.length; i<l ; i++)
		res[ary[i][0]] = ary[i][1];
	return res;
}

// Pull element form array [ method ]
// @use not
// @use pullAll
// @use pullAt
// @use flatten
// @export pull

// pullAll([1,2,3,4,1,2,4],1,4) => [2,3,2];
function pullAll(ary){
	var ft = flatten(slice(arguments,1),true);
	return (ary = filter(ary,negate(cit(has,ft))));
}

function pullAt(ary){
	var ft = flatten(slice(arguments,1),true);
	return (ary = filter(ary,function(val,index){
		return !has(ft,index);
	}));
}

var pullWith = not;

// Array Disorder
// Shuffle a collection , using the modern version of the
// [Fisher-Yates shuffle] (http://en.wikipedia.org/wike/Fisher-Yates_shuffle)
// @use random
function shuffle(ary){
	var ln = ary.length,
			disorder = new Array(ln);
	for( var i=0 , ra; i<ln; i++){
		ra = randomInt(0,i);
		if(ra !==i)
			disorder[i] = disorder[ra];
		disorder[ra] = ary[i];
	}
	return disorder;
}

// Chunk partof array [ method ]
// chunk([1,2,3,4]) => [[1,2],[3,4]]
function chunk(ary,size){
	var s = parseInt(toNumber(size)) || 2 ,res = [];
	for(var i=0,l=ary.length;i<l;i+=s)
		res.push(ary.slice(i,i+s));

	return res;
}

// Compact array [ method ]
// save pure number filter the false value
// compact([1,'',false,2,undefined,null,[],3]) => [1,2,[],3]
function compact(ary){
	return filter(ary,cool);
}

function concat(){
	return cot.apply([],arguments);
}

// Difference array [ method ]
// @use index
// @use cit
// @export diff
// @export *intsec
// diff([1,2],[2,3],[1,3,4],[5]) => [4,5]
function diff(){
	var res = [];
	for(var tmp = concat.apply([],arguments),
			s = tmp.shift(tmp.push(tmp.length-1)); 
			tmp.length !== 0; s = tmp.shift())
			has(tmp,s,true) ? not(tmp,s,true) : res.push(s);
	return res;
}

// intersection([1,2],[2,3],[2,3,4]) => [2]
function intersection(){
	var res = [], pact = slice(arguments);
	pact.reduce(function(cot,arr){
		var r = [];
		if(size(cot) && size(arr))
			al(cot,function(value){
				if(has(this,value,true)) 
					r.push(value); },arr);
		return (res = r);
	},pact.shift()||[]);

	return res;
}

// Merge array [ method ]
// @export merge
// merge([1,2,3],[2,1,3],[3,4],[1,5]) => [1,5,3]
// merge({ a:1 },{ a:2,b:{c:1} },{ b:{d:4} }) => { a:1,b:{c:1,d:4} }
function mergeCompare(v,n){
	return (!isPrimitive(v) && !isPrimitive(n)) && 
				 ((isDefine(v,"Object") && isDefine(n,"Object")) || 
				 (isArrayLike(v) && isArrayLike(n)));
}

function merge(f){
	var res, collect = slice(arguments);
	if(isArray(f)){
		// deeping reduce to merge
		collect.reduce(function(val,next){
			return al(next,function(v,i){ if(v!=null) val[i] = v; }), (res=val);
		},[]);
	}else if(isObj(f)){
		collect.reduce(function(val,next){
			var vk = keys(val) , nk = keys(next);
			return al(nk,function(key){ var v = val[key], n = next[key];
				val[key] = mergeCompare(v,n) ? merge(v,n) : n; }), (res=val);
		},{});
	}
	return res;
}

// Drop array [ method ]
// base @use slice method
// @use dropLeft
// @use dropRight
// @use dorpTo
// @export drop

// dropLeft([1,2,3]) => [2,3]
function dropLeft(ary,n){
	return slice(ary,toNumber(n)||1);
}

// dropRight([1,2,3],2) => [1]
function dropRight(ary,n){
	return slice(ary,0,-(toNumber(n)||1));
}

// dropTo([4,3,2,1,-1,-2],2) => [1,-1,-2];
function dropTo(ary,it){
	var res = slice(ary),
			key = this===void 0 ? "shift" : "pop",
			fn = isDefine(it,'RegExp') ? 
					 cit(regCheck,it) :
					 (isFn(it) ? it : fseq(it));

	for(var i=res.length;i--;)
		if(fn(res[key]())) 
			break;
	return res;
}
// Flatten array *with deep [ method ]
// flatten([1, [2, [3, [4]], 5]],true) => [1,2,3,4,5]
function flatten(){
	var args = concat.apply([],arguments),
			deep = isDefine(last(args),'Boolean') ? args.pop() : false;

	return slice(args).reduce(function(flat,toFlat){
		return flat.concat(deep ? 
			(isArray(toFlat) ? flatten(toFlat,deep) : toFlat) : toFlat); 
	},[]);
}

// Chance random with any construction
// @use randomInt
// @use randomFloat
// @use randomString
// @export *random
// init chance form
var rNumber = '0123456789',
		rCharow = 'abcdefghijklmnopqrstuvwxyz',
		rCharup = rCharow.toUpperCase(),
		rHex    = rNumber+'abcdef',
		rSymbol = '~`!@#$%^&*(){}[]-+=_|/.,><:;';

// Random static Int [ method ]
function randomInt(min,max){
	if(!isNum(max)){
		max = min; min = 0;
	}
	return min + Math.floor(Math.random()*(max-min+1));
}

// Random static Float [ method ]
function randomFloat(min,max,fix){
	if(!isNum(max)){
		max = min; min = 0;
	}
	var num = Math.random()*(max-min)+min;
	return toNumber(fix) ? +(num.toFixed(fix)) : num;
}

// Random boolean [ method ]
function randomBool(range){
	return Math.random()*100 < Math.max(1,Math.min(toNumber(range||50),99));
}

// Random char [ method ]
function randomCharacter(all,upper){
	var letters = all ? (rNumber + rSymbol) : '';
	letters = (upper ? rCharup : rCharow) + letters;

	return letters.charAt(randomInt(0,size(letters)-1));
}

// random HEX [ method ]
// *create rgb random object
function randomHex(format){
	return (format ? '#' : '') + toHEX({
		r : randomInt(0,255),
		g : randomInt(0,255),
		b : randomInt(0,255)
	});
}

// random string [ method ]
function randomString(leng,all,upper){
	// min leng => 2
	var len = toNumber(leng) || 2,res=[];
	for (var i=len; i--;)
		res[i]=randomCharacter(all,upper);
	return res.join('');
}

// random Date before now or feature [ method ]
function randomDate(){
	var n = now();
	return new Date(n+(randomBool()? cool : toMinus)(randomInt(0,n)));
}

// random like dice [ method ]
// only odd
function randomDice(max){
	max = toNumber(max) > 0 ? toNumber(max) : 2; 
	return randomInt(1,(max%2===0?max:max+1));
}

// Create Function caller [ method ]
// @use partial
// @use before
// @export part , once
function partial(fn){
	var boundArgs = slice(arguments,1);

	return function(){
		var position = 0;
		var args = boundArgs.slice();

		for (var i = 0, len = args.length; i < len; i++)
			if(args[i] === struct)
				args[i] = arguments[position++];

		while(position < arguments.length)
			args.push(arguments[position++]);

		return fn.apply(this,args);
	};
}

function before(times,fn){
	var undef;
	return function(){
		if(--times > 0)
			undef = fn.apply(this,arguments);
		else
			fn = null;
		return undef;
	};
}

// building the (*) times Function
// base it on _.once  --- underscore.js
function part(fn,times){
	return (partial(before,(toNumber(times)||1)+1))(fn);
}

// create once function
function once(fn){
	return part(fn);
}

// slim equal [ method ]
function eq(x,y){
	if(x===y || ts.call(x) !== ts.call(y)|| (isPrimitive(x) && isPrimitive(y)))
		return x===y;
	if(x.toString() === y.toString()){
		var xkeys = keys(x) , ykeys = keys(y);
		if(xkeys.length === ykeys.length){
			for(var i=xkeys.length; i--; )
				if(!eq(x[xkeys[i]],y[xkeys[i]]))
					return false;
			return true;
		}
	}
	return false;
}

// URL [param] parse and stringify
// Browser useful
// @use paramParse
// @use paramStringify
// @use requery
// @export param
var whiteSpace = /[\t\r\n\f\x20]/g,
		qrsReg = /([^&=]+)=?([^&]*)/g;

// pack the serializeArray to Object
// @fix jQuery.serializeArray
// @fix Zepto.serializeArray
// @fix z.serializeArray
// @export requery
function requery(serializea){
	var res = {};
	al(serializea,function(elm){ res[elm.name] = elm.value; });
	return res;
}

function rSpace(part){ 
	return decodeURIComponent(part.replace(/\+/g," ")); 
}

function rInsignia(part){ 
	return encodeURIComponent(part).replace(" ","%20"); 
}

function paramParse(url){
	var turl = toString(url).split("#").shift();

	var findQuery = turl.indexOf("?") , match , x = {},
			param = ~findQuery ? turl.substr(findQuery+1) : turl;

	while((match = qrsReg.exec(param)))
		x[rSpace(match[1])] = rSpace(match[2]);

	return x;
}

function paramStringify(param){
	var Cparam = clone(param);

	for(var key in Cparam)
		Cparam[key] = rInsignia(
			isObj(Cparam[key]) ?
			JSON.stringify(Cparam[key]) :
			Cparam[key]
		);

	return JSON.stringify(Cparam)
		.replace(/["{}]/g,"")
		.replace(/:/g,"=")
		.replace(/,/g,"&")
		.replace(whiteSpace,"");
}

// slim Template engine call [ DOOM ]
var no = "(.)^";
var ecode = {
	"&" : "&amp;",
	">" : "&gt;",
	"<" : "&lt;",
	'"' : "$quot;",
	"'" : "&#x27;",
	"`" : "&#x60"
};
var dcode = {
	"&amp;"  : '&',
	"&gt;"   : '>',
	"&lt;"   : '<',
	"&quot;" : '"',
	"&#x27;" : "'",
	"&#x60;" : '`'
};
var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
var escapes = {
	"'"      : "'",
	"\\"     : "\\",
	"\r"     : "r",
	"\n"	   : "n",
	"\u2028" : "u2028",
	"\u2029" : "u2029"
};

var encodeReg    = /[&<">'](?:(amp|lt|quot|gt|#39);)?/g,
		decodeReg    = /&((g|l|quo)t|amp|#39);/g,
		stripReg     = /<script\b[^>]*>(.*?)<\/script>/gi,
		commentReg   = /<!--([\s\S]*?)-->/gi,
		zipReg       = /[\t\r\n\f]/gim,
		upperReg     = /[A-Z]/g,
		sReg         = '[\\s\\x20\\xA0\\uFEFF]+',

		collapseReg  = new RegExp(sReg,'g'),
		trimLReg     = new RegExp('^'+sReg,'g'),
		trimRReg     = new RegExp(sReg+'$','g'),
		tagCenterReg = new RegExp('>'+sReg+'<','g'),
		tagLeftReg   = new RegExp('<'+sReg,'g'),
		tagRightReg  = new RegExp(sReg+'>','g'),
		tagCloseReg  = new RegExp('<\/'+sReg,'g');

// String Methods 
// @use trim
// @use trimLeft
// @use trimRight
// @use camelize
// @use capitalize
// @use collapse
// @use rizewith [ default (-) ]

// String trim [ method ]
function trim(s){
	return tm.call(s);
}

function trimLeft(s){
	return s.replace(trimLReg,'');
}

function trimRight(s){
	return s.replace(trimRReg,'');
}

function camelize(s){
	var uspt = !~s.search('-') ? (!~s.search('_') ? '' : '_') : '-';
	if(uspt){
		uspt = s.split(uspt);
		for(var i=1;i<uspt.length;i++)
			uspt[i] = capitalize(uspt[i]);
		return uspt.join('');
	}
	return s;
}

function capitalize(s){
	return s.charAt(0).toUpperCase()+s.substr(1);
}

function collapse(s){
	return trim(s).replace(zipReg,'')
					.replace(collapseReg,' ')
					.replace(tagCenterReg,'><')
					.replace(tagLeftReg,'<')
					.replace(tagRightReg,'>')
					.replace(tagCloseReg,'</');
}

function rize(s,and,upper){
	var cmd = upper ? "toUpperCase" : "toLowerCase",
		c = toString(and) || '-'; 
	return s.replace(upperReg,function(charz,index){
		return (index>0 ? c : '') + charz[cmd]();
	});
}

function c_ecode(str){ return ecode[str] || str; }
function c_dcode(str){ return dcode[str] || str; }
function c_escape(et){ return '\\' + escapes[et]; }

// html escape method
// @use encodeHTML
// @use decodeHTML
// @use stripHTML
// @use zipHTML
// @fix wrap(s,z)
//
// @export html(command)
function encodeHTML(str){
	return +str===str ? 
					str :
					toString(str).replace(encodeReg,c_ecode);
}

function decodeHTML(str){
	return +str===str ? 
					str : 
					toString(str).replace(decodeReg,c_dcode);
}

function stripHTML(str){
	return str.replace(stripReg,'')
						.replace(commentReg,'');
}

function zipHTML(str){
	return collapse(str.replace(commentReg,''));
}

// ID Form GAME - [[ DOOM4 ]]
// slim javascript Template engine
// [ fast, precomplete, zoom ]
// @use ev
// @export doom

// const DOOM4 settings
// rule for parse Template
var doomSetting  = {
	escape      : "{{-([\\s\\S]+?)}}",
	interpolate : "{{#([\\s\\S]+?)}}",
	command     : "{{\\*([\\s\\S]+?)}}",
	evaluate    : "{{([\\s\\S]+?)}}",
};

var cmExec = /^([\S]+)\s?([\s\S]+)?/;
var agExec = /[\[\]]*/g;

function makeComand(command){
	var res = "", 
			cms = cmExec.exec(trim(command)),
			cmd = cms[1],
			param = cms[2];
	if(cmd){
		switch(cmd.toLowerCase()){
			case "end":
				res = "';}); _p+='";
				break;
			case "if":
			case "exist":
				param = param.split(" then ");
				res = "'; var " + param[0] + " = " + param[0] + " || false; "+
							"_ext("+param[0]+","+(param[1] ? param[1].toString()+"," : "")+"function(){ _p+='";
				break;
			case "for":
			case "each":
				// {{* each [item,index] in list }}
				param = param.split(" in ");
				res = compiLing("op",param[1],param[0]);
				break;
			case "not":
			case "cat":
			case "extend":
				//{{* not param with list }}
				param = param.split(" with ");
				res = compSaze(cmd,param[1],param[0]);
				break;
			default:
				//{{* map list use params }}
				param = param.split(" use ");
				res = compSaze(cmd,param[0],param[1]||"",true);
				break;
		}
	}

	return res;
}

function compiLing(usestruct,who,useargs){
	return "'; struct."+usestruct+'()('+who+","+ 
				 "function("+useargs.replace(agExec,'')+"){ _p+='";
}

function compSaze(usestruct,who,useargs,assign){
	var api = usestruct.split(":");
	return "'; "+ (assign ? (who+"=") : "") + 
				 "struct."+api[0]+'("'+(api[1]||"")+'")('+who+","+
				 useargs.replace(agExec,'')+"); _p+='";
}

function DOOM(txt,bounds,name){
	var _, render, position = 0,
		res = "_p+='",

		rname = isObj(bounds) ? 
		name : (typeof bounds === "string" ? bounds : ""),
		methods = isObj(bounds) ? bounds : {},

		args = slice(arguments,2),
		exp = new RegExp((this.escape||no) +
			"|" + (this.interpolate||no) + 
			"|" + (this.command||no) + 
			"|" + (this.evaluate||no) + 
			"|$","g");

	// Start parse
	trim(txt)
	.replace(exp,function(
		match,
		escape,
		interpolate,
		command,
		evaluate,
		offset 
	){
		res += txt.slice(position,offset).replace(escaper,c_escape);
		// refresh index where to find text string
		position = offset + match.length;

		if(escape)
			// if command is - should encodeHTML string
			res += "'+((_t=(" + escape + "))==null?'':_(_t))+'";
		else if(interpolate)
			res += "'+((_t=(" + interpolate + "))==null?'':_t)+'";
		else if(command)
			res += makeComand(command,res);
		else if(evaluate)
			res += "';" + evaluate + ";_p+='";
		return match;
	});

	// Minix compline
	res = res.replace(/[\r\n\f]/gim,'')
	  			 .replace(/<!--(.*?)-->/gim,'')
					 .replace(/_p\+=\'(\\n)*\'[^\+]/gim,'')
		 			 .replace(/\s*;;\s*/gim,';')
					 .replace(/[\x20\xA0\uFEFF]+/gim,' ')
					 .replace(/>\s{2,}/gim,'> ')
					 .replace(/\s{2,}</gim,' <');
	// End wrap res@ String
	// use default paramKey to compline
	res = "with(__("+(!rname ? "__({},_x_||{})" : "{}")+",_bounds)){ " + res + "'; }";
	res = "var _t,_d,_ext=struct.exist(),_=struct.html('encode'),__=struct.extend(),_p=''; " + res + " return _p;";

	// Complete building Function string
	// try to build anmousyous function
	// console.warn(res);
	try{ render = ev("(function("+(rname||"_x_")+",_bounds,struct"+(args.length?","+args.toString():"")+"){ "+ res + " })"); 
	}catch(e){ console.error(e.res = res); throw e; }

  // @ Precomplete JavaScript Template Function
  // @ the you build once template that use diff Data, not use diff to build function again
	// @ protect your template code other can observe it?
	_ = function(data){ return eq(arguments,render.pre) ? (render.complete) : 
		(render.pre=arguments, render.complete = trim(render.apply(this,
			[data,methods,struct].concat(slice(arguments,1))
		)));
	};

	return _; eval(_);
}

// Browser cookie
// @use cookieParse
// @export cookie
function cookieParse(ckstr){
	var res={}, pars = ckstr ? ckstr.split(";") : [];

	al(pars, function(item){
		var ind = (item||"").search("=");

		if(!~ind) return;
		var rkey = trim(item.substr(0,ind));
		if(rkey.length)
			res[rkey] = trim(item.substr(ind+1));
	});

	return res;
}

function cookie(param){
	// args :( name , value, expires, path, domain, secure)
	var args = slice(arguments),
		len = args.length,
		parsec = cookieParse(document.cookie);

	if(len){
		// get cookie
		if(len === 1)
			return parsec[param];
		else{
			var time = new Date();
			time.setDate(time.getDate()+365);

			return document.cookie = trim(
				args[0]+"="+(args[1]||"") + ';' +
				"expires="+(args[2]||time.toUTCString()) + ';' +
				"path="   +(args[3]||"/") + ';' +
				"domain=" +(args[4]||"") + ';' +
				( args[5] ? "secure":"" )
			),true;
		}
	}

	return parsec;
}

// slim ajax method
// @use *aix
// @use ajaxGET
// @use ajaxPOST
// @use JSONP
// @export ajax
var MIME = {
	"application/x-www-form-urlencoded": 0,
	"application/json" : 1
};

// deal with Data type
function dataMIME(enable,header,param){
	if(enable)
		switch(header){
			case 0:
				return paramStringify(param||{});
			case 1:
				return JSON.stringify(param||{});
			default : 
				return paramStringify(param||{});
		}
	return param;
}

// base ajax aix [ method ]
function aix(option){
	var config = extend({
		// default param
		url       : "",
		type      : "GET",
		param     : broken,
		charset   : "utf-8",
		vaild     : true,
		cache     : false,
		success   : noop,
		error     : noop,
		loading   : noop,
		loadend   : noop,
		header    : broken,
		username  : null,
		password  : null,
		timeout   : 0,
		aysnc     : true,
		contentType : true
	} , option || {} );

	var ls = root.localStorage;

	if(config.cache){
		// *Init set localStorage
		if(!ls.getItem("_"))
			ls.setItem("_","{}");

		var cache = JSON.parse(ls.getItem("_"));
		var data = cache[config.url || root.location.href.split("#").shift()];

		if(data!==void 0) 
			return config.sucess.call(root,data);
	}

	var xhr = new XMLHttpRequest(), cType;
	// with GET method
	if(config.type.toUpperCase() === "GET" && config.param){
		config.url += (~config.url.search(/\?/g) ?
			"&" : (keys(config.param).length ? "?" : ""))+
			paramStringify(config.param);
		config.param = null;
	}

	//set Loading
	xhr.addEventListener("loadstart",config.loading);
	xhr.addEventListener("loadend",config.loadend);

	xhr.open(
		config.type,
		config.url,
		config.aysnc,
		config.username,
		config.password
	);

	// with POST method
	cType = isObj(config.header) ? 
		(config.header["Content-Type"] || "application/x-www-form-urlencoded" ) : 
		"application/x-www-form-urlencoded";

	if(config.header !== broken && isObj(config.header))
		ol(config.header,function(val,key){ xhr.setRequestHeader(key,val); });

	if(config.type.toUpperCase() === "POST" && 
		config.contentType === true && 
		(cType||"").search("json")===-1)
		xhr.setRequestHeader("Content-Type",cType+";chartset="+config.charset);

	xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
	xhr.setRequestHeader("Struct-Requested","StructHttpRequest");

	xhr.onreadystatechange = function(event){
		// response HTTP response header 200 or lower 300
		// 304 not modifined
		if(xhr.readyState === 4 && xhr.responseText){
			var status = xhr.status;

			if(( status >= 200 && status < 300) || status === 304){
				config.success.call(root,xhr.responseText,xhr,event);
				// if cache been set writeJSON in chache
				if(config.cache){
					var cache = JSON.parse(ls.getItem("_"));
					cache[config.url||root.location.href.split("#")[0]] = xhr.responseText;
					ls.setItem("_",JSON.stringify(cache));
				}
			} else {
				config.error.call(root,xhr,event);
			}
		}
	};

	// setTimeout data of ajax
	if(toNumber(config.timeout)){
		xhr.timeout = toNumber(config.timeout)*1000;
		xhr.ontimeout = function(event){
			if(xhr.readyState !== 4 || !xhr.responseText)
				config.error.call(root,xhr);xhr.abort();
		};
	}

	// send request
	return xhr.send(config.param ? 
		(isObj(config.param) ? 
			dataMIME(config.contentType,MIME[cType],config.param) :
			config.param ) : null),xhr;
}

function JSONP(option){
	var config = extend({
		url : "",
		param : broken,
		key : "callback",
		callback : ("jsonp"+Math.random()).replace(".",""),
		timeout: 5,
		success : noop,
		error : noop
	}, option || {} );

	var url = config.url+"?" +
		paramStringify(config.param) +
		(keys(config.param).length ? "&" : "") +
		config.key + "=" + config.callback;

	var tag = document.createElement("script");
	tag.src = url;

	// define callback
	root[config.callback] = function(res){
		clearTimeout(config.timesetup);

		document.body.removeChild(tag);
		root[config.callback] = null;
		config.success(res);
	};

	// append elm
	// send request
	document.body.append(tag);

	// if timeout will trigger fail call
	if(toNumber(config.timeout)){
		config.timesetup = setTimeout(function(){
			document.body.removeChild(tag);
			root[config.callback] = null;

			config.error();
		},config.timeout * 1000);
	}
}

// get slim method with signet param [ method ]
function ajaxGET(url,param,sucess,error){
	if(isFn(param)){
		error = sucess;
		sucess = param;
		param = {};
	}

	return aix({
		url : url,
		param : param,
		success : sucess,
		error : error
	});
}

function ajaxPOST(url,param,sucess,error){
	if(isFn(param)){
		error = sucess;
		sucess = param;
		param = {};
	}

	return aix({
		url : url,
		type : "POST",
		param : param,
		success : sucess,
		error : error
	});
}

// Struct Events 
// object add custom event, use [ emit ] to trigger
// @use addEvent
// @use removeEvent
// @use *emit
// @export Event
var _events = {} , _eid=0;

function addEvent(obj,type,fn){
	var id = obj._eid || 0;
	if(id === 0) define(obj, "_eid",
		{ value : (id = (++_eid)), writable : false, enumerable: false, configurable: true });
	if(!_events[id]) _events[id] = {};
	if(!_events[id][type]) _events[id][type] = [];
	if(!has(_events[id][type],fn)) _events[id][type].push(fn);
	return obj;
}

function removeEvent(obj,type,fn){
	var id = obj._eid || 0;
	if(id&&_events[id]){
		if(_events[id][type]){
			if(!((not(_events[id][type],fn)).length) || !fn)
				delete _events[id][type];
		}else if(!type && !fn){
			delete obj._eid;
			delete _events[id];
		}
	}
	return obj;
}

function hasEvent(obj,type,fn){
	var res = false, id= obj._eid || 0;
	if(id&&_events[id]){
		if(isFn(fn) && _events[id][type])
			res = has(_events[id][type],fn);
		else
			res = size(_events[id][type]);
	}
	return !!res;
}

function copyEvent(toobj,related){
	var rid = (isObj(related) ? related._eid : 0) || 0;
	if(rid){
		define(toobj,"_eid",{ 
			value : ++_eid, 
			writable : false, 
			enumerable: false, 
			configurable: true 
		});

		_events[toobj._eid] = depclone(_events[rid]);
	}
	return toobj;
}

function fireEvent(obj,type,args){
	var id = obj._eid || 0, args = args||[];
	if(id && _events[id] && type!=="")
		ol(_events[id][type],function(f){
			f.apply(this,args);
		},obj);
}

function emit(obj,type,args){
	return al(
		toString(type).split(","),
		function(t){ fireEvent(this,trim(t),args); },
		obj
	),obj;
}

// Struct Prop listener
// @use getProp
// @exprot prop

// define deeping getProp method
function getProp(obj,prop,dowith){
	var tmp,i,keygen = toString(prop||"").split(".");

	if(keygen.length === 1){
		if(obj.hasOwnProperty(prop))
			tmp = obj[prop];
	}else{
		// [a.b.2]
		for(i=0,tmp = obj;i<keygen.length;i++)
			if(isPrimitive(tmp = tmp[keygen[i]])) 
				break;
	}

	if(dowith){
		var args = slice(arguments,3);
		if(isFn(dowith))
			tmp = dowith.apply(tmp,(args.unshift(tmp),args));
		else if(typeof dowith === "string")
			tmp = isFn(tmp[dowith]) ? 
				tmp[dowith].apply(tmp,args) :
				tmp[dowith];
	}

	return tmp;
}

function setProp(obj,prop,value){
	var tmp,end,i,check,keygen = (prop||"").split(".");
	if(keygen.length === 1){
		obj[prop] = value;
	}else{
		// [a.b.2]
		for(i=0,tmp=obj,check,end=keygen.pop();i<keygen.length;i++)
			tmp = (check = tmp[keygen[i]]) == null ? {} : check ;
		tmp[end] = value;
	}
	return obj;
}

function rmProp(obj,prop){
	var tmp,i,end,keygen = (prop||"").split(".");
	if(keygen.length === 1){
		if(obj.hasOwnProperty(prop))
			delete obj[prop];
	}else{
		for(i=0,tmp=obj,end = keygen.pop();i<keygen.length;i++)
			tmp = tmp[keygen[i]]; 
		if(isArray(tmp))
			tmp.splice(toNumber(end),1);
		else
			delete tmp[end];
	}
	return obj;
}

// return random element [ method ]
// auto([1,2,3,4,5]) => random(in ary);
function auto(ary,num){
	return toNumber(num) > 1 ? 
		slice(shuffle(ary),0,toNumber(num)) : 
		ary[randomInt(size(ary)-1)];
}

// detect Variable size [ method ]
// size([1,2,3]) => 3
// size('abcd') => 4
// size({a:1}) => 1
// size(null) => 0
// size(NaN) => 0
function size(n){
	if(!isFn(n) && n!= null && !isNaN(n))
		return typeof n.length === 'number' ?
			n.length : (isObj(n) ? keys(n).length : 0);
	return 0;
}

// return now TimeStamp [ method ]
function now(){
	return (new Date()).getTime();
}

// object values [ method ]
// @export values
function values(obj){
	var res=[];
	if(isDefine(obj,"String"))
		return obj.split('');
	else
		fov(obj,function(val){ res.push(val); });
	return res;
}

	// create Memoize function [ method ]
function memoize(fn,context){
	var memo = [];
	return function(){
		var args = slice(arguments),df;
		for(var i=memo.length; i--;)
			if(eq(memo[i][0],args))
				return (df=memo[i][1]);
		return memo.push([args,df=fn.apply(context,args)]),df;
	};
}

// create Negate function [ method ]
function negate(fn,context){
	var mapper = isDefine(fn,"RegExp") ? cit(regCheck,fn) : fn;

	return isFn(mapper) ? function(){
		return !mapper.apply(context,arguments);
	} : cit(nseq,mapper).bind(context);
}

// create wrapper functions stack [ method ]
// args [ ...function ];
// var a = function(t){ return "<a>"+t+"<a>"}
// var b = function(t){ return "<b>"+t+"<b>"}
// var c = function(t){ return "<c>"+t+"<c>"}
// var w = wrap(a,b,c);
// w("tag") => "<c><b><a>tag<a><b><c>"
function wrap(){ 
	var arg = slice(arguments); 
	return function(x){ 
		return arg.reduce(function(val,fn){ 
			return fn(val);
		},x);
	}; 
}

function sort(ary,key){
	if(isObj(ary)&&!isArray(ary)&&typeof key === "string"){
		var target = getProp(ary,key);
		return target.sort.apply(target,slice(arguments,2)),ary;
	}

	if(isArray(ary))
		return ary.sort.apply(ary,slice(arguments,1));
	return ary;
}

function exist(check){
	var args = slice(arguments,1);
	if(check)
		last(args).apply(null,args);
}

function frozen(){
	return al(castArray.apply(null,arguments),Object.freeze).pop();
}

// create frequency function
function hz(fn,time,context){
	var fq;
	return function(){
		if(!fq) setTimeout((fn.apply((fq = 1,context),arguments),
				function(){ fq = 0; }),time);
	};
}

// _ chain stack [ method ]
// @use wrap
// @use chain
// @export [ _ ]
function _(){
	return new chain(arguments);
}

function chain(args){
	define(this,{
		"-" : {
			value : 0 in args ? args : void 0,
			writable : true,
			enumerable : false,
			configurable : false
		},
		"=" : {
			value : [],
			writable : false,
			enumerable : false,
			configurable : false
		}
	});
}

// building the Run method
// @emit *run
chain.prototype.value = function(){
	return wrap.apply(null,this["="].splice(0,size(this['='])))
						 .apply(null,this['-']===void 0 ? arguments : this['-']);
};

function fill(len,value) {
	var res = [];
	for(var i=0; i<len; i++)
		res[i] = value;
	return res;
}

function combined(nameArr,valueArr){
	var res = {};

	if(isArray(nameArr) && isArray(valueArr))
		al(nameArr,function(name,index){ 
			res[name] = valueArr[index]; });

	return res;
}

// atob && btoa
// base IE9 not support this method;
// ASCII to Base64 encoding and decoding
// UTF8 to Base64 encoding and decoding
// @ use atob(a2b)
// @ use btoa(b2a)
// @ use utob(u2b)
// @ use btou(b2u)
// @ export assembly
var crs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

var btoa = root.btoa || function(input){
	var str = toString(input) , output = "";

	for(
		var block,charCode,idx=0, map = crs;
		// if the next str index does not exist:
		// change the mapping table to "="
		// check if d has no fractional digits
		str.charAt(idx|0) || (map = '=', idx%1);
		// "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
		output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	){
		charCode = str.charCodeAt(idx += 3/4);
		if (charCode > 0xFF)
			throw new Error(
				"'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
			);
		block = block << 8 | charCode;
	}

	return output;
};

var atob = root.atob || function(input){
	var str = toString(input).replace(/[=]+$/,'') , output = "";

	if (str.length % 4 === 1)
		throw new Error(
			"'atob' failed: The string to be decoded is not correctly encoded."
		);

	for (
		var bc = 0, bs, buffer, idx = 0, map = crs;
		(buffer = str.charAt(idx++));
		// character found in table? initialize bit storage and add its ascii value;
		~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
			// and if not first of each 4 characters,
			// convert the first 8 bits to one ascii character
			bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
	) {
		// try to find character in table (0-63, not found => -1)
		buffer = map.indexOf(buffer);
	}
	return output;
};

function utob(input){
	return btoa(unescape(encodeURIComponent(toString(input))));
}

function btou(input){
	return decodeURIComponent(escape(atob(toString(input).replace(/\s/g,''))));
}

var $type = {
	obj: isObj,
	object: isObj,
	arr: isArray,
	array: isArray,
	arraylike: isArrayLike,
	str: isStr,
	string: isStr,
	bool: isBool,
	boolean: isBool,
	num: isNum,
	number: isNum,
	fn: isFn,
	function:isFn,
	nan: isNaN,
	prim: isPrimitive,
	primitive: isPrimitive,
	idt: isIdentifier,
	identifier: isIdentifier,
	def: isDefine,
	define: isDefine,
	int: isInt,
	float: isFloat,
	double: isFloat,
	date: isDate,
	ept: isEmpty,
	empty: isEmpty,
	dom: isDOM,
	elm: isElement,
	element: isElement,
	node: isNode,
	text: isNode,
	native: isNative,
	require: isRequired,
	required: isRequired,
	type: typec,
	default: typec
};

var $convert = {
	str: toString,
	string: toString,
	num: toNumber,
	number: toNumber,
	arr: toArray,
	array: toArray,
	hex: toHEX,
	rgb: toRGB,
	minus: toMinus,
	default: toString
};

var $op = {
	arr: al,
	array: al,
	obj: ol,
	object: ol,
	each: fov,
	default: fov
};

var $has = {
	key: hasKey,
	index: hasKey,
	exist: has,
	default: has
};

var $index = {
	first: firstindex,
	last: lastindex,
	single: one,
	one: one,
	index: index,
	default: index
};

var $map = {
	key: mapKey,
	hook: hook,
	map: mapValue,
	default: mapValue
};

var $unique = {
	fast: fastUnique,
	slim: slimUnique,
	default: slimUnique
};

var $pair = {
	un: unpairs,
	unpair: unpairs,
	pair: pairs,
	default: pairs
};

var $pull = {
	at: pullAt,
	with: pullWith,
	all: pullAll,
	default: pullAll
};

var $drop = {
	left: dropLeft,
	right: dropRight,
	lefto: dropTo,
	leftto: dropTo,
	righto: dropTo.bind(true),
	rightto: dropTo.bind(true),
	default: dropLeft
};

var $random = {
	int: randomInt,
	float: randomFloat,
	double: randomFloat,
	str: randomString,
	word: randomString,
	string: randomString,
	bool: randomBool,
	boolean: randomBool,
	char: randomCharacter,
	letter: randomCharacter,
	character: randomCharacter,
	date: randomDate,
	hex: randomHex,
	dice: randomDice,
	default: Math.random
};

var $param = {
	parse: paramParse,
	str: paramStringify,
	stringify: paramStringify,
	serialize: paramStringify,
	query: requery,
	requery: requery,
	default: paramParse
};

var $html = {
	encode: encodeHTML,
	decode: decodeHTML,
	strip: stripHTML,
	zip: zipHTML,
	default: wrap(stripHTML,zipHTML)
};

var $string = {
	trim : trim,
	trimleft: trimLeft,
	trimright: trimRight,
	came: camelize,
	camelize: camelize,
	capit: capitalize,
	capitalize: capitalize,
	collapse: collapse,
	rize: rize,
	rizewith: rize,
	default: toString
};

var $ajax = {
	get: ajaxGET,
	fetch: ajaxGET,
	put: ajaxPOST,
	post: ajaxPOST,
	jsonp: JSONP,
	cors: JSONP,
	ajax: aix,
	default: aix
};

var $event = {
	on: addEvent,
	add: addEvent,
	bind: addEvent,
	
	off: removeEvent,
	remove: removeEvent,
	unbind: removeEvent,

	has: hasEvent,
	exist: hasEvent,

	copy: copyEvent,
	extend: copyEvent,

	emit: emit,
	trigger: emit,
	dispatch: emit,

	default: emit
};

var $prop = {
	get: getProp,
	set: setProp,
	rm: rmProp,
	not: rmProp,
	remove: rmProp,
	default: getProp
}

var $assembly = {
	a2b: atob,
	atob: atob,
	btoa: btoa,
	b2a: btoa,
	utob: utob,
	u2b: utob,
	btou: btou,
	b2u: btou,
	default: atob
};

var $doom = {
	default: DOOM.bind(doomSetting)
};

// signet API
var nublist = {
	chain     : _,
	define    : define,
	extend    : extend,
	depextend : depextend,
	keys      : keys,
	noop      : noop,
	clone     : clone,
	depclone  : depclone,
	not       : not,
	cat       : cat,
	slice     : slice,
	find      : filter,
	filter    : filter,
	reject    : reject,
	every     : every,
	some      : some,
	diff      : diff,
	intsec    : intersection,
	chunk     : chunk,
	compact   : compact,
	pluck     : pluck,
	groupBy   : groupBy,
	countBy   : countBy,
	concat    : concat,
	cast      : castArray,
	shuffle   : shuffle,
	first     : first,
	last      : last,
	flat      : flatten,
	merge     : merge,
	auto      : auto,
	part      : part,
	once      : once,
	eq        : eq,
	cookie    : cookie,
	values    : values,
	memoize   : memoize,
	negate    : negate,
	link      : wrap,
	size      : size,
	now       : now,
	sort      : sort,
	exist     : exist,
	lock      : frozen,
	cool      : cool,
	hz        : hz,
	fill      : fill,
	combined  : combined,
	v8        : v8
};

// generator API
var zublist = {
	op       : $op,
	each     : $op,
	map      : $map,
	has      : $has,
	type     : $type,
	html     : $html,
	unique   : $unique,
	convert  : $convert,
	pull     : $pull,
	param    : $param,
	ajax     : $ajax,
	event    : $event,
	prop     : $prop,
	drop     : $drop,
	pairs    : $pair,
	index    : $index,
	random   : $random,
	string   : $string,
	// error    : $error,
	assembly : $assembly,
	doom     : $doom,
	vst      : $doom
};

// Generators
// @define base symbol
ol(nublist,function(fn,key){
	chain.prototype[key] = function(){ 
		return this['='].push(fn),this; };
	nub(fn,key);
}); 

ol(zublist,function(fn,key){
	chain.prototype[key] = function(use){
		return this['='].push(
			fn[trim(toString(use).toLowerCase())]),this; };
	zub(frozen(fn),key);
});

struct.root = root;
struct.broken = broken;
struct.toString = toString;
struct.prototype = struct.__proto__ = null;

return frozen(v8(struct));
}, void 0));
