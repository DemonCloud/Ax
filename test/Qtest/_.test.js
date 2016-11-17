(function(Q,_,__,aix){

	Q.module("[ _ ]");

	Q.test("method - [ define ]",function(a){
		var k = {};

		_.define(k,"init",{
			value:1,
			writable:true,
			configurable:true,
			enumerable:false
		})
		a.equal(k.init,1,"define single key success!");

		_.define(k,{
			"a":{
				value:1,
				writable:true,
				configurable:true,
				enumerable:false
			},

			"b":{
				value:2,
				writable:true,
				configurable:true,
				enumerable:false
			}
		});
		a.equal(k.a,1,"define mutip key success!")
	});

	Q.test("method - [ extend , compose ]",function(a){
		var _k = function(){};
		_.extend({ qtest : _k });
		a.equal(_.qtest,_k,"extend new method on _ success!");

		var k = { a:1 };
		_.extend(k,{ b:2 })
		a.equal(k.b,2,"extend compose origin object success!")
		
		var k2 = { a:1,b:2 }
		_.extend(k2,{c:2,d:3,isIgnore:true},["isIgnore"]);
		a.equal(!k2.isIgnore,true,"extend compose ignore define key success!")
	});

	Q.test("method - [ isObject ]",function(a){
		var k = {};
		a.equal(_.isObject(k),true,"isObject test pure object");

		var k2 = "s";
		a.equal(_.isObject(k2),false,"isObject detect string is not object");
	});

	Q.test("method - [ cool ]",function(a){
		var k = {};
		a.equal(_.cool(k),k,"cool return same value pointer");
	});

	Q.test("method - [ foreach ]",function(a){
		var k = 0;
		_.foreach([1,2,3,4],function(num){
			k += num;
		});
		a.equal(k,10,"array loop return assign true value");

		var c = 0;
		_.foreach({ a:1,b:2,c:3 },function(val){
			c+= val;
		});
		a.equal(c,6,"object loop return assign detect success!");

		var len = 0;
		_.foreach([5,3,6,7],function(num,i){
			len = i;
		});
		a.equal(len,3,"detect index assign true");


		var fn = function(){};
		var vali;
		_.foreach({ a:1,b:2,c:3,d:4 },function(num,key){
			vali = this;
		},fn);
		a.equal(vali,fn,"loop bind context detect!");

		var v = true
		_.foreach({},function(num,i){
			v = false;
		});
		_.foreach([],function(num,key){
			v = false;
		});
		a.equal(v,true,"empty length array or object won't trigger loop!")
	});

	Q.test("method - [ keys ]",function(a){
		var k = [1,2,3,4];
		var vali = true;

		_.foreach(_.keys[k],function(n,i){
			if((n+1)!==k[i])
				vali = false;
		});

		a.equal(vali,true,"keys array return its index array match");

		var k2 = { a:1,b:2,c:3 };
		var k2keys = _.keys(k2);

		a.equal(k2keys.length,3,"detect keys an object length!");
		a.equal(k2keys[2],"c","get current key form keys array!");
	});

	Q.test("method - [ slice ]",function(a){
		a.equal(_.slice("").length,0,"slice empty string return new array");
		a.equal(_.slice(_.NULL).length,0,"slice function return new array");

		var c = [1,2,3];
		a.equal(_.slice(c)[1],2,"slice array get same value");
		a.equal(_.slice(c)!==c,true,"slice is copy op detect");
	});
	
	Q.test("method - [ splice ]",function(a){
		var k = _.splice([1,2,3],0,2);
		a.equal(k[0],3,"splice offset two num in array");
		a.equal(k.length,1,"splice cat array success!");
	
		var s = { k : true };
		a.equal(_.splice(s,"k").k == null, true,"splice delete object key detect" );
	});

	Q.test("method - [ clone ]",function(a){
		var k = [1,2,3,4];
		var o = { a:1,b:2,c:3 }
		a.equal(_.clone(k)!==k,true,"clone array not equal to origin!")
		a.equal(_.clone(o)!==o,true,"clone object not equal to origin!")

		var kc = _.clone(k);
		var vali = true;
		_.foreach(kc,function(n,i){
			if(n!==k[i])
				vali = false;
		});

		var oc = _.clone(o);
		var voli = true;
		_.foreach(oc,function(n,k){
			if(o[k]==null || n!==o[k])
				voli = false;
		});

		a.equal(vali,true,"clone array as same values")
		a.equal(voli,true,"clone object as same values and keys")
	});

	Q.test("method - [ clonedoom ]",function(a){
		var k = [1,2,3,4];
		var o = { a:1,b:2,c:3 }
		a.equal(_.clonedoom(k)!==k,true,"clone array not equal to origin!")
		a.equal(_.clonedoom(o)!==o,true,"clone object not equal to origin!")

		var kc = _.clonedoom(k);
		var vali = true;
		_.foreach(kc,function(n,i){
			if(n!==k[i])
				vali = false;
		});

		var oc = _.clonedoom(o);
		var voli = true;
		_.foreach(oc,function(n,k){
			if(o[k]==null || n!==o[k])
				voli = false;
		});

		a.equal(vali,true,"clone array as same values")
		a.equal(voli,true,"clone object as same values and keys")

		var ofn = { c : function(n){ return n*2 } };
		var oo = _.clonedoom({ a:1,b:2,c:ofn });
		a.equal(oo.c.c(2),4,"clonedoom for deepclone with function")
		a.equal(oo.c!==ofn,true,"clonedoom for deepclone with object detect not pointer to origin object");
	});
	
	Q.test("method - [ sort ]",function(a){
		var k = [4,2,3,0,1];
		var vali = true;

		_.foreach(_.sort(k),function(n,i){
			if(n!==i)
				vali = false;
		});
		a.equal(vali,true,"sort as normal array sort result");

		var f = _.NULL;
		a.equal(_.sort(f),_.NULL,"sort excpet array will return itself");
	});

	Q.test("method - [ unique ]",function(a){
	
		var l = [5,7,1,3,2,4,4,3,1,4,2,1,5,8,7,9,8,2,4,6,2]
		var ul = _.unique(l);
		a.equal(ul===l,true,"unique dump array for itself")
		a.equal(ul.length,9,"unique dump value success!")

		var fn = function(n){ return n+1;};
		var fn2 = function(m){ return m+1;};
		var fl = _.unique([fn,fn2,fn2,{b:2},fn,2,fn2,2,{a:1}]);
		a.equal(fl.length,5,"unique dump with function assign")
		a.equal(fl[0](1),2,"unique function save only current")
	});

})(QUnit,_,__,aix);
