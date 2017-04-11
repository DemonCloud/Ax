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
 *  Safari 7+
 *
 * Server Version With
 *  Node 6.0+ (Full support with ES6)
 *
 * @Author  : YiJun
 * @Date    : 2017.2.28 - now
 */

(function(root,struct,factory){

	if(typeof define === 'function' && define.amd)
		// Ruler by UMD Javascript
		// support AMD define
		define('struct',[],function(){ return factory(struct); });
	else if(typeof exports === "object" && typeof module !== "undefined")
		// support CommonJS exports
		module.exports = factory(struct);
	else
		// build on browser global object
		root.struct = factory(struct);

}(this, struct=function(){return this;}, function(struct){
'use strict';

// Strict mode
// define const
struct.VERSION = 1.0;

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
function nub(fn,name){ struct[name] = function(){ return fn; };}
function zub(fn,name){ struct[name] = function(){ return fn.apply(this,arguments); };}

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
	return isObject(prop) ?
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

// Object [ type ]
function isObject(e){
	return typeof e === "function" || typeof e === "object" && !!e;
}

// Function [ type ]
function isFn(e){
	return typeof e === "function" && e === e && !!e;
}

// Number [ type ]
function isNumber(e){
	return typeof e === "number" && +e===e;
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
	return obj !==null && (typeof obj.length === "number" && isObject(obj)) &&(
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

function isElement(e){
	return isObject(e) && e.nodeType > 0 && e instanceof Node;
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
	if(isObject(n)||isDefine(n,"String"))
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
		fn.call(ts===void 0 ? ary : ts ,ary[i],i,ary);
	return ary;
}

function ol(obj,fn,ts){
	al(keys(obj),function(v){ 
		fn.call(this,obj[v],v,obj);
	},ts===void 0 ? obj : ts);
	return obj;
}

function fov(list,fn,ts){
	if(isArray(list))
		return al.call(null,list,fn,ts);
	else if(isObject(list) && !isFn(list) && list !== null)
		return ol.call(null,list,fn,ts);
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

// Deeping Clone [ fast , complicated ]
function depclone(l){
	if(isArrayLike(l)){
		// clone array 
		return slice(l).map(citd(depclone,negate(isPrimitive)));
	}else if(!isPrimitive(l) && !(l instanceof Node)){
		var res = {};
		// clone object ^ with copy prototype
		if(l.constructor.prototype !== Object.prototype){
			var _ = function(){};
			_.prototype = l.constructor.prototype;
			res = new _();
		}
		ol(l, function(val,key){
			this[key] = isPrimitive(val) ? val : depclone(val);
		},res);
		return res;
	}
	return l;
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
	}else if(isObject(list)){
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
function pluck(list,mapkey){
	var res = [];
	fov(list,function(item){
		var key = keys(item);
		for( var i=key.length; i--; )
			if(key[i]===toString(mapkey))
				this.push(item[key[i]]);
	},res);
	return res;
}

// groupBy [ method ]
function groupBy(list,by){
	if(isArray(list)){
		var group = {},
				func  = isFn(by);
		fov(list,function(val){
			var key = func ? by(val) : val[by];
			if(!this[key])
				// first time should init group check
				this[key] = [val];
			else
				this[key].push(val);
		},group);
		return group;
	}
	return list;
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
	return ary.filter(negate(cit(has,ft)));
}

function pullAt(ary){
	var ft = flatten(slice(arguments,1),true);
	return ary.filter(function(val,index){
		return !has(ft,index);
	});
}

function pullWith(ary,it){
	return not(ary,it);
}

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
	return ary.filter(cool);
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
	var res =[], 
			pact = concat.apply([],arguments), 
			ite = isFn(last(pact)) ? pact.pop() : false;

	for(var i=0,l=pact.sort().length;i<l;){
		var p = pact[i] ,list = index(pact, ite ? cit(ite,p) : p),
				n = isArray(list) ? list.length : 1;
		if(n===1)
			res.push(pact[i]) && i++;
		else
			i+=n;
	}
	
	return res;
}

// intersection([1,2],[2,3],[2,3,4]) => [2]
function intersection(){
	var args = slice(arguments),
			ite = isFn(last(args)) ? args.pop() : false,
			pact = slimUnique(concat.apply([],args),true),
			res = [];

	al(pact,function(key){
		var all = true;
		for(var i=args.length; i--;){
			if(index(
				isArray(args[i])?args[i]:[args[i]],
				ite ? cit(ite,key) : key)===null
			){
				all = false; break;
			}
		}
		if(all) res.push(key);
	});
	
	return res;
}

// Merge array [ method ]
// *use eq or not [ ...ary(values),useeq? ]
// @export merge
// merge([1,2,3],[2,1,3],[3,4],[1,5]) => [1,2,3,4,5]
function merge(){
	var args = slice(arguments),
			useq = isDefine(last(args),"Boolean") ? args.pop():false;
	return slimUnique(concat.apply([],args),useq);
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
	if(!isNumber(max)){
		max = min; min = 0;
	}
	return min + Math.floor(Math.random()*(max-min+1));
}

// Random static Float [ method ]
function randomFloat(min,max,fix){
	if(!isNumber(max)){
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

// use setTimeout
function asy(fn,time){
	return setTimeout(fn,time||0);
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

	while(match = qrsReg.exec(param))
		x[rSpace(match[1])] = rSpace(match[2]);

	return x;
}

function paramStringify(param){
	var Cparam = clone(param);

	for(var key in Cparam)
		Cparam[key] = rInsignia(
			isObject(Cparam[key]) ?
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
		stripReg     = /<script\b[^>]*>(.*?)<\/script>/gim,
		commentReg   = /<!--[\s\S]*?-->/gim,
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

// const DOOM4 settings
// rule for parse Template
var doomSetting  = {
	escape      : "{{-([\\s\\S]+?)}}",
	interpolate : "{{#([\\s\\S]+?)}}",
	evaluate    : "{{([\\s\\S]+?)}}"
};

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
					str.replace(encodeReg,c_ecode);
}

function decodeHTML(str){
	return +str===str ? 
					str : 
					str.replace(decodeReg,c_dcode);
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
function DOOM(txt,name){
	var position = 0,
			render,
			res = "_p+='",
			args = slice(arguments,2),

			exp = new RegExp((this.escape||no) +
						"|" + (this.interpolate||no) + 
						"|" + (this.evaluate||no) +"|$","g");

	// start replace
	txt.replace(exp, function(match,escape,interpolate,evaluate,offset){
		res += txt.slice(position,offset).replace(escaper,c_escape);
		// refresh index where to find text string
		position = offset + match.length;

		if(escape)
			// if command is - should encodeHTML string
			res += "'+((_t=(" + escape + "))==null?'':_(_t))+'";
		else if(interpolate)
			res += "'+((_t=(" + interpolate + "))==null?'':_t)+'";
		else if(evaluate)
			res += "';\n" + evaluate + "\n_p+='";

		return match;
	});

	// End wrap res@ String
	res += "';";
	if(!name) res = "with(_x||{}){\n" + res + "\n}";
	res = "var _t,_= struct.html('encode'),_p='';\n" + res + "\nreturn _p;";

	// Complete building Function string
	// try to build anmousyous function
	try{
		render = ev(
			"(function("+(name||"_x")+
			",struct"+
			(args.length ? ","+args.toString() : "")+"){"+ 
			res + 
			"})"
		);
	}catch(e){
		e.res = res;
		throw e;
	}

  // @ Precomplete JavaScript Template Function
  // @ the you build once template that use diff Data, not use diff to build function again
	// @ protect your template code other can observe it?
	return function(data){
		return eq(arguments,render.pre) ? (render.complete) : 
			(render.pre=arguments, render.complete = render.apply(this,
				[data,struct].concat(slice(arguments,1))
			));
	};
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
	"application/json" : 1
};

// deal with Data type
function dataMIME(enable,header,param){
	if(enable)
		if(isObject(header))
			switch(MIME[header["Content-Type"]]){
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
		if(!ls.getItem("_struct"))
			ls.setItem("_struct","{}");

		var cache = JSON.parse(ls.getItem("_struct"));
		var data = cache[config.url || root.location.href.split("#").shift()];

		if(data!==void 0) 
			return config.sucess.call(root,data);
	}
	
	var xhr = new XMLHttpRequest();
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
	if(config.type.toUpperCase() === "POST" &&
		 config.param &&
		 !config.header["Content-Type"] &&
		 config.contentType)
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;chartset="+config.charset);

	if(isObject(config.header) && config.header !== broken){
		var contentType = config.header["Content-Type"];

		if(contentType)
			if(!~contentType.search('charset') && !~contentType.search('json'))
				config.header["Content-Type"] += ";charset=" + config.charset;

		ol(config.header,function(val,key){
			xhr.setRequestHeader(key,val);
		});
	}

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
					var cache = JSON.parse(ls.getItem("_struct"));
					cache[config.url||root.location.href.split("#")[0]] = xhr.responseText;
					ls.setItem("_struct",JSON.stringify(cache));
				}
			} else {
				config.error.call(root,xhr,event);
			}
		}
	};

	// setTimeout data of ajax
	if(toNumber(config.timeout)){
		xhr.timeout = toNumber(config.timeout);
		xhr.ontimeout = function(event){
			if(xhr.readyState !== 4 || !xhr.responseText)
				config.error.call(root,xhr);xhr.abort();
		};
	}

	// send request
	xhr.send(config.param ? 
			(isObject(config.param) ? 
			dataMIME(config.contentType,config.header,config.param) :
			config.param ) : null);

	return xhr;
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

	// if timeout will trigger failcall
	if(toNumber(config.timeout)){
		config.timesetup = asy(function(){
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
function addEvent(obj,type,fn){
	if(!obj._events)
		define(obj,"_events",{
			value : {},
			writable : false,
			enumerable: false,
			configurable: true
		});
	if(!obj._events[type])
		obj._events[type] = [];
	if(!has(obj._events[type],fn))
		obj._events[type].push(fn);
	return obj;
}

function removeEvent(obj,type,fn){
	if(obj._events){
		if(obj._events[type]){
			if(!((not(obj._events[type],fn)).length) || !fn)
				delete obj._events[type];
		}else if(!type && !fn){
			delete obj._events;
		}
	}
	return obj;
}

function hasEvent(obj,type,fn){
	var res = false;
	if(obj._events){
		if(isFn(fn) && obj._events[type])
			res = has(obj._events[type],fn);
		else
			res = size(obj._events[type]);
	}
	return !!res;
}

function fireEvent(obj,type,fn,args){
	var hasFn = isFn(fn);

	if(isArray(fn) && !args){
		args = fn;
		fn = null;
	}

	if(obj._events&&type!=="")
		ol(obj._events[type],function(f){
			if(f===fn||!hasFn) f.apply(obj,args||[]);
		});
}

function emit(obj,type,fn,args){
	return al(
		toString(type).split(","),
		function(t){ fireEvent(this,trim(t),fn,args) },
		obj
	),obj;
}

// Struct Prop listener
// @use getProp
// @exprot prop

// define deeping getProp method
function getProp(obj,prop,dowith){
	var tmp,i,keygen = (prop||"").split(".");

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

// #not need api
// function watch(obj,prop,handle){
// }

// function unwatch(obj,prop){
// }

// countBy [ method ]
// countBy(['abc','de','fg'],'length') => {2: 2, 3: 1}
// countBy([3.1, 1.4, 1.2, 2.2],Math.floor) => {1: 2, 2: 1, 3: 1}
function countBy(ary,by){
	var res = {};
	var fn = isFn(by);
	fov(ary,function(val,key){
		var getkey = (fn ? by(val) : val[by]);
		if(!res[getkey])
			res[getkey] = 1;
		else
			res[getkey] += 1;
	});
	return res;
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
					 n.length : (isObject(n) ? keys(n).length : 0);
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
		var args = slice(arguments), df;
		for(var i=memo.length; i--; ){
			if(eq(memo[i][0],args)){
				df = memo[i][1]; break;
			}
		}
		if(df===void 0)
			memo.push([args,df=fn.apply(context,args)]);
		return df;
	};
}

// create Negate function [ method ]
function negate(fn,context){
	var mapper = isDefine(fn,"RegExp") ? cit(regCheck,fn) : fn;
	
	if(isFn(mapper)){
		return function(){
			return !mapper.apply(context,arguments);
		};
	}

	return cit(nseq,mapper).bind(context);
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
	if(isObject(ary)&&!isArray(ary)&&typeof key === "string"){
		var target = getProp(ary,key);
		return target.sort.apply(target,slice(arguments,2)),ary;
	}

	if(isArray(ary))
		return ary.sort.apply(ary,slice(arguments,1));
	return ary;
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

var xhooklist = {},
		xxhr = root.XMLHttpRequest,
		xdef = {
			readyState:0,
			response:{},
			responseText:null,
			responseType:null,
			responseURL:null,
			timeout:0,
			status:0
		};

function xhookmatch(url){
	return xhooklist[url];
}

function XHookRequest(){
	this._xhr = new xxhr();

	extend(this,xdef);
}

XHookRequest.prototype = {
	abort:function(){
		return this._xhr.abort();
	},
	open:function(type,url){
		var res;
		if(res = xhookmatch(url)){
			return extend(this,{
				responseURL : url,
				responseType : "appliction/json",
				responseText : res,
				readyState : 4,
				status : 304
			});
		}
		return this._xhr.open.apply(this._xhr,arguments);
	},
	send:function(param){
		if(this.responseText&&this.readyState)
			return this.onreadystatechange(broken),extend(this,xdef);
		return this._xhr.send.apply(this._xhr,arguments);
	},
	start:function(){
		root.XMLHttpRequest = XHookRequest;
	},
	detect:function(url,response){
		xhooklist[url] = toString(response);
	},
	remove:function(url){
		return delete xhooklist[url];
	},
	stop:function(){
		root.XMLHttpRequest = xxhr;
	},
	addEventListener:noop,
	setRequestHeader:noop
};

var xhr = new XHookRequest();

// Type export
function $type(c){
	switch((c||"").toLowerCase()){
		case "object":
			return isObject;
		case "array":
			return isArray;
		case "arraylike":
			return isArrayLike;
		case "function":
		case "fn":
			return isFn;
		case "nan":
			return isNaN;
		case "prim":
		case "primitive":
			return isPrimitive;
		case "idt":
		case "identifier":
			return isIdentifier;
		case "define":
			return isDefine;
		case "int":
			return isInt;
		case "float":
		case "double":
			return isFloat;
		case "date":
			return isDate;
		case "empty":
			return isEmpty;
		case "dom":
		case "elm":
		case "element":
			return isElement;
		case "native":
			return isNative;
		default:
			return typec;
	}
}

function $convert(c){
	switch((c||"").toLowerCase()){
		case "str":
		case "string":
			return toString;
		case "num":
		case "number":
			return toNumber;
		case "arr":
		case "array":
			return toArray;
		case "hex":
			return toHEX;
		case "rgb":
			return toRGB;
		case "minus":
			return toMinus;
		default:
			return toString;
	}
}

// Loop function
function $op(c){
	switch((c||"").toLowerCase()){
		case "array":
			return al;
		case "object":
			return ol;
		default :
			return fov;
	}
}

function $has(c){
	return c==="key" ? hasKey : has;
}

function $index(c){
	switch ((c||"").toLowerCase()) {
		case 'first':
			return firstindex;
		case 'last':
			return lastindex;
		case 'single':
		case 'one':
			return one;
		default:
			return index;
	}
}

function $map(c){
	return c === "key" ? mapKey : mapValue;
}

function $unique(c){
	return c==="fast" ? fastUnique : slimUnique;
}

function $pair(c){
	switch(c){
		case 'un':
		case 're':
			return unpairs;
		default:
			return pairs;
	}
}

function $pull(c){
	switch((c||"").toLowerCase()){
		case "at":
			return pullAt;
		case "with":
			return pullWith;
		default:
			return pullAll;
	}
}

function $drop(c){
	switch((c||"").toLowerCase()){
		case "left":
			return dropLeft;
		case "right":
			return dropRight;
		case "lefto":
		case "leftto":
			return dropTo;
		case "righto":
		case "rightto":
			return dropTo.bind(true);
		default:
			return dropLeft;
	}
}

// TODO 
// @ add error contruction
function $error(){

}

function $random(c){
	switch((c||"").toLowerCase()){
		case "int" :
			return randomInt;
		case "float":
		case "double":
			return randomFloat;
		case "string":
			return randomString;
		case "bool":
		case "boolean":
			return randomBool;
		case "char":
		case "character":
		case "letter":
			return randomCharacter;
		case "date":
			return randomDate;
		case "hex":
			return randomHex;
		case "dice":
			return randomDice;
		default:
			return Math.random;
	}
}

function $param(c){
	switch((c||"").toLowerCase()){
		case "parse":
			return paramParse;
		case "string":
		case "stringify":
		case "serialize":
			return paramStringify;
		case "query":
		case "requery":
			return requery;
		default:
			return paramParse;
	}
}

function $html(c){
	switch((c||"").toLowerCase()){
		case "encode":
			return encodeHTML;
		case "decode":
			return decodeHTML;
		case "strip":
			return stripHTML;
		case "zip":
			return zipHTML;
		default:
			return wrap(stripHTML,zipHTML);
	}
}

function $string(c){
	switch((c||'').toLowerCase()){
		case "trim":
			return trim;
		case "trimleft":
			return trimLeft;
		case "trimright":
			return trimRight;
		case "came":
		case "camelize":
			return camelize;
		case "capit":
		case "capitalize":
			return capitalize;
		case "collapse":
			return collapse;
		case "rize":
		case "rizewith":
			return rize;
		default:
			return toString;
	}
}

function $ajax(c){
	switch((c||"").toLowerCase()){
		case "get":
			return ajaxGET;
		case "post":
			return ajaxPOST;
		case "jsonp":
			return JSONP;
		default:
			return aix;
	}
}

function $event(c){
	switch((c||"").toLowerCase()){
		case "add":
		case "on":
		case "bind":
			return addEvent;
		case "remove":
		case "unbind":
			return removeEvent;
		case "has":
		case "exist":
			return hasEvent;
		case "dispatch":
		case "trigger":
		case "emit":
			return emit;
		default:
			return emit;
	}
}

function $prop(c){
	switch((c||"").toLowerCase()){
		case "get":
			return getProp;
		case "set":
			return setProp;
		case "not":
		case "remove":
			return rmProp;
		default:
			return getProp;
	}
}

// bound DOOM settings
function $doom(config){
	return DOOM.bind((isDefine(config,"Object"))?
		depextend(doomSetting,config):
		doomSetting
	);
}

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
	hook      : hook,
	chunk     : chunk,
	compact   : compact,
	pluck     : pluck,
	groupBy   : groupBy,
	countBy   : countBy,
	concat    : concat,
	castArray : castArray,
	shuffle   : shuffle,
	first     : first,
	last      : last,
	flat      : flatten,
	merge     : merge,
	auto      : auto,
	part      : part,
	once      : once,
	eq        : eq,
	asy       : asy,
	cookie    : cookie,
	values    : values,
	memoize   : memoize,
	negate    : negate,
	link      : wrap,
	size      : size,
	now       : now,
	sort      : sort,
	v8        : v8
};

// generator API
var zublist = {
	op      : $op,
	each    : $op,
	map     : $map,
	has     : $has,
	type    : $type,
	html    : $html,
	unique  : $unique,
	convert : $convert,
	pull    : $pull,
	param   : $param,
	ajax    : $ajax,
	event   : $event,
	prop    : $prop,
	drop    : $drop,
	pairs   : $pair,
	index   : $index,
	random  : $random,
	string  : $string,
	error   : $error,
	doom    : $doom
};

// Generators
// @define base symbol
ol(nublist,function(fn,key){
	chain.prototype[key] = function(){
		return this['='].push(fn),this;
	};
	nub.apply(null,arguments);
}); 

ol(zublist,function(fn,key){
	chain.prototype[key] = function(){
		return this['='].push(fn.apply(null,arguments)),this;
	};
	zub.apply(null,arguments);
});

struct.xhr = xhr;
struct.root = root;
struct.toString = toString;
struct.broken = broken;
struct.prototype = struct.__proto__ = null;

return Object.freeze(v8(struct));
}));

/* 
 * Aix
 *
 * @Author  : YiJun
 * @Date    : 2017.4.1 - now
 *
 * require Utils Lib [ struct ]
 */

(function(root,aix,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define('aix',['struct'],function(struct){ return factory(aix,struct); });
	else if(typeof exports === "object" && typeof module !== "undefined")
		// support CommonJS exports
		module.exports = factory(aix,struct);
	else
		// build on browser global object
		root.aix = factory(aix,struct);

})(this, {}, function(aix,struct){
	"use strict";

	// Define DOM frame
	var z,Z,aM,aV,aR,
	// Define Setting
		VIEW_DEFAULT  = { },
		MODEL_DEFAULT = { data:{}, validate:{} },
		ROUTE_DEFAULT = { char:"@", routes:{}, actions:{} },

	// resetful list 
	// use for aix ajax-api
	RESTFUL = {
		get    : "GET",
		put    : "POST",
		save   : "POST",
		post   : "POST",
		pull   : "POST",
		fetch  : "GET",
		update : "POST",
		delete : "POST"
	},

	// *use struct utils list
		root      = struct.root,
		v8        = struct.v8(),
		_keys     = struct.keys(),
		_noop     = struct.noop(),
		_define   = struct.define(),
		_slice    = struct.slice(),
		_clone    = struct.clone(),
		_dpclone  = struct.depclone(),
		_extend   = struct.extend(),
		_eq       = struct.eq(),
		_toString = struct.convert('string'),
		_type     = struct.type(),
		_isObj    = struct.type('object'),
		_isFn     = struct.type('function'),
		_isInt    = struct.type('int'),
		_isAry    = struct.type('array'),
		_isAryL   = struct.type('arraylike'),
		_isPrim   = struct.type('primitive'),
		_loop     = struct.op(),
		_fol      = struct.op('object'),
		_fal      = struct.op('array'),
		_ey       = struct.every(),
		_on       = struct.event('on'),
		_unbind   = struct.event('unbind'),
		_emit     = struct.event('emit'),
		_prop     = struct.prop('get'),
		_setProp  = struct.prop('set'),
		_rmProp   = struct.prop('not'),
		_param    = struct.param(),
		_trim     = struct.string('trim'),
		_one      = struct.index('one'),
		_has      = struct.has(),
		_find     = struct.find(),
		_ajax     = struct.ajax(),
		_size     = struct.size(),
		_first    = struct.first(),
		_doom     = struct.doom();

	// frozen api
	function frozen(){
		_fal(_slice(arguments),Object.freeze);
	}

	// aix genertor function
	function genertor_(api){
		aM.prototype[api] = function(){
			var tmp = this.data,
					args = [tmp].concat(_slice(arguments));
			if(!_eq(tmp = struct[api]().apply(tmp,args),this.data))
				this.emit((this.data = tmp,api),args);
			return this;
		};
	}

	// not change rebase data
	function genertor_$(api){
		aM.prototype[api] = function(){
			var args = [this.data].concat(_slice(arguments));
			return struct[api]().apply(this,args);
		};
	}

	function hackaix(origin,extend){
		var fnstr = _toString(origin),
			oargs = _toString(origin),
			eargs = _toString(extend),

		body = fnstr.slice(
					 fnstr.indexOf("{")+1, 
					 fnstr.lastIndexOf("}"));

		oargs = oargs.slice(oargs.indexOf('(')+1, oargs.indexOf(')'))
								 .match(/([^\s,]+)/g)[0];
		eargs = eargs.slice(eargs.indexOf('(')+1, eargs.indexOf(')'))
								 .match(/([^\s,]+)/g)[0];
  	
  	return [_toString(oargs),_toString(eargs),body];
	}

	function createExtend(origin){
		return function(def){
			var x = hackaix(aix[origin],aix[origin].extend);
			var extend = eval("(function(ops){ "+
				"var "+x[0]+"=_extend(_extend({},"+x[1]+"),ops||{}); "+x[2]+
				"})");

			_extend(extend.prototype,aix[origin].prototype);
			return extend;
		};
	}

	// get childNodes and filter by selector
	// cant use Global matcher
	var isId    = /^#[^\s\=\+\.\#\[\]]+/i,												// "#idname"
			isClass = /^\.[^\s\=\+\.\#\[\]]+$/i,											// ".className"
			isTag   = /^[^\[\]\+\-\.#\s\=]+$/i,												// "p" "div" "DIV"
			isAttr  = /([^\s]+)?\[([^\s]+)=["']?([^\s'"]+)["']?\]$/i,		// div[id="nami"]
			mreSl   = /^[^\s]+,[^\s]+/gi,
			cidSl   = /[\s|\r]+/im,
			pitSl   = /[>|\+|\~]+/im,
			isHTML  = /<[a-zA-Z][\s\S]*>/;

	// Performance JavaScript selector
	// Just Optimzer this function for sl pref
	// @ much more need its better
	Z = function(elm){
		this.el = _isAryL(elm) ? _slice(elm) : (elm instanceof Element ? [elm] : []);
	};

	z = function(x){
		return z.init.call(root,x);
	};

	var _zid = 1,
		handlers = {},
		focusinSupported = 'onfocusin' in window,
		focus = { focus: 'focusin', blur: 'focusout' },
		hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' };
	
	var ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
		eventMethods = {
			preventDefault: 'isDefaultPrevented',
			stopImmediatePropagation: 'isImmediatePropagationStopped',
			stopPropagation: 'isPropagationStopped'
		};

	function zid(element) {
		return element._zid || (element._zid = _zid++);
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event);
	
		if (event.ns) 
			var matcher = matcherFor(event.ns);
	
		return (handlers[zid(element)] || []).filter(function(handler) {
			return handler &&
				(!event.e  || handler.e == event.e) &&
				(!event.ns || matcher.test(handler.ns)) &&
				(!fn       || zid(handler.fn) === zid(fn)) &&
				(!selector || handler.sel == selector);
		});
	}

	function parse(event) {
		var parts = ('' + event).split('.');
		return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
	}

	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}

	function eventCapture(handler, captureSetting) {
		return handler.del &&
			(!focusinSupported && (handler.e in focus)) ||
			!!captureSetting;
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type;
	}

	function zaddEvent(element, events, fn, data, selector, delegator, capture){
		var id = zid(element), set = (handlers[id] || (handlers[id] = []));
	
		_loop(events.split(/\s/),function(event){
			if (event == 'ready') 
				return z(fn);
	
			var handler   = parse(event);
			handler.fn    = fn;
			handler.sel   = selector;
			// emulate mouseenter, mouseleave
			if (handler.e in hover) 
				fn = function(e){
					var related = e.relatedTarget;
					if (!related || (related !== this && ! this.contains(related)))
						return handler.fn.apply(this, arguments);
				};
	
			handler.del   = delegator;
			var callback  = delegator || fn;
			handler.proxy = function(e){
				e = compatible(e);
	
				if (e.isImmediatePropagationStopped()) 
					return false;
	
				e.data = data;
				var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
	
				if (result === false) 
					e.preventDefault(), e.stopPropagation();
	
				return result;
			};
	
			handler.i = set.length;
			set.push(handler);
	
			element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
		});
	}

	function zremoveEvent(element, events, fn, selector, capture){
		var id = zid(element);
		_loop((events || '').split(/\s/),function(event){
			_loop(findHandlers(element, event, fn, selector),function(handler){
				delete handlers[id][handler.i];

				element.removeEventListener(
					realEvent(handler.e),
					handler.proxy,
					eventCapture(handler, capture)
				);
			});
		});
	}

	function returnTrue(){
		return true;
	}

	function returnFalse(){
		return false;
	}

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
	
			source || (source = event);
	
			_loop(eventMethods, function(predicate, name) {
				var sourceMethod = source[name];
	
				event[name] = function(){
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};
	
				event[predicate] = returnFalse;
			});
	
			try {
				event.timeStamp || (event.timeStamp = Date.now());
			} catch (ignored) { }
	
			if (source.defaultPrevented !== undefined ? source.defaultPrevented :
				'returnValue' in source ? source.returnValue === false :
				source.getPreventDefault && source.getPreventDefault())
				event.isDefaultPrevented = returnTrue;
		}
		return event;
	}

	function createProxy(event) {
		var key, proxy = { originalEvent: event };
		for (key in event)
			if (!ignoreProperties.test(key) && event[key] !== undefined) 
				proxy[key] = event[key];
	
		return compatible(proxy, event);
	}

	var matchzx = Element.prototype.matches ||
								Element.prototype.webkitMatchesSelector ||
								Element.prototype.mozMatchesSelector ||
								Element.prototype.msMatchesSelector ||
								function(selector){
									return (this.parentNode != null && this !== document) &&
											 _has(this.parentNode.querySelectorAll(selector),this);
								};

	z.init = function(x){
		return new Z(x);
	};

	z.matchz = function(elm,selector){
		return !(elm===null||elm===document||typeof selector !== "string") && matchzx.call(elm, selector);
	};

	z.event = { 
		add: zaddEvent, 
		remove: zremoveEvent 
	};
	
	z.proxy = function(fn, context) {
		var args = (2 in arguments) && _slice(arguments, 2);
	
		if (_isFn(fn)) {
			var proxyFn = function(){ 
				return fn.apply(
					context, args ? 
					args.concat(_slice(arguments)) : arguments
				);
			};
	
			proxyFn._zid = zid(fn);
			return proxyFn;
	
		} else if (typeof context === "string") {
			if (args)
				return z.proxy.apply(null,(args.unshift(fn[context],fn),args));
			else
				return z.proxy(fn[context], fn);
		} else {
			throw new TypeError("expected function");
		}
	};

	// z Custom Events
	z.Event = function(type, props) {
		if (typeof type !== "string") 
			props = type, type = props.type;
	
		var event = document.createEvent(
			_has(capTypes['MouseEvent'],type) ? 'MouseEvent' : 'Events'), bubbles = true;
	
		if (props) 
			for (var name in props) 
				(name === 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
	
		event.initEvent(type, bubbles, true);
		return compatible(event);
	};

	function SubsetMapping(a, b) {
		this.oldValue = a;
		this.newValue = b;
	}

	/**
	 * This should really be a predefined function in Array...
	 */
	function makeArray(n, v) {
		return Array.apply(null, new Array(n)).map(function() {
			return v;
		});
	}

	var diffcount,
		diffconst = {
		addAttribute: 0,
		modifyAttribute: 1,
		removeAttribute: 2,
		modifyTextElement: 3,
		relocateGroup: 4,
		removeElement: 5,
		addElement: 6,
		removeTextElement: 7,
		addTextElement: 8,
		replaceElement: 9,
		modifyValue: 10,
		modifyChecked: 11,
		modifySelected: 12,
		modifyComment: 13,
		action: 'a',
		route: 'r',
		oldValue: 'o',
		newValue: 'n',
		element: 'e',
		'group': 'g',
		from: 'f',
		to: 't',
		name: 'na',
		value: 'v',
		'data': 'd',
		'attributes': 'at',
		'nodeName': 'nn',
		'childNodes': 'c',
		'checked': 'ch',
		'selected': 's'
	};

	var Diff = function(options) {
		_extend(this,options||{});
	};

	Diff.prototype = {
		toString: function() {
			return JSON.stringify(this);
		},
		setValue: function(aKey, aValue) {
			this[aKey] = aValue;
			return this;
		}
	};

	SubsetMapping.prototype = {
		contains: function contains(subset) {
			if (subset.length < this.length)
				return subset.newValue >= this.newValue && 
							 subset.newValue < this.newValue + this.length;
			return false;
		},
		toString: function toString() {
			return this.length + 
						" element subset, first mapping: old " + 
						this.oldValue + " → new " + this.newValue;
		}
	};

	var elementDescriptors = function(el) {
		var output = [];
		if(el.nodeName !== '#text' && el.nodeName !== '#comment'){
			output.push(el.nodeName);
			if (el.attributes) {
				if(el.attributes['class'])
					output.push(el.nodeName + '.' + el.attributes['class'].replace(/ /g, '.'));
				if(el.attributes.id)
					output.push(el.nodeName + '#' + el.attributes.id);
			}
		}
		return output;
	};

	var findUniqueDescriptors = function(li) {
		var uniqueDescriptors = {},
			duplicateDescriptors = {};

		_fal(li,function(node) {
			_fal(elementDescriptors(node),function(descriptor) {
				var inUnique = descriptor in uniqueDescriptors,
					inDupes = descriptor in duplicateDescriptors;
				if (!inUnique && !inDupes)
					uniqueDescriptors[descriptor] = true;
				else if (inUnique)
					duplicateDescriptors[descriptor] = (delete uniqueDescriptors[descriptor]);
			});
		});
		return uniqueDescriptors;
	};

	var uniqueInBoth = function(l1, l2) {
		var l1Unique = findUniqueDescriptors(l1),
			l2Unique = findUniqueDescriptors(l2),
			inBoth = {};

		_fal(_keys(l1Unique),function(key) {
			if(l2Unique[key])
				inBoth[key] = true;
		});

		return inBoth;
	};

	var removeDone = function(tree) {
		delete tree.outerDone;
		delete tree.innerDone;
		delete tree.valueDone;
		if (tree.childNodes)
			return _ey(tree.childNodes,removeDone);
		return true;
	};

	var isEqual = function(e1, e2) {
		if (!_ey(['nodeName', 'value', 'checked', 'selected', 'data'],function(element){
			return e1[element] === e2[element];
		}))
			return false;

		if (Boolean(e1.attributes) !== Boolean(e2.attributes) ||
				Boolean(e1.childNodes) !== Boolean(e2.childNodes))
			return false;

		if (e1.attributes) {
			var e1Attributes, e2Attributes;
			e1Attributes = _keys(e1.attributes);
			e2Attributes = _keys(e2.attributes);

			if (e1Attributes.length !== e2Attributes.length)
				return false;
			if (!_ey(e1Attributes,function(attribute){
				return e1.attributes[attribute] === e2.attributes[attribute];
			})) return false;
		}

		if (e1.childNodes) {
			if (e1.childNodes.length !== e2.childNodes.length)
				return false;
			if (!_ey(e1.childNodes,function(childNode, index){
				return isEqual(childNode, e2.childNodes[index]);
			})) return false;
		}

		return true;
	};

	var roughlyEqual = function(e1, e2, uniqueDescriptors, sameSiblings, preventRecursion) {
		var childUniqueDescriptors, nodeList1, nodeList2;

		if ((!e1 || !e2)||(e1.nodeName !== e2.nodeName))
			return false;

		if (e1.nodeName === '#text')
			// Note that we initially don't care what the text content of a node is,
			// the mere fact that it's the same tag and "has text" means it's roughly
			// equal, and then we can find out the true text difference later.
			return preventRecursion ? true : e1.data === e2.data;

		if (e1.nodeName in uniqueDescriptors)
			return true;

		if (e1.attributes && e2.attributes) {
			if (e1.attributes.id && e1.attributes.id === e2.attributes.id) {
				var idDescriptor = e1.nodeName + '#' + e1.attributes.id;
				if (idDescriptor in uniqueDescriptors)
					return true;
			}
			if (e1.attributes['class'] && e1.attributes['class'] === e2.attributes['class']) {
				var classDescriptor = e1.nodeName + '.' + e1.attributes['class'].replace(/ /g, '.');
				if (classDescriptor in uniqueDescriptors) 
					return true;
			}
		}

		if (sameSiblings)
			return true;

		nodeList1 = e1.childNodes ? e1.childNodes.slice().reverse() : [];
		nodeList2 = e2.childNodes ? e2.childNodes.slice().reverse() : [];

		if (nodeList1.length !== nodeList2.length)
			return false;

		if (preventRecursion) {
			return _ey(nodeList1,function(element, index) {
				return element.nodeName === nodeList2[index].nodeName;
			});
		} else {
			// note: we only allow one level of recursion at any depth. If 'preventRecursion'
			// was not set, we must explicitly force it to true for child iterations.
			childUniqueDescriptors = uniqueInBoth(nodeList1, nodeList2);
			return _ey(nodeList1,function(element, index) {
				return roughlyEqual(element, nodeList2[index], childUniqueDescriptors, true, true);
			});
		}
	};

	/**
	 * based on https://en.wikibooks.org/wiki/Algorithm_implementation/Strings/Longest_common_substring#JavaScript
	 */
	var findCommonSubsets = function(c1, c2, marked1, marked2) {
		var lcsSize = 0,
			index = [],
			matches = Array.apply(null, new Array(c1.length + 1)).map(function() {
				return [];
			}), // set up the matching table
			uniqueDescriptors = uniqueInBoth(c1, c2),
			// If all of the elements are the same tag, id and class, then we can
			// consider them roughly the same even if they have a different number of
			// children. This will reduce removing and re-adding similar elements.
			subsetsSame = c1.length === c2.length,
			origin, ret;

		if (subsetsSame) {
			c1.some(function(element, i) {
				var c1Desc = elementDescriptors(element),
					c2Desc = elementDescriptors(c2[i]);
				if (c1Desc.length !== c2Desc.length)
					return !(subsetsSame = false);
				c1Desc.some(function(description, i){
					if (description !== c2Desc[i])
						return !(subsetsSame = false);
				});
				return !subsetsSame;
			});
		}

		// fill the matches with distance values
		_fal(c1,function(c1Element, c1Index) {
			_fal(c2,function(c2Element, c2Index) {
				if (!marked1[c1Index] && !marked2[c2Index] && roughlyEqual(c1Element, c2Element, uniqueDescriptors, subsetsSame)) {
					matches[c1Index + 1][c2Index + 1] = (matches[c1Index][c2Index] ? matches[c1Index][c2Index] + 1 : 1);
					if (matches[c1Index + 1][c2Index + 1] >= lcsSize) {
						lcsSize = matches[c1Index + 1][c2Index + 1];
						index = [c1Index + 1, c2Index + 1];
					}
				} else {
					matches[c1Index + 1][c2Index + 1] = 0;
				}
			});
		});
		if (lcsSize === 0)
			return false;
		origin = [index[0] - lcsSize, index[1] - lcsSize];
		ret = new SubsetMapping(origin[0], origin[1]);
		ret.length = lcsSize;

		return ret;
	};

	var getGapInformation = function(t1, t2, stable) {

		var gaps1 = t1.childNodes ? makeArray(t1.childNodes.length, true) : [],
			gaps2 = t2.childNodes ? makeArray(t2.childNodes.length, true) : [],
			group = 0;

		// give elements from the same subset the same group number
		_fal(stable,function(subset) {
			var i, endOld = subset.oldValue + subset.length,
				endNew = subset.newValue + subset.length;
			for (i=subset.oldValue; i < endOld; i++)
				gaps1[i] = group;
			for (i=subset.newValue; i < endNew; i++)
				gaps2[i] = group;
			group++;
		});

		return {
			gaps1: gaps1,
			gaps2: gaps2
		};
	};

	/**
	 * Find all matching subsets, based on immediate child differences only.
	 */
	var markSubTrees = function(oldTree, newTree) {
		// note: the child lists are views, and so update as we update old/newTree
		var oldChildren = oldTree.childNodes ? oldTree.childNodes : [],
			newChildren = newTree.childNodes ? newTree.childNodes : [],
			marked1 = makeArray(oldChildren.length, false),
			marked2 = makeArray(newChildren.length, false),
			subsets = [],
			subset = true,
			returnIndex = function(x,index) { return index; },
			markBoth = function(i) {
				marked1[subset.oldValue + i] = true;
				marked2[subset.newValue + i] = true;
			};

		while (subset) {
			subset = findCommonSubsets(oldChildren, newChildren, marked1, marked2);
			if (subset)
				_fal((subsets.push(subset),
					Array.apply(null, new Array(subset.length)).map(returnIndex)),
					markBoth);
		}
		return subsets;
	};

	var DiffTracker = function() {
		this.list = [];
	};

	DiffTracker.prototype = {
		list: false,
		add: function(diffs) {
			return _fal(diffs,function(diff) {
				this.push(diff);
			},this.list);
		},
		forEach: function(fn) {
			_fal(this.list,fn);
		}
	};

	// dom diff options
	var diffDOM = function(options) {
		var defaults = {
			debug: false,
			diffcap: 10, // Limit for how many diffs are accepting when debugging. Inactive when debug is false.
			maxDepth: false, // False or a numeral. If set to a numeral, limits the level of depth that the the diff mechanism looks for differences. If false, goes through the entire tree.
			valueDiffing: true, // Whether to take into consideration the values of forms that differ from auto assigned values (when a user fills out a form).
			// syntax: textDiff: function (node, currentValue, expectedValue, newValue)
			textDiff: function() {
				arguments[0].data = arguments[3];
			},
			// empty functions were benchmarked as running faster than both
			// `f && f()` and `if (f) { f(); }`
			preVirtualDiffApply: function() {},
			postVirtualDiffApply: function() {},
			preDiffApply: function() {},
			postDiffApply: function() {},
			filterOuterDiff: null
		};
		_extend(this,_extend(defaults,options||{}));

		this._const = Object.freeze(_clone(diffconst));
	};

	diffDOM.Diff = Diff;

	diffDOM.prototype = {

		diff: function(t1Node, t2Node) {

			var t1 = this.nodeToObj(t1Node),
				t2 = this.nodeToObj(t2Node);

			diffcount = 0;

			if (this.debug) {
				this.t1Orig = this.nodeToObj(t1Node);
				this.t2Orig = this.nodeToObj(t2Node);
			}

			this.tracker = new DiffTracker();
			return this.findDiffs(t1, t2);
		},

		findDiffs: function(t1, t2) {
			var diffs;
			do {
				diffs = this.findNextDiff(t1, t2, []);
				// Last check if the elements really are the same now.
				// If not, remove all info about being done and start over.
				// Somtimes a node can be marked as done, but the creation of subsequent diffs means that it has to be changed anyway.
				if (diffs.length === 0)
					if (!isEqual(t1, t2))
						diffs = (removeDone(t1),this.findNextDiff(t1, t2, []));

				if (diffs.length>0)
					this.applyVirtual(t1,this.tracker.add(diffs));
			} while (diffs.length > 0);
			return this.tracker.list;
		},

		findNextDiff: function(t1, t2, route) {
			var diffs, fdiffs;

			if (this.maxDepth && route.length > this.maxDepth)
				return [];
			// outer differences?
			if (!t1.outerDone) {
				diffs = this.findOuterDiff(t1, t2, route);
				if (this.filterOuterDiff) {
					fdiffs = this.filterOuterDiff(t1, t2, diffs);
					if (fdiffs) diffs = fdiffs;
				}
				if (diffs.length > 0)
					return t1.outerDone = true,diffs;
				else
					t1.outerDone = true;
			}

			// inner differences?
			if (!t1.innerDone) {
				diffs = this.findInnerDiff(t1, t2, route);
				if (diffs.length > 0)
					return diffs;
				else
					t1.innerDone = true;
			}

			if (this.valueDiffing && !t1.valueDone) {
				// value differences?
				diffs = this.findValueDiff(t1, t2, route);
				if (diffs.length > 0)
					return t1.valueDone = true,diffs;
				else
					t1.valueDone = true;
			}
			// no differences
			return [];
		},

		findOuterDiff: function(t1, t2, route) {
			var t = this;
			var diffs = [],
				attr1, attr2;

			if (t1.nodeName !== t2.nodeName) {
				return [new Diff()
					.setValue(t._const.action, t._const.replaceElement)
					.setValue(t._const.oldValue, t1)
					.setValue(t._const.newValue, t2)
					.setValue(t._const.route, route)
				];
			}

			if (t1.data !== t2.data) {
				// Comment or text node.
				if (t1.nodeName === '#text') {
					return [new Diff()
						.setValue(t._const.action, t._const.modifyTextElement)
						.setValue(t._const.route, route)
						.setValue(t._const.oldValue, t1.data)
						.setValue(t._const.newValue, t2.data)
					];
				} else {
					return [new Diff()
						.setValue(t._const.action, t._const.modifyComment)
						.setValue(t._const.route, route)
						.setValue(t._const.oldValue, t1.data)
						.setValue(t._const.newValue, t2.data)
					];
				}

			}

			attr1 = t1.attributes ? _keys(t1.attributes).sort() : [];
			attr2 = t2.attributes ? _keys(t2.attributes).sort() : [];

			_fal(attr1,function(attr) {
				var pos = attr2.indexOf(attr);
				if (pos === -1) {
					diffs.push(new Diff()
						.setValue(t._const.action, t._const.removeAttribute)
						.setValue(t._const.route, route)
						.setValue(t._const.name, attr)
						.setValue(t._const.value, t1.attributes[attr])
					);
				} else {
					attr2.splice(pos, 1);
					if (t1.attributes[attr] !== t2.attributes[attr]) {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.modifyAttribute)
							.setValue(t._const.route, route)
							.setValue(t._const.name, attr)
							.setValue(t._const.oldValue, t1.attributes[attr])
							.setValue(t._const.newValue, t2.attributes[attr])
						);
					}
				}

			});

			_fal(attr2,function(attr) {
				diffs.push(new Diff()
					.setValue(t._const.action, t._const.addAttribute)
					.setValue(t._const.route, route)
					.setValue(t._const.name, attr)
					.setValue(t._const.value, t2.attributes[attr])
				);

			});

			return diffs;
		},

		nodeToObj: function(aNode) {
			var objNode = {}; objNode.nodeName = aNode.nodeName;
			if (objNode.nodeName === '#text' || 
					objNode.nodeName === '#comment') {
				objNode.data = aNode.data;
			} else {
				if (aNode.attributes && aNode.attributes.length > 0) {
					objNode.attributes = {};
					_fal(Array.prototype.slice.call(aNode.attributes),
						function(attribute) {
							objNode.attributes[attribute.name] = attribute.value;
						}
					);
				}
				if (aNode.childNodes && aNode.childNodes.length > 0) {
					objNode.childNodes = [];
					_fal(Array.prototype.slice.call(aNode.childNodes),function(childNode) {
							objNode.childNodes.push(this.nodeToObj(childNode));
					},this);
				}
				if (this.valueDiffing) {
					if (aNode.value !== void 0)
						objNode.value = aNode.value;
					if (aNode.checked !== void 0)
						objNode.checked = aNode.checked;
					if (aNode.selected !== void 0)
						objNode.selected = aNode.selected;
				}
			}

			return objNode;
		},

		objToNode: function(objNode, insideSvg) {
			var node;
			if (objNode.nodeName === '#text') {
				node = document.createTextNode(objNode.data);
			} else if (objNode.nodeName === '#comment') {
				node = document.createComment(objNode.data);
			} else {
				if (objNode.nodeName === 'svg' || insideSvg) {
					node = document.createElementNS('http://www.w3.org/2000/svg', objNode.nodeName);
					insideSvg = true;
				} else {
					node = document.createElement(objNode.nodeName);
				}
				if (objNode.attributes) {
					_fal(_keys(objNode.attributes),function(attribute) {
						node.setAttribute(attribute, objNode.attributes[attribute]);
					});
				}
				if (objNode.childNodes) {
					_fal(objNode.childNodes,function(childNode) {
						node.appendChild(this.objToNode(childNode, insideSvg));
					},this);
				}
				if (this.valueDiffing) {
					if (objNode.value)
						node.value = objNode.value;
					if (objNode.checked)
						node.checked = objNode.checked;
					if (objNode.selected)
						node.selected = objNode.selected;
				}
			}
			return node;
		},

		findInnerDiff: function(t1, t2, route) {
			var t = this;
			var subtrees = (t1.childNodes && t2.childNodes) ? markSubTrees(t1, t2) : [],
				t1ChildNodes = t1.childNodes ? t1.childNodes : [],
				t2ChildNodes = t2.childNodes ? t2.childNodes : [],
				childNodesLengthDifference, diffs = [],
				index = 0,
				last, e1, e2, i;

			/* One or more groups have been identified among the childnodes of t1
			 * and t2.
			 */
			if (subtrees.length > 0) {
				diffs = this.attemptGroupRelocation(t1, t2, subtrees, route);
				if (diffs.length > 0)
					return diffs;
			}

			/* 0 or 1 groups of similar child nodes have been found
			 * for t1 and t2. 1 If there is 1, it could be a sign that the
			 * contents are the same. When the number of groups is below 2,
			 * t1 and t2 are made to have the same length and each of the
			 * pairs of child nodes are diffed.
			 */
			last = Math.max(t1ChildNodes.length, t2ChildNodes.length);
			if (t1ChildNodes.length !== t2ChildNodes.length)
				childNodesLengthDifference = true;

			for (i = 0; i < last; i += 1) {
				e1 = t1ChildNodes[i];
				e2 = t2ChildNodes[i];

				if (childNodesLengthDifference) {
					/* t1 and t2 have different amounts of childNodes. Add
					 * and remove as necessary to obtain the same length */
					if (e1 && !e2) {
						if (e1.nodeName === '#text') {
							diffs.push(new Diff()
								.setValue(t._const.action, t._const.removeTextElement)
								.setValue(t._const.route, route.concat(index))
								.setValue(t._const.value, e1.data)
							);
							index -= 1;
						} else {
							diffs.push(new Diff()
								.setValue(t._const.action, t._const.removeElement)
								.setValue(t._const.route, route.concat(index))
								.setValue(t._const.element, e1)
							);
							index -= 1;
						}

					} else if (e2 && !e1) {
						if (e2.nodeName === '#text') {
							diffs.push(new Diff()
								.setValue(t._const.action, t._const.addTextElement)
								.setValue(t._const.route, route.concat(index))
								.setValue(t._const.value, e2.data)
							);
						} else {
							diffs.push(new Diff()
								.setValue(t._const.action, t._const.addElement)
								.setValue(t._const.route, route.concat(index))
								.setValue(t._const.element, e2)
							);
						}
					}
				}
				/* We are now guaranteed that childNodes e1 and e2 exist,
				 * and that they can be diffed.
				 */
				/* Diffs in child nodes should not affect the parent node,
				 * so we let these diffs be submitted together with other
				 * diffs.
				 */

				if (e1 && e2)
					diffs = diffs.concat(this.findNextDiff(e1, e2, route.concat(index)));

				index++;
			}
			t1.innerDone = true;
			return diffs;
		},

		attemptGroupRelocation: function(t1, t2, subtrees, route) {
			/* Either t1.childNodes and t2.childNodes have the same length, or
			 * there are at least two groups of similar elements can be found.
			 * attempts are made at equalizing t1 with t2. First all initial
			 * elements with no group affiliation (gaps=true) are removed (if
			 * only in t1) or added (if only in t2). Then the creation of a group
			 * relocation diff is attempted.
			 */
			var t = this;
			var gapInformation = getGapInformation(t1, t2, subtrees),
				gaps1 = gapInformation.gaps1,
				gaps2 = gapInformation.gaps2,
				shortest = Math.min(gaps1.length, gaps2.length),
				destinationDifferent, toGroup,
				group, node, similarNode, testI, diffs = [],
				index1, index2, j;

			for (index2 = 0, index1 = 0; index2 < shortest; index1 += 1, index2 += 1) {
				if (gaps1[index2] === true) {
					node = t1.childNodes[index1];
					if (node.nodeName === '#text') {
						if (t2.childNodes[index2].nodeName === '#text' && node.data !== t2.childNodes[index2].data) {
							testI = index1;
							while (t1.childNodes.length > testI + 1 && t1.childNodes[testI + 1].nodeName === '#text') {
								testI += 1;
								if (t2.childNodes[index2].data === t1.childNodes[testI].data) {
									similarNode = true;
									break;
								}
							}
							if (!similarNode) {
								diffs.push(new Diff()
									.setValue(t._const.action, t._const.modifyTextElement)
									.setValue(t._const.route, route.concat(index2))
									.setValue(t._const.oldValue, node.data)
									.setValue(t._const.newValue, t2.childNodes[index2].data)
								);
								return diffs;
							}
						}
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.removeTextElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.value, node.data)
						);
						gaps1.splice(index2, 1);
						shortest = Math.min(gaps1.length, gaps2.length);
						index2 -= 1;
					} else {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.removeElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.element, node)
						);
						gaps1.splice(index2, 1);
						shortest = Math.min(gaps1.length, gaps2.length);
						index2--;
					}

				} else if (gaps2[index2] === true) {
					node = t2.childNodes[index2];
					if (node.nodeName === '#text') {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.addTextElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.value, node.data)
						);
						gaps1.splice(index2, 0, true);
						shortest = Math.min(gaps1.length, gaps2.length);
						index1--;
					} else {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.addElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.element, node)
						);
						gaps1.splice(index2, 0, true);
						shortest = Math.min(gaps1.length, gaps2.length);
						index1--;
					}

				} else if (gaps1[index2] !== gaps2[index2]) {
					if (diffs.length > 0)
						return diffs;
					// group relocation
					group = subtrees[gaps1[index2]];
					toGroup = Math.min(group.newValue, (t1.childNodes.length - group.length));
					if (toGroup !== group.oldValue) {
						// Check whether destination nodes are different than originating ones.
						destinationDifferent = false;
						for (j = 0; j < group.length; j += 1) {
							if (!roughlyEqual(t1.childNodes[toGroup + j], t1.childNodes[group.oldValue + j], [], false, true)) {
								destinationDifferent = true;
							}
						}
						if (destinationDifferent) {
							return [new Diff()
								.setValue(t._const.action, t._const.relocateGroup)
								.setValue('groupLength', group.length)
								.setValue(t._const.from, group.oldValue)
								.setValue(t._const.to, toGroup)
								.setValue(t._const.route, route)
							];
						}
					}
				}
			}
			return diffs;
		},

		findValueDiff: function(t1, t2, route) {
			// Differences of value. Only useful if the value/selection/checked value
			// differs from what is represented in the DOM. For example in the case
			// of filled out forms, etc.
			var diffs = [];
			var t = this;

			if (t1.selected !== t2.selected) {
				diffs.push(new Diff()
					.setValue(t._const.action, t._const.modifySelected)
					.setValue(t._const.oldValue, t1.selected)
					.setValue(t._const.newValue, t2.selected)
					.setValue(t._const.route, route)
				);
			}

			if ((t1.value || t2.value) && t1.value !== t2.value && t1.nodeName !== 'OPTION') {
				diffs.push(new Diff()
					.setValue(t._const.action, t._const.modifyValue)
					.setValue(t._const.oldValue, t1.value)
					.setValue(t._const.newValue, t2.value)
					.setValue(t._const.route, route)
				);
			}

			if (t1.checked !== t2.checked) {
				diffs.push(new Diff()
					.setValue(t._const.action, t._const.modifyChecked)
					.setValue(t._const.oldValue, t1.checked)
					.setValue(t._const.newValue, t2.checked)
					.setValue(t._const.route, route)
				);
			}

			return diffs;
		},

		// ===== Apply a virtual diff =====
		applyVirtual: function(tree, diffs) {
			_fal(diffs,function(diff) {
				this.applyVirtualDiff(tree, diff);
			},this);
			return true;
		},

		getFromVirtualRoute: function(tree, route) {
			var node = tree,
				parentNode, nodeIndex;

			route = route.slice();
			while (route.length > 0) {
				if (!node.childNodes)
					return false;
				nodeIndex = route.splice(0, 1)[0];
				parentNode = node;
				node = node.childNodes[nodeIndex];
			}
			return {
				node: node,
				parentNode: parentNode,
				nodeIndex: nodeIndex
			};
		},

		applyVirtualDiff: function(tree, diff) {
			var routeInfo = this.getFromVirtualRoute(tree, diff[this._const.route]),
				node = routeInfo.node,
				parentNode = routeInfo.parentNode,
				nodeIndex = routeInfo.nodeIndex,
				newNode, route, c;

			var t = this;
			// pre-diff hook
			var info = {
				diff: diff,
				node: node
			};

			if (this.preVirtualDiffApply(info))
				return true;

			switch (diff[this._const.action]) {
				case this._const.addAttribute:
					if (!node.attributes) {
						node.attributes = {};
					}

					node.attributes[diff[this._const.name]] = diff[this._const.value];

					if (diff[this._const.name] === 'checked') {
						node.checked = true;
					} else if (diff[this._const.name] === 'selected') {
						node.selected = true;
					} else if (node.nodeName === 'INPUT' && diff[this._const.name] === 'value') {
						node.value = diff[this._const.value];
					}

					break;
				case this._const.modifyAttribute:
					node.attributes[diff[this._const.name]] = diff[this._const.newValue];
					if (node.nodeName === 'INPUT' && diff[this._const.name] === 'value')
						node.value = diff[this._const.value];
					break;
				case this._const.removeAttribute:
					delete node.attributes[diff[this._const.name]];

					if (_keys(node.attributes).length === 0)
						delete node.attributes;

					if (diff[this._const.name] === 'checked')
						node.checked = false;
					else if (diff[this._const.name] === 'selected')
						delete node.selected;
					else if (node.nodeName === 'INPUT' && diff[this._const.name] === 'value')
						delete node.value;
					break;
				case this._const.modifyTextElement:
					node.data = diff[this._const.newValue];

					if (parentNode.nodeName === 'TEXTAREA')
						parentNode.value = diff[this._const.newValue];
					break;
				case this._const.modifyValue:
					node.value = diff[this._const.newValue];
					break;
				case this._const.modifyComment:
					node.data = diff[this._const.newValue];
					break;
				case this._const.modifyChecked:
					node.checked = diff[this._const.newValue];
					break;
				case this._const.modifySelected:
					node.selected = diff[this._const.newValue];
					break;
				case this._const.replaceElement:
					newNode = diff[this._const.newValue];
					newNode.outerDone = true;
					newNode.innerDone = true;
					newNode.valueDone = true;
					parentNode.childNodes[nodeIndex] = newNode;
					break;
				case this._const.relocateGroup:
					_fal(node.childNodes.splice(diff[this._const.from], diff.groupLength).reverse(),
						function(movedNode) {
							node.childNodes.splice(diff[t._const.to], 0, movedNode);
						});
					break;
				case this._const.removeElement:
					parentNode.childNodes.splice(nodeIndex, 1);
					break;
				case this._const.addElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					node = this.getFromVirtualRoute(tree, route).node;
					newNode = diff[this._const.element];
					newNode.outerDone = true;
					newNode.innerDone = true;
					newNode.valueDone = true;

					if (!node.childNodes)
						node.childNodes = [];

					if (c >= node.childNodes.length)
						node.childNodes.push(newNode);
					else
						node.childNodes.splice(c, 0, newNode);
					break;
				case this._const.removeTextElement:
					parentNode.childNodes.splice(nodeIndex, 1);
					if (parentNode.nodeName === 'TEXTAREA')
						delete parentNode.value;
					break;
				case this._const.addTextElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					newNode = {};
					newNode.nodeName = '#text';
					newNode.data = diff[this._const.value];
					node = this.getFromVirtualRoute(tree, route).node;
					if (!node.childNodes)
						node.childNodes = [];

					if (c >= node.childNodes.length)
						node.childNodes.push(newNode);
					else
						node.childNodes.splice(c, 0, newNode);

					if (node.nodeName === 'TEXTAREA')
						node.value = diff[this._const.newValue];
					break;
				default:
					console.log('unknown action');
			}

			// capture newNode for the callback
			info.newNode = newNode;
			this.postVirtualDiffApply(info);

			return;
		},

		// ===== Apply a diff =====
		apply: function(tree, diffs) {
			_fal(diffs,function(diff){
				this.applyDiff(tree, diff)
			},this);
			return true;
		},

		getFromRoute: function(tree, route) {
			route = route.slice();
			var node = tree;
			while (route.length > 0) {
				if (!node.childNodes)
					return false;
				node = node.childNodes[route.splice(0, 1)[0]];
			}
			return node;
		},

		applyDiff: function(tree, diff) {
			var node = this.getFromRoute(tree, diff[this._const.route]),
				newNode, reference, route, c;

			var t = this;
			// pre-diff hook
			var info = {
				diff: diff,
				node: node
			};

			if (this.preDiffApply(info))
				return true;

			switch (diff[this._const.action]) {
				case this._const.addAttribute:
					if (!node || !node.setAttribute)
						return false;
					node.setAttribute(diff[this._const.name], diff[this._const.value]);
					break;
				case this._const.modifyAttribute:
					if (!node || !node.setAttribute)
						return false;
					node.setAttribute(diff[this._const.name], diff[this._const.newValue]);
					break;
				case this._const.removeAttribute:
					if (!node || !node.removeAttribute)
						return false;
					node.removeAttribute(diff[this._const.name]);
					break;
				case this._const.modifyTextElement:
					if (!node || node.nodeType !== 3)
						return false;
					this.textDiff(node, node.data, diff[this._const.oldValue], diff[this._const.newValue]);
					break;
				case this._const.modifyValue:
					if (!node || node.value === void 0)
						return false;
					node.value = diff[this._const.newValue];
					break;
				case this._const.modifyComment:
					if (!node || node.data === void 0)
						return false;
					this.textDiff(node, node.data, diff[this._const.oldValue], diff[this._const.newValue]);
					break;
				case this._const.modifyChecked:
					if (!node || node.checked === void 0)
						return false;
					node.checked = diff[this._const.newValue];
					break;
				case this._const.modifySelected:
					if (!node || node.selected === void 0)
						return false;
					node.selected = diff[this._const.newValue];
					break;
				case this._const.replaceElement:
					node.parentNode.replaceChild(this.objToNode(diff[this._const.newValue], node.namespaceURI === 'http://www.w3.org/2000/svg'), node);
					break;
				case this._const.relocateGroup:
					_fal(Array.apply(null, new Array(diff.groupLength)).map(function() {
						return node.removeChild(node.childNodes[diff[t._const.from]]);
					}),function(childNode, index) {
						if (index === 0)
							reference = node.childNodes[diff[t._const.to]];
						node.insertBefore(childNode, reference);
					});
					break;
				case this._const.removeElement:
					node.parentNode.removeChild(node);
					break;
				case this._const.addElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					node = this.getFromRoute(tree, route);
					node.insertBefore(this.objToNode(diff[this._const.element], node.namespaceURI === 'http://www.w3.org/2000/svg'), node.childNodes[c]);
					break;
				case this._const.removeTextElement:
					if (!node || node.nodeType !== 3)
						return false;
					node.parentNode.removeChild(node);
					break;
				case this._const.addTextElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					newNode = document.createTextNode(diff[this._const.value]);
					node = this.getFromRoute(tree, route);
					if (!node || !node.childNodes)
						return false;
					node.insertBefore(newNode, node.childNodes[c]);
					break;
				default:
					console.log('unknown action');
			}

			// if a new node was created, we might be interested in it
			// post diff hook
			info.newNode = newNode;
			this.postDiffApply(info);

			return true;
		}
	};

	var _DIFF = new diffDOM({
		diffcap: 998
	});
	// end off domdiff

	var supportTemplate = "content" in document.createElement("template");
	function createDOM(rootElm,html){
		var r = rootElm.cloneNode(),t;
		if(supportTemplate)
			r.appendChild((
				t=document.createElement("template"),
				t.innerHTML=html,
				t.content)
			);
		else
			r.innerHTML = html;
		return r;
	}

	// Doom Events
	// Dom fired api
	var capEvents = [
		"blur"       , "invalid"     ,
		"focusin"    , "focusout"    , "focus",
		"abort"      , "afterprint"  , "beforeprint" ,
		"checking"   , "downloading" ,
		"load"       , "unload"      ,
		"loadend"    , "loadstart"   ,
		"mouseenter" , "mouseleave"  ,
		"resize"     , "show"        , "select"
	];

	var capTypes = {
		"UIEvent"       : [
			"focus",
			"blur",
			"focusin",
			"focusout"
		],
		"MouseEvent"    : [
			"click",
			"dbclick",
			"mouseup",
			"mousedown",
			"mouseout",
			"mouseover",
			"mouseenter",
			"mouseleave"
		],
		"KeyboardEvent" : [
			"keydown",
			"keypress",
			"keyup"
		]
	};

	Z.prototype = {
		get : function(index){
			return 0 in arguments ? 
				this.el[( +index + ( index < 0 ? this.length : 0 ) )] : 
				this.el;
		},

		each : function(fn,context){
			return _fal(this.el,fn,context||this),this;
		},

		find : function(sl){
			var res = []; 
			_fal(this.el,function(e){
				res = _slice(e.querySelectorAll(sl)).concat(res);
			});
			return z(res);
		},

		closest : function(selector,element){
			var el = this.el ,tmp=this.get(0) ,find;

			for(var i=0,l=el.length;i<l;i++,tmp=el[i])
				while(tmp&&!find&&tmp!==element)
					if(z.matchz(tmp=find=tmp.parentNode,selector)) 
						if(find) break;

			return z(find||[]);
		},

		on : function(event, selector, data, callback, one){
			var autoRemove, delegator, $this = this;
	
			if (event && typeof event !== "string") {
				_loop(event, function(fn, type){
					$this.on(type, selector, data, fn, one);
				});
	
				return $this;
			}
	
			if ((typeof selector !== "string") && 
				!_isFn(callback) && 
				callback !== false)
				callback = data, data = selector, selector = undefined;
			if (callback === undefined || data === false)
				callback = data, data = undefined;
	
			if (callback === false) 
				callback = returnFalse;
	
			return $this.each(function(element){
				if (one) 
					autoRemove = function(e){
						zremoveEvent(element, e.type, callback);
						return callback.apply(this, arguments);
					};
	
				if (selector) 
					delegator = function(e){
						var evt, match = !z.matchz(e.target,selector) ? 
											z(e.target).closest(selector, element).get(0) :
											e.target;

						if (match && match !== element){
							evt = _extend(createProxy(e), {currentTarget: match, liveFired: element});
							return (autoRemove || callback).apply(match, [evt].concat(_slice(arguments,1)));
						}
					};
	
				zaddEvent(element, event, callback, data, selector, delegator || autoRemove);
			});
		},

		off : function(event, selector, callback){
			var $this = this;

			if (event && typeof event !== "string") {
				_loop(event, function(fn, type){
					this.off(type, selector, fn);
				},this);
				return this;
			}
	
			if (typeof selector !== "string" && 
				!_isFn(callback) && 
				callback !== false)
				callback = selector, selector = undefined;
	
			if (callback === false) 
				callback = returnFalse;
	
			return this.each(function(element){
				zremoveEvent(element, event, callback, selector);
			});
		},

		trigger : function(event, args){
			event = typeof event === "string" ? z.Event(event) : compatible(event);
			event._args = args;
	
			return this.each(function(element){
				// handle focus(), blur() by calling them directly
				if (event.type in focus && _isFn(element[event.type])) 
					element[event.type]();
				// items in the collection might not be DOM elements
				else if ('dispatchEvent' in element) 
					element.dispatchEvent(event);
				else 
					z(element).triggerHandler(event, args);
			});
		},
	
		triggerHandler : function(event, args){
			var e, result;
			this.each(function(element){
				e = createProxy( typeof event === "string" ? z.Event(event) : event);
	
				e._args = args;
				e.target = element;
				_loop(findHandlers(element, event.type || event), function(handler){
					result = handler.proxy(e);
					if (e.isImmediatePropagationStopped()) return false;
				});
			});
	
			return result;
		},
	
		html : function(html){
			return this.each(function(elm){
				elm.innerHTML = html;
			});
		},
		// virtual render
		render : function(newhtml){
			return this.each(function(elm){
				this.apply(elm,this.diff(elm,
					createDOM(elm,newhtml.nodeType === 1 ? 
						newhtml.outerHTML : _toString(newhtml))
					)
				);
			},_DIFF);
		}
	};

	function checkValidate(olddata,newdata,validate){
		var res = [],s=_size(validate);
		if(!s) return res;
		if(!_eq(olddata,newdata)){
			var key = _keys(validate);
			for(var i=0,isRequired,value; i<s; i++){
				// get validate funtion
				isRequired = validate[key[i]];
				value=_prop(newdata,key[i]);
				if(!isRequired(value)){
					res.push(key[i],value);
					break;
				}
			}
		}
		return res;
	}

	function on(type,fn){
		if(_isFn(fn)) _on(this,type,fn);
		return this;
	}

	function uon(fn,type){
		return this.on(type,fn);
	}

	function unbind(type,fn){
		return _unbind(this,type,fn);
	}

	function emit(type,args){
		return _emit(this,type,args||[]);
	}

	// Aix Model
	aix.model = aM = function(obj){
		var config = _extend(_clone(MODEL_DEFAULT),obj||{}),
			data = config.data,
			events = config.events,
			validate = config.validate;

		delete config.data;
		delete config.change;
		delete config.events;
		delete config.validate;

		// define data
		_define(this,"data",{
			get : function(){
				return _clone(data);
			},
			set : function(newdata){
				if(_eq(data,newdata)) return data;

				var args = [_clone(newdata)],error;
				if((this.emit("validate",args),
					_isPrim(newdata)?
					(_isFn(validate) ? validate(newdata) : true):
					(error=checkValidate(data,newdata,validate),!_size(error))))
					return data=newdata,
					this.change=true,
					this.emit("validate:success,change",args),
					newdata;

				this.emit("validate:fail",args.concat(error));
				if(_isAry(error)&&_size(error)===2)
					this.emit("validate:fail:"+_first(error),error);
				return data;
			},
			enumerable:true,
			configurable:false
		});

		// if userobj has more events
		_fol(events,uon,this);

		// init event
		_extend(this,config)
			.emit("init",[this.data]);
	};

	// Extend aix model method 
	// Model Prototype extend
	// model data usually define as pure data, not javascript event or function
	// because it much as MVC-M logs 
	aM.prototype = {
		get : function(key){
			if(key!=null)
				return _prop.apply(this,
					[this.data].concat(_slice(arguments)));
			return this.data;
		},

		set : function(){
			var param;
			this.data = arguments.length > 1 ?
				(param = arguments[0],
				_setProp(this.data,param,arguments[1])) : 
				arguments[0];
			return param ? this.emit("change:"+param,[arguments[1]]) : this;
		},

		remove : function(prop){
			if(prop){
				var tmp = this.data;
				this.data = _isAry(tmp) ? 
					(tmp.splice(+prop,1),tmp) : 
					_rmProp(tmp,prop);
			}else{
				this.data=null;
			}
			return this;
		},

		// API event
		on : on,

		unbind : unbind,

		emit : emit,

		// Aix Restful API design for
		// [Aix Model] data format serialize
		toJSON : function(){
			return _isPrim(this.data) ? 
				this.data : 
				JSON.stringify(this.data);
		},

		parse : function(deep){
			return deep ? 
				_dpclone(this.data) : 
				this.data;
		},

		// Fetch mean Restful "GET"
		// fetch data form url with param
		pipe : function(type,url,param,fns,fnf,header){
			//param must be object typeof
			var st = {
				type  : RESTFUL[_toString(type).toLowerCase()]||"GET",
				aysnc : true
			}, _fns, _fnf, isFn= _isFn(param);

			// deel with arguments 
			if(typeof url === 'string'){
				st.url = url;
				st.param = isFn ? {} : (param || {});
				_fns = isFn ?  param : (fns || _noop);
				_fnf = isFn ? (fns || _noop) : (fnf || _noop);
			}else if(_isObj(url)){
				st.url = this.url || "/";
				st.param = isFn ? url : (param || {});
				_fns = isFn ?  param : (fns || _noop);
				_fnf = isFn ? (fns || _noop) : (fnf || _noop);
			}else{
				// no param
				st.url = this.url || "/";
				_fns = _noop;
				_fnf = _noop;
			}

			// set http header param
			st.header = header;
			st.success = function(responseText,xhr,event){
				// change the data before dispatch event;
				_fns.call(this,responseText,xhr,event);
				this.emit(type+":success",[responseText,xhr,event]);
			}.bind(this);
			st.fail = function(xhr,event){
				_fnf.call(this,xhr,event);
				this.emit(type+":fail",[xhr,event]);
			}.bind(this);

			// trigger ajax events
			return this.emit(type,[_ajax(st),st]);
		},

		send: function(url,fns,fnf,header){
			return this.pipe.apply(this,[
				"get",
				url || this.url,
				this.data,
				fns,
				fnf,
				header
			]);
		},

		fetch: function(param,fns,fnf,header){
			return this.pipe.apply(this,[
				"fetch",
				this.url,
				param,
				function(responseText,xhr,event){
					this.data = JSON.parse(responseText);
					(fns||_noop).call(this,responseText,xhr,event);
				},
				fnf,
				header
			]);
		},

		sync: function(fns,fnf,header){
		  return this.pipe.apply(this,[
		  	"save",
		  	this.url,
		  	this.data,
		  	fns,
		  	fnf,
		  	header
			]);
		},

		toString: function(){
			return this.data;
		}
	};

	// bind selector
	aix.view = aV = function(obj){
		var config = _extend(_clone(VIEW_DEFAULT),obj||{}),
			events = config.events,
			stencil = config.template,
			vroot = config.root,
			render = config.render;

		delete config.root;
		delete config.mount;
		delete config.events;
		delete config.render;
		delete config.template;

		// parse template
		// building the render function
		if(!_isFn(render)){
			stencil = (typeof stencil === "string") ? 
				_doom(stencil) : (_isFn(stencil) ? stencil : _noop);

			render = function(){ 
				var t = z(vroot),args = _slice(arguments);
				return this.emit("beforeRender",args),
					(stencil !== _noop && (
						(_trim(t.get(0).innerHTML)==="" ? 
							t.html(stencil.apply(this,args)) : 
							t.render(stencil.apply(this,args))
						) && this.emit("afterRender",args))),this;
			};
		}

		// if userobj has more events
		if(vroot&&(vroot instanceof Element || typeof vroot === "string")){
			this.root = vroot; this.render = render;
			_fol(events,uon,this);
		}else{
			this.mount = function(el){
				if(!(el instanceof Element)&&!_isAryL(el))
					throw new TypeError("el must be typeof DOMElement or NodeList collections -> not "+el);
				this.root = vroot = el; this.render = render;

				// bind events
				_fol(events,uon,this);

				// trigger render 
				if(_isFn(this.render))
					this.render.apply(this,_slice(arguments,1))
				// delete mount
				return delete this.mount;
			}.bind(this);
		}

		// first trigger "init" event
		_extend(this,config)
			.emit("init");
	};

	aV.prototype = {
		on : function(type,fn){
			return _fal((type||"").split(","),function(mk){
				var param = mk.split(":");
				// DOM Element events
				if(param.length > 1)
					z(this.root).on(param[0],param[1],{self:this},fn);
				else
					_on(this,mk,fn);
			},this),this;
		},

		unbind : function(type,fn){
			return _fal((type||"").split(","),function(mk){
				var param = mk.split(":");
				// DOM Element events
				if(param.length > 1)
					z(this.root).off(param[0],param[1],fn);
				else
					_unbind(this,mk,fn);
			},this),this;
		},

		emit : function(type,args){
			var k = (type||"").split(":");

			if(k.length>2){
				return _fal((type||"").split(","),function(mk){
					var mkf = mk.split(":");
					z(this.root).find(mkf[1]).trigger(mkf[0],args);
				},this),this;
			}

			if(k.length>1)
				return z(this.root).find(k[1]).trigger(k[0],args),this;

			return _emit(this,type,args);
		},

		toString : function(){
			return this.root;
		}
	};

	//get Hash param form URL
	function hashGet(url,char){
		var index = url.search("#"),
			charindex = url.search(char);
		return index>0 ? url.slice(index+1,!~charindex?void 0:charindex) : "";
	}

	function hashParam(url,char){
		var charindex = url.search(char);
		return _param(!~charindex ? void 0 : url.slice(charindex+1));
	}

	//if hashChange call
	function hashChange(url,char,event){
		var hash = hashGet(url,char), param = hashParam(url,char); 
		_fol(this.routes,function(fn,key){
			if((new RegExp(key,"i")).test(hash))
				hashChangeReg.call(this,fn,[param,hash,event]);
		},this);
	}

	// detect args callback
	function hashChangeReg(fn,args){
		if(_isFn(fn))
			fn.apply(this,args);
		else
			// array or string
			_fal(typeof fn === "string" ? fn.split(",") : fn,
				function(reg){ this.actions[reg].apply(this,args); },this);
	}

	// define route for SPA
	aix.route = aR = function(obj){
		var _this = this,
			history = { old: "", now: root.location.href },
			config = _extend(_clone(ROUTE_DEFAULT),obj||{}),
			events = config.events;

		delete config.history;
		delete config.events;
		// if userobj has more events
		// addEvent for this route object
		// use dispatch event to trigger
		// cant change regular hash title
		_define(this, "event" ,{
			value : function(event){
				if(root.location.href === history.now)
					return event.preventDefault();
				// change the save hash url
				history.old = history.now; 
				return _this.emit("hashchange",
					[history.now = root.location.href,config.char,event]);
			},
			writable : false,
			enumerable : false,
			configurable: false
		});

		_fol(events,uon,this);

		_extend(this,config)
			.on("hashchange",hashChange)
			.emit("init");
	};

	// Aix-Route for SPA Architecture
	// auto trigger regex event when route change
	aR.prototype = {
		on : on,

		unbind : unbind,

		emit : emit,

		listen: function(hash){
			if(!this._listen){
				_define(this,"_listen",{
					value:!root.addEventListener("hashchange",this.event),
					writable : false,
					enumerable : false,
					configurable: true,
				});
				
				return hash ? 
					this.assign(hash) : 
					this.emit("hashchange",[root.location.href,this.char]);
			}
			return this;
		},

		stop: function(){
			if(delete this._listen)
				root.removeEventListener("hashchange",this.event);
			return this;
		},

		assign : function(hash,param){
			if(this._listen){
				var url = root.location.href; 
				var hashindex = url.search("#");
				if(hashindex > 0)
					url = url.slice(0,hashindex);

				root.location.href = url + (hash.toString().slice(0,1)==="#"?"":"#") + hash;
			}
			return this;
		},

		toString : function(){
			return this;
		}
	};

	// #genertor api
	_fal([
		"extend",
		"not",
		"cat",
		"find",
		"filter",
		"reject",
		"hook",
		"chunk",
		"compact",
		"pluck",
		"groupBy",
		"countBy",
		"pairs",
		"shuffle",
		"flat",
		"merge",
		"map",
		"sort",
		"unique",
		"concat"
	],genertor_);

	_fal([
		"keys",
		"diff",
		"intsec",
		"first",
		"last",
		"auto",
		"eq",
		"values",
		"size",
		"each",
		"has",
		"type",
		"index"
	],genertor_$);

	// Extend method
	// Create Aix Pack extends
	// Prepare for component
	aix.VERSION = struct.VERSION;

	aV.extend = createExtend("view");
	aM.extend = createExtend("model");
	aR.extend = createExtend("route");

	frozen(aM,aV,aR,v8(aix));

	return aix;
});
