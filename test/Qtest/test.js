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

	Q.test("method - [ has ]",function(a){
	
		var l = [1,23,4,5,"k",2,4,6,1,"sad",2,"fun"];
		a.equal(_.has(l,"sad"),true,"detect has string in array success")

		var fn = function(){};
		var s = { k:"k" }
		var l2 = [1,23,4,s,"k",2,fn,4,6,1,"sad",2,"fun"];
		a.equal(_.has(l2,fn)&&_.has(l2,s),true,"detect function && object success");

		var s2 = { K:"k"}
		var l3 = [1,2,5,{k:"k"},{k:1},fn,]
		a.equal(_.has(l3,s2),false,"strict mode has not detect object pointer");
	});

	Q.test("method - [ filter ]",function(a){
		var l = [1,2,3,4,5,6]
		var list = _.filter(l,function(n){ return n%2===0 });

		a.equal(list.length,3,"array filter only three even number "+list.toString())
		a.equal(_.has(list,2),true,"detect array filter even number success")
		a.equal(_.has(list,1),false,"detect array filter no contain odd number success")

		var ob = { a:1,b:2,c:3,d:4,e:5,f:6 };
		var list2 = _.filter(ob,function(n){ return n%2!==0 })
		a.equal(list2.length,3,"object filter only tree odd number "+list2.toString())
		a.equal(_.has(list2,2),false,"detect object filter no contain even number success")
		a.equal(_.has(list2,1),true,"detect array filter odd number success")
	});

	Q.test("method - [ reject ]",function(a){
		var l = [1,2,3,4,5,6]
		var list = _.reject(l,function(n){ return n%2===0 });

		a.equal(list.length,3,"array reject only three odd number "+list.toString())
		a.equal(_.has(list,2),false,"detect array reject not contain even number success")
		a.equal(_.has(list,1),true,"detect array reject odd number success")

		var ob = { a:1,b:2,c:3,d:4,e:5,f:6 };
		var list2 = _.reject(ob,function(n){ return n%2!==0 })
		a.equal(list2.length,3,"object reject only tree even number "+list2.toString())
		a.equal(_.has(list2,2),true,"detect object reject even number success")
		a.equal(_.has(list2,1),false,"detect array reject no contain odd number success")
	});

	Q.test("method - [ map ]",function(a){
		var l = [1,2,3,4,5]
		_.map(l,function(val){ return val*2 });

		a.equal(l.length,5,"map won't change the array length");
		a.equal(l[l.length-1],10,"map to change the val 5 -> " + l[l.length-1]);
	
		var o = { a:1,b:2,c:3,d:4 }
		_.map(o,function(val){ return val-1; })
		a.equal(_.keys(o).length,4,"map won't change the object keys length")
		a.equal(o.b===1&&o.d===3,true,"detect object maping change");
	});

	Q.test("method - [ cat ]",function(a){
		var l = [1,2,3,4,5];
		var list = _.cat(l,function(n){ return n-1 })

		a.equal(list.length,4,"cat array identity be trusity push to list -> " + list.toString())
		a.equal(l.length,1,"cat origin array list with now -> " + l.toString())

		var o = { a:1,b:2,c:3,d:4 }
		var olist = _.cat(o,function(n){ return n%2 });
		a.equal((!o.a&&!o.c)===true,true,"cat origin object detect property removed! to json -> "+JSON.stringify(o))
		a.equal(olist.length,2,"cat return object content to json -> "+ JSON.stringify(olist))
	});

	Q.test("method - [ findindex ]",function(a){
		var l = [1,2,3,4,5];

		var indexs = _.findindex(l,function(n){ return n%2 });
		a.equal(indexs.length,3,"get array current indexs length");
		a.equal(!indexs[0]&&indexs[indexs.length-1]===4,true,"findindex filter the odd position -> " + indexs.toString());

		var o = { a:1,b:2,c:3,d:4 }
		var oindexs = _.findindex(o,function(n){ return n%2===0 });
		a.equal(oindexs.length,2,"get object current indexs length");
		a.equal(oindexs[oindexs.length-1]==="d",true,"findindex filter the object.key position -> " + oindexs.toString());
	});

	Q.test("method - [ hook ]",function(a){
		var l = [1,2,3,4,5]
		_.hook(l,"toString");

		a.equal(l.length,5,"hook won't change the array length");
		a.equal(l[l.length-1],"5","hook toString to change the number 5 -> " + _.typeof(l[l.length-1]));
	
		var o = { a:[3,2,1],b:[2,1,3],c:[4,1,3],d:[3,5,2] }
		_.hook(o,"sort")
		a.equal(_.keys(o).length,4,"hook won't change the object keys length")
		a.equal(o.a[0]===1&&o.d[2]===5,true,"detect object hooking change -> " + JSON.stringify(o));
	});

	Q.test("method - [ bind ]",function(a){
		var k = { log:function(){ return this.a+1 },a:1 };
		var b = { log:function(){ return this.a} ,a:6 };
		
		a.equal(k.log(),k.a+1,"a not bind will trigger get itself");
		a.equal(b.log(),b.a,"b not bind will trigger get itself");

		_.bind(b,k);

		a.equal(b.log(),k.a,"b's function bind pointer to object[k] will get value " + k.a);
	
	});

	Q.test("method - [ reverse ]",function(a){
		var l = [1,2,3,4];
		l = _.reverse(l);
		
		a.equal(l[2],2,"array has been reverse");

		var k = function(){};
		a.equal(_.reverse(k),k,"typeof not array will return itself");
	});

	Q.test("method - [ pluck ]",function(a){
		var list = [{a:1,b:2,c:3},{a:2,b:4},{a:"a",b:"b",c:"c"},{a:"ax",b:"bb",c:"cs"}]

		var p = _.pluck(list,"c");
		a.equal(p.length,list.length-1,"pluck get current key data -> "+p.toString());
		a.equal(_.has(p,"cs"),true,"pluck get last c:cs value in result");
	})

})(QUnit,_,__,aix);
