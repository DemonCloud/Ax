console.time("struct pref");
;(function(Q,struct){
	var ta = [],
			to = {},
			targ = (function(){ return arguments; }()),
			tn = document.createElement('a'),
			ts = '',
			noop = function(){},
			eventObj = {};

	var eq = struct.eq();

	Q.module("[ Struct ]");

	Q.test(" - [ define ]",function(a){
		var define = struct.define();
		var k = {};

		define(k,"init",{
			value:1,
			writable:true,
			configurable:true,
			enumerable:false
		});
		a.equal(k.init,1,"define single key success!");

		define(k,{
			"a":{
				value:1,
				writable:true,
				configurable:true,
				enumerable:false
			},

			"b":{
				value:'213',
				writable:false,
				configurable:false,
				enumerable:false
			}
		});

		a.equal(k.a,1,"define mutip a key success!");
		a.equal(k.b,'213',"define mutip b key success!");

		delete k.b;
		a.equal(k.b,'213',"can not delete key b");
	});

	Q.test(" - [ extend ]",function(a){
		var extend = struct.extend();

		var k = { a:1 };
		extend(k,{ b:2 });
		a.equal(k.b,2,"extend compose origin object success!");
		
		var k2 = { a:1,b:2 };
		extend(k2,{c:2,d:3,isIgnore:true},["isIgnore"]);
		a.equal(k2.isIgnore,void 0,"ignore define key isIgnore");
	});

	Q.test(" - [ depextend ]",function(a){
		var extend = struct.depextend();

		var k = { a:1 };
		var c = { b:2 };
		var b = extend(k,c);
		a.equal(k!==b&&k!==c,true,"depextend obj not equal themself");

		a.equal(b.a===1&&b.b===2,true,"clone the obj success");
	});

	Q.test(" - [ clone ]",function(a){
		var clone = struct.clone();
		var obj = {a:1,b:2,c:3};
		var arr = [1,2,3,4];

		a.equal(eq(obj,clone(obj)),true,"clone object");
		a.equal(eq(arr,clone(arr)),true,"clone array");
	});

	Q.test(" - [ depclone ]",function(a){
		var clone = struct.depclone();
		var obj = {a:1,b:2,c:3};
		var arr = [1,obj,3,obj];
		var arrcp = clone(arr);

		a.equal(eq(obj,clone(obj)),true,"clone object");
		a.equal(eq(arr,arrcp),true,"clone array");
		a.equal(arrcp[1]!==obj,true,"clone array deep constructor");
		a.equal(arrcp[3]!==obj,true,"clone array deep constructor");
	});

	Q.test(" - [ not ]",function(a){
		var not = struct.not();
		var arr = ['1','2',3,4,'d','e'];
		var arr2 = [3,4,5];
		var obj = { a:1,b:2,c:3,'123':321 };

		not(obj,321);
		not(arr2,3);
		not(arr,/\d/);
		
		a.equal(obj['123'],void 0,"not filter obj");
		a.equal(arr2.length===2&&arr2[0]===4,true,"filter arr");
		a.equal(arr.length===2&&arr[0]==='d',true,"filter arr with regexp");
	});

	Q.test(" - [ filter ]",function(a){
		var filter = struct.filter();
		
		var arr = [1,2,3,4,5,6];
		var obj = { a:1, b:2, c:3, d:4, e:4, f:6 };
		var strarr = ['abc','bca','adc','bcd','dab','cad'];
		var strobj = { abc:'abc',bac:'abc',123:'cad',abd:'abc' };


		a.equal(eq(filter(arr,4),[4]),true,"filter array with value");
		a.equal(eq(filter(obj,4),[4,4]),true,"filter object with value");
		a.equal(filter(strarr,/^ab/).pop(),'abc',"filter array with regExp");
		a.equal(eq(filter(strobj,/^ab/),['abc','abc','abc']),true,"filter object with regExp");
		a.equal(eq(filter(arr,function(v){ return v>3;},true),[3,4,5]),true,"filter array by key");
		a.equal(eq(filter(strobj,/^ab/,true),['abc','bac','abd']),true,"filter object by key");
	});

	Q.test(" - [ reject ]",function(a){
		var reject = struct.reject();
		
		var arr = [1,2,3,4,5,6];
		var obj = { a:1, b:2, c:3, d:4, e:4, f:6 };
		var strarr = ['abc','bca','adc','bcd','dab','cad'];
		var strobj = { abc:'abc',bac:'abc',123:'cad',abd:'abc' };

		a.equal(eq(reject(arr,4),[1,2,3,5,6]),true,"reject array with value");
		a.equal(eq(reject(obj,4),[1,2,3,6]),true,"reject object with value");
		a.equal(eq(reject(strarr,/^ab/),['bca','adc','bcd','dab','cad']),true,"reject array with regExp");
		a.equal(eq(reject(strobj,/^ab/),['cad']),true,"reject object with regExp");
		a.equal(eq(reject(arr,function(v){ return v>3;},true),[0,1,2]),true,"reject array by key");
		a.equal(eq(reject(strobj,/^ab/,true),['123']),true,"reject object by key");
	});

	Q.test(" - [ every ]",function(a){
		var every = struct.every();
		
		var arr = [1,2,3,4,5,6];
		var arr2 = ["a","cd","asd","ds"];
		
		a.equal(every(arr,function(n){ return n>0; }),true,"test pure number integer");
		a.equal(every(arr2,function(n){ return n.length>2; }),false,"test string length");
	});

	Q.test(" - [ some ]",function(a){
		var some = struct.some();
		
		var arr = [1,2,3,4,5,6];
		var arr2 = ["a","cd","asd","ds"];
		
		a.equal(some(arr,function(n){ return n<0; }),false,"test pure number integer");
		a.equal(some(arr2,function(n){ return n.length>2; }),true,"test string length");
	});

	Q.test(" - [ cat ]",function(a){
		var cat = struct.cat();
		
		var arr = [1,2,3,4,5,6];
		
		var cr = cat(arr,function(v){ return v>3; });
		a.equal(eq(arr,[1,2,3]),true,"cat array");
		a.equal(eq(cr,[4,5,6]),true,"cat array with Identifier");
	});

	Q.test(" - [ pluck ]",function(a){
		var pluck = struct.pluck();
		var arr = [{a:1,b:2},{a:2,b:3},{a:3,b:4}];
		var obj = { a:{a:1,b:2}, b:{a:2,b:3},c:{a:3,b:4} };
	
		a.equal(eq(pluck(arr,'a'),[1,2,3]),true,"pluck arr");
		a.equal(eq(pluck(obj,'a'),[1,2,3]),true,"pluck object");
	});

	Q.test(" - [ groupBy ]",function(a){
		var groupBy = struct.groupBy();
		var o = ['abc','a','sd','bb','c'];
	
		a.equal(eq(groupBy(o,'length'),{ '1':['a','c'],'2':['sd','bb'],'3':['abc'] }),true,"groupBy arr");
	});

	Q.test(" - [ shuffle ]",function(a){
		var shuffle = struct.shuffle();
		var arr = ['abc','a','sd','bb','c'];
	
		a.equal(eq(shuffle(arr),arr),false,"test shuffle array");
	});

	Q.test(" - [ chunk ]",function(a){
		var chunk = struct.chunk();
		var arr = [1,2,3,4,5];
	
		a.equal(eq(chunk(arr),[[1,2],[3,4],[5]]),true,"chunk array with default size");
		a.equal(eq(chunk(arr,3),[[1,2,3],[4,5]]),true,"chunk with other size");
	});

	Q.test(" - [ compact ]",function(a){
		var compact = struct.compact();
		var arr = [1,2,3,4,5];
	
		a.equal(eq(compact([1,'',false,2,undefined,null,[],3]),[1,2,[],3]),true,"compact filter array");
	});

	Q.test(" - [ diff ]",function(a){
		var diff = struct.diff();
		var arr = [1,2,3,4,5];
		var arr2 = [3,4];
		var arr3 = [1,3];
		var arr4 = [2];
		var no = 5;
		var str = ['2',1];

		a.equal(eq(diff(arr,arr2,arr3,arr4),[5]),true,"diff array");
		a.equal(eq(diff(arr,arr2,arr3,no),[2]),true,"diff array with single number");
		a.equal(eq(diff(arr,arr2,arr4,no,str),['2']),true,"diff array with string");
	});

	Q.test(" - [ intsec ]",function(a){
		var intsec = struct.intsec();
		var arr = [1,2,3,4,5];
		var arr2 = [1,3,4];
		var arr3 = [1,3];
		var arr4 = [2];
		var no = 5;
		var no2 = 1;
		var str = [1,4,'1',5];

		a.equal(eq(intsec(arr,arr2,arr3),[1,3]),true,"intsec array");
		a.equal(eq(intsec(arr,arr2,arr3,no),[]),true,"intsec array with single number");
		a.equal(eq(intsec(arr,arr2,arr3,str),[1]),true,"intsec array with string");
	});

	Q.test(" - [ merge ]",function(a){
		var merge = struct.merge();
		var arr = [1,2,3,4,5];
		var arr2 = [1,3,4];
		var arr3 = [1,3];
		var arr4 = [2];
		var no = 6;
		var no2 = 1;

		a.equal(eq(merge(arr,arr2,arr3,arr4,no,no2),[1,2,3,4,5,6]),true,"merge array");
	});

	Q.test(" - [ flat ]",function(a){
		var flat = struct.flat();
		var arr = [1,[2,3],[4],5];
		var arr2 = [1,[3,[4]]];
		var arr3 = [1,3];
		var arr4 = 2;

		a.equal(eq(flat(arr,arr2,arr3,arr4),[1,2,3,4,5,1,3,[4],1,3,2]),true,"flat slim copy");
		a.equal(eq(flat(arr,arr2,arr3,true),[1,2,3,4,5,1,3,4,1,3]),true,"flat with deep done");
	});

	Q.test(" - [ part ]",function(a){
		var part = struct.part();

		var k = 0;
		var fn = part(function(){ k++; },5);

		for(var i=0; i<10; i++)
			fn();

		a.equal(k,5,"only run 5 times");
	});

	Q.test(" - [ once ]",function(a){
		var once = struct.once();

		var k = 0;
		var fn = once(function(){ k++; },5);

		for(var i=0; i<10; i++)
			fn();

		a.equal(k,1,"only run once times");
	});

	Q.test(" - [ eq ]",function(a){
		var p1 = true;
		var p2 = true;
		var p3 = 's';
		var p4 = 'ss';
		var p5 = { a:1,b:2 };
		var p6 = { a:1,b:2 };
		var p7 = [1,2,p6,4];
		var p8 = [1,2,p5,4];
		var p9 = ['1',2,p5,'4'];
		var p10 = [1,2,p5,{ a : p6 },p6,[1,[2,'4'],p5,p7],'2',{ b:[p6,p8],c:'2',d:1 },4];
		var p11 = [1,2,p6,{ a : p5 },p5,[1,[2,'4'],p6,p8],'2',{ b:[p5,p7],c:'2',d:1 },4];
		var p12 = '1';
		var p13 = 1;

		a.equal(eq(p1,p2),true,"eq boolean");
		a.equal(eq(p2,p3),false,"eq boolean and string");
		a.equal(eq(p3,p4),false,"diff string");
		a.equal(eq(p4,ts),false,"diff empty string");
		a.equal(eq(p5,p5),true,"self equal");
		a.equal(eq(p5,p6),true,"same values equal");
		a.equal(eq(p6,p7),false,"not same type value");
		a.equal(eq(p7,p8),true,"array diff");
		a.equal(eq(p7,p9),false,"with same string and number in object");
		a.equal(eq(p8,p9),false,"with same string and number in object");
		a.equal(eq(p10,p11),true,"deeping equal");
		a.equal(eq(p12,p13),false,"test no convert type");
	});

	Q.test(" - [ doom[template] ]",function(a){
		var doom = struct.doom();
		var boom = struct.doom({
			escape      : "<<-([\\s\\S]+?)>>",
			interpolate : "<<#([\\s\\S]+?)>>",
			evaluate    : "<<([\\s\\S]+?)>>"
		});

		var str = "{{-one}}{{#two}}{{#three}}";
		var str2 = "<<-one>><<#two>><<#three>>";
		var data ={
			one:1,
			two:2,
			three:3
		};
		
		a.equal(doom(str)(data),"123","base render");
		a.equal(boom(str2)(data),"123","base render with escape");
	});

	Q.test(" - [ has(key) ]",function(a){
		var haskey = struct.has('key');
		var arr = ['a','b','c','d','e'];
		var obj = { a:1,b:2,c:3,'123':321 };

		a.equal(haskey(arr,0),true,"has key index 0");
		a.equal(haskey(arr,1),true,"has key index 1");
		a.equal(haskey(arr,5),false,"has not key index 5");
		a.equal(haskey(obj,'a'),true,"has key a");
		a.equal(haskey(obj,'d'),false,"has not key d");
		a.equal(haskey(obj,/\d+/),true,"support resexp object check");
		a.equal(haskey(arr,/\s/),false,"support resexp array check");
	});

	Q.test(" - [ has() ]",function(a){
		var has = struct.has();
		var arr = ['a','b','c','d','e'];
		var obj = { a:1,b:2,c:3,'123':321 };

		a.equal(has(arr,0),false,"has not value 0");
		a.equal(has(arr,1),false,"has not value 1");
		a.equal(has(arr,'e'),true,"has value 'e'");
		a.equal(has(obj,'a'),false,"has not value 'a'");
		a.equal(has(obj,3),true,"has value 3");
		a.equal(has(obj,/\d+/),true,"support resexp object check");
		a.equal(has(arr,/\d+/),false,"support resexp array check");
	});

	Q.test(" - [ type(object) ]",function(a){
		var iso = struct.type('object');

		a.equal(iso(to),true,"isObject test pure object");
		a.equal(iso(void 0),false,"void 0 is not object");
		a.equal(iso(document.body),true,"dom element instanceof object");
		a.equal(iso(noop),true,"function instanceof object");
	});

	Q.test("- [ type(array) ]",function(a){
		var is = struct.type('array');
	
		a.equal(is(ta),true,"isArray test pure array");
		a.equal(is(to),false,"Object is not pase test pure array");
		a.equal(is(targ),false,"ArrayLike object is not pase test pure array");
	});

	Q.test("- [ type(arraylike) ]",function(a){
		var is = struct.type('arraylike');
	
		a.equal(is(ta),true,"ArrayLike test pure array");
		a.equal(is(to),false,"Object is not pase test arrayLike");
		a.equal(is(targ),true,"arguments is arraylike");
	});

	Q.test(" - [ type(function),(fn) ]",function(a){
		var is = struct.type('fn');

		a.equal(is(noop),true,'check is function');
		a.equal(is(ta),false,'array is not function');
		a.equal(is(to),false,'object is not function');
		a.equal(is(arguments),false,'arguments is not function');
		a.equal(is(true),false,'boolean is not function');
	});

	Q.test(" - [ type(nan) ]",function(a){
		var is = struct.type('nan');
		
		a.equal(is(NaN),true,"check NaN type");
		a.equal(is(to),false,"empty object is not NaN type");
		a.equal(is(ts),false,"empty string is not NaN type");
		a.equal(is(0),false,"0 number is not NaN type");
	});

	Q.test(" - [ type(primitive),(prim) ]",function(a){
		var is = struct.type('primitive');
		
		a.equal(is(to),false,"object is not primitive");
		a.equal(is(ta),false,"array is not primitive");
		a.equal(is(targ),false,"arguments is not primitive");
		a.equal(is(1),true,"number is primitive");
		a.equal(is(NaN),true,"NaN is primitive");
		a.equal(is(ts),true,"string is primitive");
		a.equal(is(null),true,"null is primitive");
		a.equal(is(noop),true,"function is primitive");
		a.equal(is(),true,"void 0 (undefined) is primitive");
	});

	Q.test(" - [ type(identifier),(idt) ]",function(a){
		var is = struct.type('identifier');
		
		a.equal(is(ts),false,"empty string is not Identifier");
		a.equal(is(123),false,"number is not Identifier");
		a.equal(is(),false,"void 0 is not Identifier");
		a.equal(is('abs'),true,"normal string is Identifier");
		a.equal(is('abs123'),true,"normal add number string is Identifier");
		a.equal(is('21abs'),false,"number add normal string is not Identifier");
		a.equal(is('ab-s27'),false,"identifier not support expeace char");
		a.equal(is('ab*&s27'),false,"identifier not support expeace char");
	});

	Q.test(" - [ type(int) ]",function(a){
		var is = struct.type('int');
		
		a.equal(is(1),true,"check static int number");
		a.equal(is(1.2),false,"float type");
		a.equal(is(0.223144444897),false,"double type");
		a.equal(is(-2),true,"minus type");
		a.equal(is(-2.211232321323),false,"minus float type");
		a.equal(is(NaN),false,"nan type ");
	});

	Q.test(" - [ type(float),(double) ]",function(a){
		var is = struct.type('float');
		
		a.equal(is(1),false,"check static int number");
		a.equal(is(1.2),true,"float type");
		a.equal(is(0.223144444897),true,"double type");
		a.equal(is(-2),false,"minus type");
		a.equal(is(-2.211232321323),true,"minus float type");
		a.equal(is(NaN),false,"nan type ");
	});

	Q.test(" - [ type(date) ]",function(a){
		var is = struct.type('date');
	
		a.equal(is(new Date),true,"date type");
		a.equal(is(Date),false,"date function type");
	});

	Q.test(" - [ type(empty) ]",function(a){
		var is = struct.type('empty');
	
		a.equal(is(to),true,"empty object");
		a.equal(is(ta),true,"empty array");
		a.equal(is(ts),false,"empty string is not empty");
		a.equal(is(0),false,"empty number is not empty");
	});
	
	Q.test(" - [ type(element),(elm),(dom) ]",function(a){
		var is = struct.type('element');
	
		a.equal(is(to),false,"empty object");
		a.equal(is(ta),false,"empty array");
		a.equal(is(ts),false,"empty string");
		a.equal(is(0),false,"zero number");
		a.equal(is(tn),true,"elm check");
		a.equal(is(document.body),true,"elm check");
	});

	Q.test(" - [ type(native) ]",function(a){
		var is = struct.type('native');
	
		a.equal(is(to),false,"empty object");
		a.equal(is(ta),false,"empty array");
		a.equal(is(ts),false,"empty striing");
		a.equal(is(tn),false,"empty Element");
		a.equal(is(0),false,"empty 0");
		a.equal(is(struct),false,"asy function object");
		a.equal(is(Object),true,"constrict object");
		a.equal(is(alert),true,"alert is native api");
		a.equal(is(confirm),true,"console log is native api");
	});

	Q.test(" - [ type() ]",function(a){
		var is = struct.type();
	
		a.equal(is(to),'object',"empty object");
		a.equal(is(ta),'array',"empty array");
		a.equal(is(ts),'string',"empty striing");
		a.equal(is(tn),'object',"empty Element");
		a.equal(is(0),'number',"empty 0");
		a.equal(is(new Date()),'date',"date type");
		a.equal(is(/\s/),'regexp',"regexp type");
		a.equal(is(struct),'function',"function type");
	});

	
	Q.test(" - [ convert(string),(str),() ]",function(a){
		var co = struct.convert('string');
	
		a.equal(co(to),'[object Object]',"empty object");
		a.equal(co(ta),'',"empty array");
		a.equal(co(ts),'',"empty string");
		a.equal(co(123),'123','to string number');
		a.equal(co([1,2,3]),'1,2,3','pure array');
		a.equal(co(null),'','null');
		a.equal(co(void 0),'','void 0');
	});

	Q.test(" - [ convert(number),(num) ]",function(a){
		var co = struct.convert('number');
	
		a.equal(co(to),0,"empty object");
		a.equal(co(ta),0,"empty array");
		a.equal(co(ts),0,"empty string");
		a.equal(co(123),123,'pure number');
		a.equal(co('1.232123'),1.232123,'float number');
		a.equal(co(-0.321),-0.321,'float minus');
		a.equal(co([1,2,3]),0,'pure array');
		a.equal(co(null),0,'null');
		a.equal(co(void 0),0,'void 0');
	});

	Q.test(" - [ convert(array),(arr) ]",function(a){
		var co = struct.convert('array');
	
		a.equal(co(to).length,0,"empty object");
		a.equal(co({a:2,b:1}).length,2,"object");
		a.equal(co(ta).length,0,"empty array");
		a.equal(co(ts).length,0,"empty string");
		a.equal(co(123).pop(),123,'pure number');
		a.equal(co('1232123').length,7,'number string');
		a.equal(co(null).length,0,'null');
		a.equal(co(void 0).length,0,'void 0');
	});

	Q.test(" - [ convert(hex) ]",function(a){
		var co = struct.convert('hex');
	
		var rgb1 = { r:82,g:140,b:224 }, //528ce0
				rgb2 = { r:210,g:224,b:230 }, //d2e0e6
				rgb3 = { r:54,g:96,b:151 }, //366097
				rgb4 = { r:255,g:255,b:255 }, //ffffff
				rgb5 = { r:0,g:0,b:0 }; //000000

		a.equal(co(rgb1),'528ce0',"rgb1");
		a.equal(co(rgb2),'d2e0e6',"rgb2");
		a.equal(co(rgb3),'366097',"rgb3");
		a.equal(co(rgb4),'ffffff',"rgb4");
		a.equal(co(rgb5),'000000',"rgb5");
	});

	Q.test(" - [ convert(rgb) ]",function(a){
		var co = struct.convert('rgb');
	
		var hex1 = '528ce0', //528ce0
				hex2 = 'd2e0e6', //d2e0e6
				hex3 = '366097', //366097
				hex4 = 'ffffff', //ffffff
				hex5 = '000000'; //000000

		a.equal(eq(co(hex1),{r:82,g:140,b:224}),true,"hex1");
		a.equal(eq(co(hex2),{r:210,g:224,b:230}),true,"hex2");
		a.equal(eq(co(hex3),{r:54,g:96,b:151}),true,"hex3");
		a.equal(eq(co(hex4),{r:255,g:255,b:255}),true,"hex4");
		a.equal(eq(co(hex5),{r:0,g:0,b:0}),true,"hex5");
	});

	Q.test(" - [ convert(minus) ]",function(a){
		var co = struct.convert('minus');
	
		a.equal(co(1),-1,"minus 1");
		a.equal(co('1'),-1,"minus 1 string");
		a.equal(co(1.23),-1.23,"minus float");
		a.equal(co('1.23'),-1.23,"minus float string");
		a.equal(co('abc'),-0,"minus untype string");
		a.equal(co(-1),1,"minus -1");
	});

	
	Q.test(" - [ each(array),op(array) ]",function(a){
		var loop = struct.each('array');
		var check = [1,2,3,4];
		var res = []; 

		loop(check,function(v){
			res.push(v);
		});
		
		a.equal(eq(check,res),true,"loop array");
	});

	Q.test(" - [ each(object),op(object) ]",function(a){
		var loop = struct.each('object');
		var check = {a:1,b:2,c:3,d:4};
		var res = {}; 

		loop(check,function(val,key){
			res[key] = val;
		});
		
		a.equal(eq(check,res),true,"loop object");
	});

	Q.test(" - [ each(),op() ]",function(a){
		var loop = struct.each();
		var check = [1,2,3,4];
		var res = []; 
		var check1 = {a:1,b:2,c:3,d:4};
		var res1 = {}; 

		loop(check,function(v){
			res.push(v);
		});
		loop(check1,function(val,key){
			res1[key] = val;
		});
		
		a.equal(eq(check,res),true,"loop array");
		a.equal(eq(check1,res1),true,"loop object");
	});

	Q.test(" - [ index(first) ]",function(a){
		var first = struct.index("first");

		var arr = [1,2,3,4,1,2,3,4,5];
		var obj = { a:1, b:4, c:3, d:4 };

		a.equal(first(arr,1),0,"first index in array");
		a.equal(first(obj,4),'b',"first index in object");
	});

	Q.test(" - [ index(last) ]",function(a){
		var last = struct.index("last");

		var arr = [1,2,3,4,1,2,3,4,5];
		var obj = { a:1, b:4, c:3, d:4 };

		a.equal(last(arr,4),7,"last index in array");
		a.equal(last(obj,4),'d',"last index in object");
	});

	Q.test(" - [ index(one),(single) ]",function(a){
		var one = struct.index('single');
		var arr = [1,2,3,4,1,2,3,4,5];
		var strarr = ['abc','bca','adc','bcd','dab','cad'];
		var strobj = { abc:'abc',bac:'abc',123:'cad',abd:'abc' };

		a.equal(one(arr,function(v){ return v>4;}),5,"find first element in array");
		a.equal(one(strarr,/d/),'adc',"regexp first element in string array");
		a.equal(one(strobj,function(v,k){ return /^\d+/.test(k); }),'cad',"find by key regexp element in array");
	});

	Q.test(" - [ index() ]",function(a){
		var index = struct.index();
		var arr = [1,2,3,4,1,2,3,4,5];
		var obj = { a:1, b:4, c:3, d:4 };
		var strarr = ['abc','bca','adc','bcd','dab','cad'];
		var strobj = { abc:'abc',bac:'abc',123:'cad',abd:'abc' };

		a.equal(eq(index(arr,1),[0,4]),true,"index in array");
		a.equal(eq(index(arr,5),8),true,"one index in array");
		a.equal(eq(index(obj,3),'c'),true,"index in object");
		a.equal(eq(index(arr,function(v){ return v>3; }),[3,7,8]),true,"index filter in array");
		a.equal(eq(index(obj,function(v){ return v>3; }),['b','d']),true,"index filter in object");
		a.equal(eq(index(strarr,/ca$/),1),true,"index by regexp in array");
		a.equal(eq(index(strobj,/^ab/),['abc','bac','abd']),true,"index by regexp in object");
	});

	Q.test(" - [ map(key) ]",function(a){
		var mapkey = struct.map('key');
		var obj = { a:1,b:2,c:3,d:4 };
	
		a.equal(eq(mapkey(obj,function(v,k){ return k+v;}),{a1:1,b2:2,c3:3,d4:4}),true,"test mapkey");
		a.equal(eq(mapkey(obj,function(v,k){ return v+k;}),{'1a':1,'2b':2,'3c':3,'4d':4}),true,"test mapkey");
	});

	Q.test(" - [ map() ]",function(a){
		var map = struct.map();
		var obj = { a:1,b:2,c:3 };
		var arr = [1,2,3,4];
	
		a.equal(eq(map(arr,function(a){ return a+1; }),[2,3,4,5]),true,"map object");
		a.equal(eq(map(obj,function(a){ return a+1; }),{a:2,b:3,c:4}),true,"map object");
	});

	Q.test(" - [ map(hook) ]",function(a){
		var hook = struct.map("hook");
		var toNumber = struct.convert("number");
		var arr = ['1','2','3','4','5'];
		var arr2 = [1,2,3,4,5];
	
		a.equal(eq(hook(arr,toNumber),[1,2,3,4,5]),true,"hook arr like map");
		a.equal(eq(hook(arr,'toString'),arr),true,"hook arr use item's api");
	});
	
	Q.test(" - [ unique(fast) ]",function(a){
		var fu = struct.unique('fast');
		var arr = [1,2,3,4,1,2,3,4,5,2,3,4,5,6,1,7,2,4,5,6,8];
		var arr2 = ['acd','132','132','abc','acd','cad'];

		a.equal(eq(fu(arr),[1,2,3,4,5,6,7,8]),true,"unique pure number array");
		a.equal(eq(fu(arr2),['132','acd','abc','cad']),true,"unique pure string array");
	});

	Q.test(" - [ unique() ]",function(a){
		var fu = struct.unique();
		var arr = [1,2,3,4,1,2,3,4,5,2,3,4,5,6,1,7,2,4,5,6,8];
		var arr2 = ['acd','132','132','abc','acd','cad'];

		a.equal(eq(fu(arr),[1,2,3,4,5,6,7,8]),true,"unique pure number array");
		a.equal(eq(fu(arr2),['acd','132','abc','cad']),true,"unique pure string array");
	});

	Q.test(" - [ pairs(un) ]",function(a){
		var unpairs = struct.pairs('un');
		var arr = [['a',1],['b',2]];
		// unpairs([['a',1],['b',2]]) => {a:1,b:2}
	
		a.equal(eq(unpairs(arr),{a:1,b:2}),true,"unpairs array to object");
	});

	Q.test(" - [ pairs() ]",function(a){
		var pairs = struct.pairs();
		var o = {a:1,b:2};
	
		a.equal(eq(pairs(o),[['a',1],['b',2]]),true,"groupBy arr");
	});

	Q.test(" - [ pull(at) ]",function(a){
		var pull = struct.pull('at');
		var arr = [1,2,3,4,5];
	
		a.equal(eq(pull(arr,[1,2]),[1,4,5]),true,"pull array");
		a.equal(eq(pull(arr,1,2,4,3),[1]),true,"with mutip arguments");
	});

	Q.test(" - [ pull(with) ]",function(a){
		var pullwith = struct.pull('with');
		var arr = ['1','2',3,4,'d','e'];
		var arr2 = [3,4,5];
		var obj = { a:1,b:2,c:3,'123':321 };

		pullwith(obj,321);
		pullwith(arr2,3);
		pullwith(arr,/\d/);
		
		a.equal(obj['123'],void 0,"not filter obj");
		a.equal(arr2.length===2&&arr2[0]===4,true,"filter arr");
		a.equal(arr.length===2&&arr[0]==='d',true,"filter arr with regexp");
	});

	Q.test(" - [ pull() ]",function(a){
		var pull = struct.pull();
		var arr = [1,2,3,2,1,4,5,2,1,3,2,5,2];
		var arr2 = [1,2,3,2,1,4,'5',2,1,3,2,5,'2'];
	
		a.equal(eq(pull(arr,[1,2]),[3, 4, 5, 3, 5]),true,"pull array");
		a.equal(eq(pull(arr2,1,2,4,3),['5',5,'2']),true,"with mutip arguments");
	});

	Q.test(" - [ drop(),(left) ]",function(a){
		var dropLeft = struct.drop('left');
		var arr = [1,2,3,4,5];

		a.equal(eq(dropLeft(arr),[2,3,4,5]),true,"dropLeft without size");
		a.equal(eq(dropLeft(arr,4),[5]),true,"dropLeft with size");
	});

	Q.test(" - [ drop(right) ]",function(a){
		var dropRight = struct.drop('right');
		var arr = [1,2,3,4,5];

		a.equal(eq(dropRight(arr),[1,2,3,4]),true,"dropRight without size");
		a.equal(eq(dropRight(arr,4),[1]),true,"dropRight with size");
	});

	Q.test(" - [ drop(leftto) ]",function(a){
		var dlt = struct.drop('lefto');
		
		var arr = [4,3,2,1,-1,-2];
		var str = ['a2c','21b','382','db1'];

		a.equal(eq(dlt(arr,2),[1,-1,-2]),true,"dropLeftTo with value");
		a.equal(eq(dlt(arr,-1),[-2]),true,"dropLeftTo with minus");
		a.equal(eq(dlt(arr,function(v){ return v<1; }),[-2]),true,"dropLeft to use ite");
		a.equal(eq(dlt(str,/^\d+$/),['db1']),true,"dropLeftTo use regexp");
	});

	Q.test(" - [ drop(rightto) ]",function(a){
		var drt = struct.drop('righto');
		
		var arr = [4,3,2,1,-1,-2];
		var str = ['a2c','21b','382','db1'];

		a.equal(eq(drt(arr,2),[4,3]),true,"dropRightTo without size");
		a.equal(eq(drt(arr,-1),[4,3,2,1]),true,"dropRightTo without size");
		a.equal(eq(drt(arr,function(v){ return v<1; }),[4,3,2,1,-1]),true,"dropRightTo use ite");
		a.equal(eq(drt(str,/^\d+$/),['a2c','21b']),true,"dropRightTo use regexp");
	});

	Q.test(" - [ random(int) ]",function(a){
		var randomInt = struct.random('int');
		var val = randomInt(1,5);

		a.equal(val<=5&&val>=1,true,"random Int number");
		a.equal(val%1===0,true,"random number is int");
	});

	Q.test(" - [ random(float),(double) ]",function(a){
		var randomFloat = struct.random('float');
		var val = randomFloat(1,2);

		a.equal(val<=2&&val>=1,true,"random Float number");
		a.equal(val%1!==0,true,"random number is int");
	});

	Q.test(" - [ random(bool),(boolean) ]",function(a){
		var randomBool = struct.random('bool');
		var bool = randomBool();

		a.equal(typeof bool === 'boolean',true,"random boolean");
	});

	Q.test(" - [ random(char),(letter),(character) ]",function(a){
		var randomChar = struct.random('char');
		var idf = struct.type('identifier');
		var char = randomChar();

		a.equal(idf(char),true,"random letter");
		a.equal(char.length,1,"random letter as length 1");
	});

	Q.test(" - [ random(hex) ]",function(a){
		var randomHex = struct.random('hex');
		var idf = struct.type('identifier');
		var hex = randomHex();

		a.equal(hex.length,6,"random hex as length 6");
	});

	Q.test(" - [ random(date) ]",function(a){
		var randomDate = struct.random('date');

		a.equal(randomDate() instanceof Date,true,"new Date");
	});

	Q.test(" - [ param(parse) ]",function(a){
		var parse = struct.param("parse");

		var url1 = "https://www.google.com.sg/?gfe_rd=cr&ei=pX3bWLb8FaLnugS8iYqoAg";
		var url2 = "wd=wow%20178&rsv_spt=1&rsv_iqid=0x9f8c1cff00034e6e&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1";

		a.equal(eq(parse(url1),{
			gfe_rd:"cr",
			ei:"pX3bWLb8FaLnugS8iYqoAg"
		}),true,"test url1");

		a.equal(eq(parse(url2),{
			f:"8",
			ie:"utf-8",
			issp:"1",
			rqlang:"cn",
			rsv_bp:"1",
			rsv_enter:"1",
			rsv_idx:"2",
			rsv_iqid:"0x9f8c1cff00034e6e",
			rsv_spt:"1",
			tn:"baiduhome_pg",
			wd:"wow 178"
		}),true,"test url2");
	});

	Q.test(" - [ param(stringify),(string),(serialize) ]",function(a){
		var sfy = struct.param("stringify");
		
		a.equal(eq(sfy({
			wd:"wow 178",
			rsv_spt:"1",
			rsv_iqid:"0x9f8c1cff00034e6e",
			issp:"1",
			f:"8",
			rsv_bp:"1",
			rsv_idx:"2",
			ie:"utf-8",
			rqlang:"cn",
			tn:"baiduhome_pg",
			rsv_enter:"1"
		}),"wd=wow%20178&rsv_spt=1&rsv_iqid=0x9f8c1cff00034e6e&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1"),true,"stringify param");
	});

	Q.test(" - [ param(requery),(query) ]",function(a){
		var query = struct.param("query");
		var sdata = [
			{name:"abc",value:"213"},
			{name:"bca",value:"321"},
			{name:"cab",value:"231"}
		];
	
		a.equal(eq(query(sdata),{
			abc:"213",
			bca:"321",
			cab:"231"
		}),true,"query serializeArray Data");
	});

	Q.test(" - [ string(trim) ]",function(a){
		var trim = struct.string("trim");
		
		var str = "abc",
				str2 = "abc ",
				str3 = " abc",
				str4 = "  abc   ";
		
		a.equal(trim(str2),str,"trim right");
		a.equal(trim(str3),str,"trim left");
		a.equal(trim(str4),str,"trim all");
		a.equal(str3," abc","not change orgin");
	});

	Q.test(" - [ string(trimleft) ]",function(a){
		var trim = struct.string("trimleft");
		
		var str = "abc",
				str3 = " abc";
		
		a.equal(trim(str3),str,"trim left");
	});

	Q.test(" - [ string(trimright) ]",function(a){
		var trim = struct.string("trimright");
		
		var str = "abc",
				str2 = "abc ";
		
		a.equal(trim(str2),str,"trim right");
	});

	Q.test(" - [ string(camelize),(came) ]",function(a){
		var came = struct.string("camelize");
	
		var str = "font-size",
				str2 = "backEnd",
				str3 = "back-space";

		a.equal(came(str),"fontSize","camelize css");
		a.equal(came(str2),"backEnd","do not with camestring");
		a.equal(came(str3),"backSpace","camelize string");
	});

	Q.test(" - [ string(capitalize),(capit) ]",function(a){
		var capit = struct.string("capitalize");
	
		var str = "font-size",
				str2 = "backEnd",
				str3 = "back-space";

		a.equal(capit(str),"Font-size","capitlize css");
		a.equal(capit(str2),"BackEnd","capit word");
		a.equal(capit(str3),"Back-space","capit word");
	});

	Q.test(" - [ string(collapse)] ",function(a){
		var col = struct.string("collapse");
	
		var str = "  abc span  wdsd  eead ddddf>eq  ";
		var str2 = "<div> <img  src='' alt='sa d'  ><div> </ div> < /div >";
		a.equal(col(str),"abc span wdsd eead ddddf>eq","collapse string");
		a.equal(col(str2),"<div><img src='' alt='sa d'><div></div></div>","collapse html");
	});

	Q.test(" - [ string(rize),(rizewith)] ",function(a){
		var rize = struct.string("rize");
	
		var str = "fontSize";
		var str2 = "colorPicker";
		var str3 = "SmallHellBound";

		a.equal(rize(str),"font-size","rize css");
		a.equal(rize(str2),"color-picker","rize custom string");
		a.equal(rize(str3,'_'),"small_hell_bound","rize with underscore split");
		a.equal(rize(str3,'-',true),"Small-Hell-Bound","rize with uppercase cover");
	});

	Q.test(" - [ html(encode)] ",function(a){
		var encode = struct.html("encode");
		var str = "<s>";

		a.equal(encode(str),"&lt;s&gt;","encode string");
	});

	Q.test(" - [ html(decode)] ",function(a){
		var decode = struct.html("decode");
		var str = "&lt;s&gt;";

		a.equal(decode(str),"<s>","decode string");
	});

	Q.test(" - [ event(add),(on),(bind) ]",function(a){
		var on = struct.event("on");

		on(eventObj,"a",function(a){
			a.a=2;
			a.b=3;
		});
		on(eventObj,"b",noop);

		a.equal(typeof eventObj._eid,"number","add _events key");
		a.equal(typeof eventObj._eid,"number","add _events key a");
	});

	Q.test(" - [ event(emit),(trigger),(dispatch) ]",function(a){
		var emit = struct.event("emit");
		var obj = {};
		emit(eventObj,"a",[obj]);
		a.equal(obj.a===2&&obj.b===3,true,"detect event had emit");
	});

	Q.test(" - [ event(remove),(unbind) ]",function(a){
		var unbind = struct.event("unbind");
		var on = struct.event("on");
		var sb = {};

		on(sb,"a",function(a){});
		on(sb,"a",function(b){});
		on(sb,"b",function(){});
		on(sb,"c",function(){});

		unbind(sb,"a");
		unbind(sb,"b",noop);

		a.equal(typeof sb._eid,"number","remove event a");
		a.equal(typeof sb._eid,"number","not remove event b");
	});

	Q.test(" - [ event(has),(exist) ]",function(a){
		var has = struct.event("has");
		var on = struct.event("on");

		var sb = {};

		on(sb,"a",function(a){});
		on(sb,"a",function(b){});
		on(sb,"b",function(){});
		on(sb,"c",noop);

		a.equal(has(sb,"a"),true,"detect event a");
		a.equal(has(sb,"b",noop),false,"detect event b with noop");
		a.equal(has(sb,"c",noop),true,"detect event c with noop");
		a.equal(has(sb,"d",noop),false,"detect event c with noop");
		a.equal(has(sb,"d"),false,"detect event d exist");
	});

	Q.test(" - [ prop(get) ]",function(a){
		var get = struct.prop("get");
		
		var k = {
			a:{
				b:1
			},
			c:2,
			d:{
				e:{
					f:3
				}
			}
		};

		a.equal(get(k,"a.b"),1,"get a.b value");
		a.equal(get(k,"c","toString"),"2","get c value with toString");
		a.equal(get(k,"d.e.f"),3,"get deep[d.e.f] value");
		a.equal(eq(get(k,"d.e"),{f:3}),true,"get d.e value");
		a.equal(eq(get(k,"g")),true,"get undefined value");
	});

	Q.test(" - [ prop(set) ]",function(a){
		var set = struct.prop("set");

		var k = {};
		
		a.equal(eq(set(k,"a",{b:1}),{a:{b:1}}),true,"set obj key");
		a.equal(eq(set(k,"a.b",{c:3}),{a:{b:{c:3}}}),true,"set obj deep key");
		a.equal(eq(set(k,"a.b.c","pack"),{a:{b:{c:"pack"}}}),true,"set obj deep string");
	});

	Q.test(" - [ prop(not),(remove) ]",function(a){
		var not = struct.prop("not");

		var k = {
			a : {
				b :{
					c:[2,1,3]
				}
			}
		};
		
		a.equal(eq(not(k,"a.b.c.1"),{a:{b:{c:[2,3]}}}),true,"delete deep key");
		a.equal(eq(not(k,"a.b.c"),{a:{b:{}}}),true,"delete single key");
		a.equal(eq(not(k,"a"),{}),true,"delete all key");
	});

}).call(this,QUnit,struct);
console.timeEnd("struct pref");
