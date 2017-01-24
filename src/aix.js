/* 
 * aix.js
 *
 * pure Javascript MVC framwork
 * include:
 * [ model ]
 * [ collection ]
 * [ view ]
 * [ events ]
 *
 * *IE 9-Edge support
 *
 * @Author  : YIJUN
 * @Date    : 2016.6.22 - now
 * @Version : 0.1
 *
 * @License : Fuck any LISCENSE
 *
 * require Lib [ _ , jQuery or Other DOM lib ]
 *
 */

(function(root,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define(['_','z'],factory);
	else
		// build on browser global object
		root.aix = factory(_,z);

})( this , function(_,$){
	"use strict";

	var aix = {};
	
	var AIX_VIEW_COUNT = 0,
			AIX_ROUTE_COUNT = 0,
			AIX_MODELS_COUNT = 0,
			AIX_COLLECTION_COUNT = 0,

			AIX_VIEW_DEFAULT = { el : "", template : ""},
			AIX_ROUTE_DEFAULT = { routes:{}, actions:{} },
			AIX_MODELS_DEFAULT = { data:"" },
			AIX_COLLECTION_DEFAULT = { data:[], model: 0 };

	// resetful list 
	// use for aix ajax-api
	var RESTFUL_enable = {
		get    : "GET",
		put    : "PUT",
		save   : "POST",
		post   : "POST",
		pull   : "PULL",
		fetch  : "FETCH",
		update : "UPDATE",
		delete : "DELETE"
	};
	var RESTFUL_disable = {
		get    : "GET",
		put    : "POST",
		save   : "POST",
		post   : "POST",
		pull   : "POST",
		fetch  : "GET",
		update : "POST",
		delete : "POST"
	};
	// default with disable and emude RESTFUL_API
	var RESTFUL_LIST = RESTFUL_disable;

	// config for aix 
	// default with disable and emude RESTFUL_API
	aix.config = {
		restful : false
	};

	_.watch(aix.config,"restful",function(val){
		if(val)
			RESTFUL_LIST = RESTFUL_enable;
		else
			RESTFUL_LIST = RESTFUL_disable;
		return val;
	});
	
	var strip_comment = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

	// aix genertor function
	function _genertor_(api){
		return function(){
			var tmp = _.clonedoom(this.data);
			var args = [tmp].concat(_.slice(arguments));
			tmp = _[api].apply(tmp,args);
			if(!_.isequal(tmp,this.data)){
				this.data = tmp;
				this.dispatch(api,null,args);
			}
			return this;
		};
	}

	// not change rebase data
	function _genertor_$(api){
		return function(){
			var tmp = _.clonedoom(this.data);
			var args = [tmp].concat(_.slice(arguments));
			return _[api].apply(tmp,args);
		};
	}

	// change rebase data
	// change return data
	function _genertor__(api){
		return function(){
			var tmp = _.clonedoom(this.data);
			var args = [tmp].concat(_.slice(arguments));
			var res =  _[api].apply(tmp,args);
			if(!_.isequal(tmp,this.data)){
				this.data = tmp;
				this.dispatch(api,null,args);
			}
			return res;
		};
	}

	function hackaix(origin,extend){
		var fnstr = origin.toString(); 

		var oargs = origin.toString()
											.replace(strip_comment,'');
		var eargs = extend.toString()
											.replace(strip_comment,'');
		var body = fnstr.slice(
							 fnstr.indexOf("{") + 1, 
							 fnstr.lastIndexOf("}"));

		oargs = oargs.slice(oargs.indexOf('(')+1, oargs.indexOf(')'))
								 .match(/([^\s,]+)/g)[0];
		eargs = eargs.slice(eargs.indexOf('(')+1, eargs.indexOf(')'))
								 .match(/([^\s,]+)/g)[0];
  	
  	return [oargs||"",eargs||"",body];
	}

	function createExtend(origin){
		return function(def){
			var x = hackaix(aix[origin],aix[origin].extend);
			var extend = eval(
				"(function(ops){ "
				+ "var " + x[0] + "=_.extend(_.extend({},"+x[1]+"),ops||{}); "
				+  x[2]
				+ "})"
			);

			_.compose(extend.prototype,aix[origin].prototype);
			extend.prototype.constructor = extend;
			_.define(extend,"base",{
				value: aix[origin],
  			writable: false,
  			enumerable: false,
  			configurable: false
			});
			return extend;
		};
	}

	// Aix Model
	aix.model = function(obj){
		obj = obj || {};
		var _this = this;

		_.define(this,{
			aid : {
				value : (++AIX_MODELS_COUNT),
				writable : false,
				enumerable : false
			}
		});

		// define change param
		this.change = false;

		// if userobj has more events
		if(_.isObject(obj.events))
			_.foreach(obj.events,function(v,k){
				_.addEvent(this,k,v);
			},this);

		if(_.isFunction(obj.validate)){
			_.define(_this,"validate",{
				value : obj.validate,
  			writable: false,
  			enumerable: false,
  			configurable: false
			});
		}

		//delete undefault properties
		delete obj.validate;
		delete obj.change;
		delete obj.events;

		_.extend(
			this,
			_.extend(
				_.clone(AIX_MODELS_DEFAULT),obj
			)
		);

		//add listen for object data change
		_.watch(this,"data",function(nv,ov){
			// Validate checker for change
			if(_.isFunction(this.validate)){
				var vali = true;

				// validate status check
				if(_.isFunction(this.validate) ? 
					!this.validate.call(this,nv) : 0 )
					vali = false;

				if(vali){
					// trigger validate and success events
					if(!_.isequal(nv,ov)){
						_.dispatch(this,"change",null,[nv,ov]);
						this.change = true;
					}
					_.dispatch(this,"validate",null,[nv,ov]);
					_.dispatch(this,"validate:success",null,[nv,ov]);
					return nv;
				}else{
					// trigger validate and fail events
					_.dispatch(this,"validate",null,[nv,ov]);
					_.dispatch(this,"validate:fail",null,[nv,ov]);
					return ov;
				}

			}else{
				// No validate 
				if(!_.isequal(nv,ov)){
					_.dispatch(this,"change",null,[nv,ov]);
					this.change = true;
				}
				return nv;
			}
		}.bind(this));

		// first trgger "init" event
		_.dispatch(this,"init");
	};

	// Extend aix model method 

	// Model Prototype extend
	// model data usually define as pure data, not javascript event or function
	// because it much as MVC-M logs 
	aix.model.prototype = {
		constructor : aix.model,

		get : function(key){
			if(_.isString(key)||_.isNumber(key))
				return _.clone(this.data[key]||"");
			return _.clone(this.data);
		},

		set : function(){
			var args = _.slice(arguments);
			if(args.length>1){
				this.dispatch("change",
											null,
											[args[1],this.data[args[0]]]
										 );
				this.data[args[0]] = args[1];
			}else
				this.data = args[0];
			return this.dispatch("set",null,args);
		},

		// API event
		addEvent: function(type,fn){
			if(_.isFunction(fn))
				_.addEvent(this,type,fn);
			return this;
		},

		removeEvent : function(type,fn){
			return _.removeEvent(this,type,fn);
		},

		dispatch : function(type,fn,args){
			if(_.isArray(fn))
				args = fn, fn = null;
			return _.dispatch(this,type,fn,args);
		},

		trigger : function(){
			return this.dispatch.apply(this,arguments);
		},

		emit : function(){
			return this.dispatch.apply(this,arguments);
		},

		listen : function(prop,handler){
			if(_.isObject(this.data))
				_.watch(this.data,prop,handler);
			return this;
		},

		unlisten : function(prop){
			if(_.isObject(this.data))
				_.unwatch(this.data,prop);
			return this;
		},

		add : function(){
			// compose and format data as this.data
			var args = _.slice(arguments);
			var tmp = _.clone(this.data) , type = _.typeof(tmp);
			_.foreach(args,function(data){
				switch(type){
					case "number":
						tmp += _.isNumber(+data) ? +data : 0;
						break;
					case "string":
						tmp += data.toString();
						break;
					case "array":
						tmp = tmp.concat(data);
						break;
					case "object":
						if(_.isObject(data)) _.extend(tmp,data);
						break;
					default :
						break;
				}
				//default data must be object, else will not deel with this data
			});
			// trigger change event
			this.data = tmp;

			return this.dispatch("add",null,args);
		},

		// remove
		remove: function(){
			// only deel with Array and object
			var args = _.slice(arguments);
			var tmp = _.clone(this.data) , type = _.typeof(tmp);
			_.foreach(args,function(data){
				switch(type){
					case "string":
						tmp = tmp.replace(data.toString,"");
						break;
					case "array":
						if(_.isArray(data))
							_.foreach(data,function(e){ _.not(tmp,e); });
						else
							_.not(tmp,data);
						break;
					case "object":
						if(_.isArray(data))
							_.foreach(data,function(e){ delete tmp[e]; });
						else
							delete tmp[data];
						break;
					default:
						break;
				}
			});
			// trigger change event
			if(args.length)
				this.data = tmp;
			else
				this.data = null;
			return this.dispatch("remove",null,args);
		}
	};

	// Aix Collection
	aix.collection = function(obj){
		obj = obj||{};
		var _this = this;

		_.define(this,{
			cid : {
				value : (++AIX_COLLECTION_COUNT),
				writable : false,
				enumerable : false
			}
		});

		this.change = false;

		// if userobj has more events
		if(_.isObject(obj.events))
			_.foreach(obj.events,function(v,k){
				_.addEvent(this,k,v);
			},this);

		if(_.isFunction(obj.validate)){
			_.define(this,"validate",{
				value : obj.validate,
  			writable: false,
  			enumerable: false,
  			configurable: false
			});
		}

		//delete undefault properties
		delete obj.validate;
		delete obj.change;
		delete obj.events;

		_.extend(
			this,
			_.extend(
				_.clone(AIX_COLLECTION_DEFAULT)
				,obj
			)
		);
		
		// filter init data as this.model type
		if(this.model){
			this.data = _.filter(this.data,function(one){
				return one.constructor === this.model;
			}.bind(this));
		}

		//add listen for object data change
		_.watch(this,"data",function(nv,ov){
			// collection must be format as arr
			if(!_.isArray(nv))
				nv = [nv];

			// Validate checker for change
			if(_.isFunction(_this.validate)){
				var vali = true;

				_.foreach(nv,function(one){
					if(this.model ? (one.constructor !== this.model) : 0 )
						vali = false;

					if(_.isFunction(this.validate) ? 
						!this.validate.call(this,one) : 0 )
						vali = false;
				},this);

				// validate status check
				if(vali){
					// trigger validate and success events
					if(!_.isequal(nv,ov)){
						_.dispatch(this,"change",null,[nv,ov]);
						this.change = true;
					}
					_.dispatch(this,"validate",null,[nv,ov]);
					_.dispatch(this,"validate:success",null,[nv,ov]);
					return nv;
				}else{
					// trigger validate and fail events
					_.dispatch(this,"validate",null,[nv,ov]);
					_.dispatch(this,"validate:fail",null,[nv,ov]);
					return ov;
				}
			}else{
				// No validate 
				if(!_.isequal(nv,ov)){
					_.dispatch(this,"change",null,[nv,ov]);
					this.change = true;
				}
				return nv;
			}
		}.bind(this));

		// first trgger "init" event
		_.dispatch(this,"init");
	};

	aix.collection.prototype = {
		constructor : aix.collection,

		addEvent: function(type,fn){
			if(_.isFunction(fn))
				_.addEvent(this,type,fn);
			return this;
		},

		removeEvent : function(type,fn){
			return _.removeEvent(this,type,fn);
		},

		listen : function(prop,handler){
			if(_.isObject(this.data))
				_.watch(this.data,prop,handler);
			return this;
		},

		unlisten : function(prop){
			if(_.isObject(this.data))
				_.unwatch(this.data,prop);
			return this;
		},

		add : function(){
			var len = this.data.length;
			var args = _.slice(arguments);
			var tmp = _.slice(this.data);
			if(args.length)
				tmp = tmp.concat.apply(tmp,args);

			if(_.isequal(this.data,tmp))
				return this;

			this.data = tmp;
			return this.data.length === len ? 
		 				 this :
		 				 this.dispatch("add",null,args);
		},

		remove: function(it){
			var len = this.data.length;
			var tmp;
			if(_.isString(it)){
				tmp = _.slice(this.data);
				tmp = _.cat(tmp,function(item){
					return item.aid !== "#" + it;
				});
			}
			else if(_.isObject(it)){
				if(_.isFunction(this.model)){
					if(it instanceof this.model){
						tmp = _.slice(this.data);
						tmp = _.not(tmp,it);
					}
				}else{
					tmp = _.slice(this.data);
					tmp = _.not(tmp,it);
				}
			}

			if(tmp){
				this.data = tmp;
				return this.data.length === len ? 
							 this :
							 this.dispatch("remove",null,[it]);
			}
			return this;
		},

		get : function(id){
			if(_.isNumber(id))
				if(this.model)
					return _.filter(this.data,function(one){
						return one.aid === ("#"+id);
					});
				else
					return this.data[id];
			else if(_.isString(id)){
				if(this.model)
					return _.pluck(this.parse(),id);
				else
					return _.pluck(this.data,id);
			}else
				return _.slice(this.data);
		},

		set : function(data){
			this.data = _.isArray(data) ? data : [data];
			return this.dispatch("set",null,[data]);
		},

		dispatch : function(type,fn,args){
			if(_.isArray(fn))
				args = fn, fn = null;
			return _.dispatch(this,type,fn,args);
		},
	
		trigger : function(){
			return this.dispatch.apply(this,arguments);
		},

		emit:function(){
			return this.dispatch.apply(this,arguments);
		},

	};

	// #genertor api
	_.foreach([
		"loop",
		"foreach",
		"splice",
		"push",
		"unshift",
		"sort",
		"unique",
		"reject",
		"find",
		"filter",
		"map",
		"cat",
		"groupby",
		"toarray",
		"forarray",
		"pairs",
		"not",
		"hook",
		"bale",
		"pluck",
		"reverse",
		"shuffle",
		"merge",
		"compose"
	],function(api){
		aix.model.prototype[api]= _genertor_(api);
		aix.collection.prototype[api]= _genertor_(api);
	});

	_.foreach([
		"keys",
		"clone",
		"contain",
		"findindex",
		"has",
		"isequal",
		"requery",
		"typeof",
		"combom"
	],function(api){
		aix.model.prototype[api]=_genertor_$(api);
		aix.collection.prototype[api]= _genertor_$(api);
	});

	_.foreach([
		"pop",
		"shift"
	],function(api){
		aix.model.prototype[api]=_genertor__(api);
		aix.collection.prototype[api]= _genertor__(api);
	});

	// Aix Restful API design for
	// [Aix Model] data format serialize
	_.extend(aix.model.prototype,{
		toJSON : function(){
			if(_.isArray(this.data) || _.isObject(this.data))
				return JSON.stringify(this.data);
			return this.data;
		},

		parse : function(){
			return _.clone(this.data);
		},

		// Fetch mean Restful "GET"
		// fetch data form url with param
		pipe : function(type,url,param,fns,fnf,header){
			var _this = this,
			//param must be object typeof
			st = {
				type      : RESTFUL_LIST[type.toLowerCase()],
				aysnc     : true
			},
			_fns,_fnf,isFn = _.isFunction(param);

			// deel with arguments 
			if(_.isString(url)){
				st.url = url;
				st.param = isFn ? {} : (param || {});
				_fns = isFn ?  param : (fns || _.NULL);
				_fnf = isFn ? (fns || _.NULL) : (fnf || _.NULL);
			}else if(_.isObject(url)){
				st.url = _this.url || "/";
				st.param = isFn ? url : (param || {});
				_fns = isFn ?  param : (fns || _.NULL);
				_fnf = isFn ? (fns || _.NULL) : (fnf || _.NULL);
			}else{
				// no param
				st.url = _this.url || "/";
				_fns = _.NULL;
				_fnf = _.NULL;
			}

			// set http header param
			st.header = header||{};
			st.success  = function(responseText,xhr,event){
				// change the data before dispatch event;
				_fns.call(_this,responseText,xhr,event);
				_this.dispatch(type+":success",null,[responseText,xhr,event]);
			};
			st.fail = function(xhr,event){
				_fnf.call(_this,xhr,event);
				_this.dispatch(type+":fail",null,[xhr,event]);
			};

			// trigger ajax events
			var get_xhr = _.aix(st);
			return this.dispatch(type,null,[get_xhr]);
		},

		aget: function(url,param,fns,fnf,header){
			return this.pipe.apply(this,[
				"get",
				url||(this.url||""),
				param,
				fns,
				fnf,
				header
			]);
		},

		fetch: function(param,fns,fnf,header){
			return this.pipe.apply(this,[
				"fetch",
				(this.url||""),
				param,
				function(responseText,xhr,event){
					this.data = JSON.parse(responseText);
					(fns||_.NULL).call(this,responseText,xhr,event);
				},
				fnf,
				header
			]);
		},

		sync: function(){
			return this.fetch.apply(this,arguments);
		},

		post: function(url,param,fns,fnf,header){
		  return this.pipe.apply(this,[
		  		"post",
		  		url||(this.url||""),
		  		param || this.parse(),
		  		fns,
		  		fnf,
		  		header
			]);
		},

		save: function(fns,fnf,header){
		  return this.pipe.apply(this,["save",(this.url||""),this.parse(),fns,fnf,header]);
		}
	});

	// [Aix Collection] data format serialize
	_.extend(aix.collection.prototype,{
		toJSON : function(){
			var res = [];
			_.foreach(this.data,function(one){
				// aix.model or other flux data
				res.push(one.get ? one.get() : one);
			});

			return JSON.stringify(res);
		},

		parse : function(){
			return JSON.parse(this.toJSON());
		},

		pipe : function(type,url,param,fns,fnf,header){
			var _this = this,
			//param must be object typeof
			st = {
				type      : RESTFUL_LIST[type.toLowerCase()],
				aysnc     : true
			},
			_fns,_fnf,isFn = _.isFunction(param);

			// deel with arguments 
			if(_.isString(url)){
				st.url = url;
				st.param = isFn ? {} : (param || {});
				_fns = isFn ?  param : (fns || _.NULL);
				_fnf = isFn ? (fns || _.NULL) : (fnf || _.NULL);
			}else if(_.isObject(url)){
				st.url = _this.url || "/";
				st.param = isFn ? url : (param || {});
				_fns = isFn ?  param : (fns || _.NULL);
				_fnf = isFn ? (fns || _.NULL) : (fnf || _.NULL);
			}else{
				// no param
				st.url = _this.url || "/";
				_fns = _.NULL;
				_fnf = _.NULL;
			}
			st.header = header ||{};
			st.success  = function(responseText,xhr,event){
				_fns.call(_this,responseText,xhr,event);
				_this.dispatch(type+":success",null,[responseText,xhr,event]);
			};

			st.fail = function(xhr,event){
				_fnf.call(_this,xhr,event);
				_this.dispatch(type+":fail",null,[xhr,event]);
			};

			// trigger ajax events
			var get_xhr = _.aix(st);
			return this.dispatch(type,null,[get_xhr]);
		},

		aget: function(url,param,fns,fnf,header){
			return this.pipe.apply(this,[
				"get",
				url||(this.url||""),
				param,
				fns,
				fnf,
				header
			]);
		},

		fetch: function(param,fns,fnf,header){
			return this.pipe.apply(this,[
				"fetch",
				(this.url||""),
				param,
				function(responseText,xhr,event){
					var data = JSON.parse(responseText);
					if(this.model)
						_.foreach(data,function(val,index){
							data[index] = new this.model({ data : val });
						},this);
					this.data = data;
					(fns||_.NULL).call(this,responseText,xhr,event);
				},
				fnf,
				header
			]);
		},

		sync: function(){
			return this.fetch.apply(this,arguments);
		},

		post: function(url,param,fns,fnf,header){
		  return this.pipe.apply(this,[
				"post",
				url||(this.url||""),
				param || this.parse(),
				fns,
				fnf,
				header
			]);
		},

		save: function(fns,fnf,header){
		  return this.pipe.apply(this,[
				"save",
				(this.url||""),
				this.parse(),
				fns,
				fnf,
				header
			]);
		}
	});

	// bind selector
	$ = $ || _.NULL; 

	aix.view = function(obj){
		obj = obj || {};
		var _this = this;

		_.define(this,{
			vid : {
				value : (++AIX_VIEW_COUNT),
				writable : false,
				enumerable : false
			}
		});

		// if userobj has more events
		if(_.isObject(obj.events))
			_.foreach(obj.events,function(v,k){
				var type = k.split(":");
				if(type.length > 1)
					$(obj.el).on(type[0],type[1],{self:this},v);
				else
					_.addEvent(this,k,v);
			},this);

		// parse template
		if(!obj.template || _.isString(obj.template))
				obj.template = _.isFunction(obj.build)?
											 obj.build.call(this,obj.template||""):
											 _.doom(obj.template||"");
		if(!obj.render || !_.isFunction(obj.render)){
			obj.render = function(){ 
				return $(this.el)
								.html(this.template.apply(this,arguments)) && this;
			};
		}
			

		//delete undefault properties
		delete obj.change;
		delete obj.events;

		// ajax get html template
		if(_.isString(obj.url)){
			_.aix({
				url: obj.url,
				cache : _.isBoolean(obj.cache) ? obj.cache : true,
				success:function(text){
					obj.template = _.isFunction(obj.build) ? 
												 obj.build.call(_this,text):
												 _.doom(text);

					_.extend(_this,_.extend(_.clone(AIX_VIEW_DEFAULT),obj));
					_.dispatch(_this,"init");
				},
				fail:function(xhr){
					console.error("Fetch template url->[" + obj.url + "] has fail!" );
					console.log(xhr);
				}
			});
			return this;
		}

		_.extend(this,
			_.extend(
				_.clone(AIX_VIEW_DEFAULT)
				,obj
			)
		);

		// first trgger "init" event
		_.dispatch(this,"init");
	};

	aix.view.prototype = {
		
		addEvent : function(type,fn){
			var param = type.split(":");
			// DOM Element events
			if(param.length > 1)
				$(this.el).on(param[0],param[1],{self:this},fn);
			else
				_.addEvent(this,type,fn);
			return this;
		},

		removeEvent : function(type,fn){
			var param = type.split(":");
			// DOM Element events
			if(param.length > 1)
				$(this.el).off(param[0],param[1],fn);
			else
				_.removeEvent(this,type,fn);
			return this;
		},

		empty : function(){
			$(this.el).empty();
			return this;
		},

		release : function(){
			$(this.el).off();
			return this;
		},

		destroy : function(withRoot){
			$(this.el).off()[withRoot ? "remove" : "empty" ]();

			//lock this.el prop
			return Object.freeze(_.removeEvent(this));
		},

		dispatch : function(type,fn,args){
			if(_.isArray(fn))
				args = fn, fn = null;
			return _.dispatch(this,type,fn,args);
		},

		trigger : function(){
			return this.dispatch.apply(this,arguments);
		},

		emit:function(){
			return this.dispatch.apply(this,arguments);
		},
	};

	//get Hash param form URL
	function getHash(url){
		var index = url.search("#");
		return index>0?url.slice(index+1):"";
	}

	//if HashChange callee
	function changeHash(hash,oldhash,event){
		_.foreach(this.routes,function(fn,key){
			if(RegExp(key,"i").test(hash)){
				changeHashReg.call(this,fn,[event,hash,oldhash,key]);
			}
		},this);
	}

	// detect args callback
	function changeHashReg(fn,args){
		switch(_.typeof(fn)){
			case "function":
				fn.apply(this||_.root,args);
				break;
			default:
				// array or string
				_.foreach(
				_.isString(fn) ? fn.split(",") : fn,
				function(reg){
					this.actions[reg].apply(this||_.root,args);
				},this);
				break;
		}
	}

	// define route for SPA
	aix.route = function(obj){
		obj = obj || {};
		var _this = this;

		if(_.isObject(obj.events))
			_.foreach(obj.events,function(v,k){
				_.addEvent(this,k,v);
			},this);

		delete obj.events;

		_.extend(this,
			_.extend(
				_.clone(AIX_ROUTE_DEFAULT),
				obj
			)
		);

		// addEvent for this route object
		// use dispatch event to trigger
		_.addEvent(this,"hashchange",changeHash);

		// cant change regular hash title
		_.define(this, {
			"history" : {
				value : { 
					old: "" , 
					now: _.root.location.href
				},
				writable : true,
				enumerable : false
			},
			"rid" : {
				value : AIX_ROUTE_COUNT,
				writable : false,
				enumerable : false,
				configurable: false
			},
			"event" : {
				value : function(event){
					if(_.root.location.href===_this.history.now)
						return event.preventDefault();
					
					// change the save hash url
					_this.history.old = _this.history.now; 
					_this.history.now = _.root.location.href;

					return _.dispatch(_this,"hashchange",null,
						[getHash(_.root.location.href),
						 getHash(_this.history.old),
						 event]);
				},
				writable : false,
				enumerable : false,
				configurable: false
			}
		});

		_.dispatch(this,"init");
	};

	// Aix-Route for SPA Architecture
	// auto trigger regex event when route change
	aix.route.prototype = {
		constructor : aix.route,

		addEvent: function(type,fn){
			if(_.isFunction(fn))
				_.addEvent(this,type,fn);
			return this;
		},

		removeEvent : function(type,fn){
			return _.removeEvent(this,type,fn);
		},

		dispatch:function(type,fn,args){
			if(_.isArray(fn))
				args = fn, fn = null;
			return _.dispatch(this,type,fn,args);
		},

		trigger:function(){
			return this.dispatch.apply(this,arguments);
		},

		emit:function(){
			return this.dispatch.apply(this,arguments);
		},

		addRoute:function(route,fname){
			if(_.isString(fname)||_.isArray(fnname))
		 		this.routes[route] = fnname;
		 	return this;
		},

		removeRoute:function(route){
			delete this.routes[route];
			return this;
		},

		addAction:function(name,fn){
			if(_.isString(name)&&isFunction(fn))
				this.actions[name] = fn;
			return this;
		},

		removeAction:function(name){
			delete this.actions[name];
			return this;
		},

		listen: function(){
			if(!this._listen){
				_.define(this,"_listen",{
					value:1,
					writable : false,
					enumerable : false,
					configurable: true,
				});
				_.root.addEventListener("hashchange",this.event);
				this.dispatch("listen");
				this.dispatch("hashchange",null,[getHash(window.location.href)]);
			}
			return this;
		},

		stoplisten: function(){
			if(delete this._listen){
				_.root.removeEventListener("hashchange",this.event);
				this.dispatch("stoplisten");
			}
			return this;
		},

		assign : function(hash){
			if(this._listen){			
				var url = _.root.location.href; 
				var hashindex = url.search("#");
				if(hashindex > 0)
					url = url.slice(0,hashindex);

				_.root.location.href = url + (hash.toString().slice(0,1)==="#"?"":"#") + hash;
			}
			return this;
		},

		addhash : function(hash){
			var now = _.root.location.href + (hash||"").toString();
			if(now!==_.root.location.href)
				_.root.location.href = now;
			return this;
		},

	};



	// Aix-Component 
	// Bind the connect aix plug with 
	// -- aix.model
	// -- aix.view
	
	function linkConect(type,fn){
		var _link = function(){
			var args = arguments;

			// trigger _this bind fn;
			fn.apply(this,args);

			// if get connect list
			if(this._connect.length){
				_.loop(this._connect,function(component){
					_.dispatch(
						component,
						this.name+":"+type,
						null,
						[ this.model.parse ? 
							this.model.parse() :
							this.model].concat(_.slice(args))
					);
				},this);
			}
		};

		fn.link = _link;
		return _link;
	}

	function isSelfProp(str){
		return str.search("\\[")===0 && str.search("\\]")>-1;
	}
	
	aix.component = function(def){
		def = def || {};

		if(!def.name&&!_.isString(def.name))
			throw new TypeError("Aix-Comment must defined [name] property type to string.");

		var config = _.extend({
			model : aix.model,
			view : aix.view,
			// define events for Component 
			events : {} 
		},def||{});
		
		// define propertise
		_.define(this,{
			model : {
				value : _.isFunction(config.model) ? 
								new config.model :
								config.model,
				writable : false,
				enumerable : true,
				configurable : false
			},

			view : {
				value : _.isFunction(config.view) ? 
								new config.view : 
								config.view,
				writable : false,
				enumerable : true,
				configurable : false
			},

			// connect Component Object
			_connect :{
				value : [],
				writable : false,
				enumerable : false,
				configurable : false
			}
		});

		// bind events
		_.loop(config.events,function(fn,key){
			this.addEvent(key,fn);
		},this);

		delete config.el;
		delete config.model;
		delete config.view;
		delete config.events;

		// bind extra propertise;
		_.compose(this,config);

		_.dispatch(this,"init");
	};

	aix.component.prototype = {
		addEvent:function(type,fn){
			if(isSelfProp(type)){
				var comand = type.split("|");
				
				var mtype = comand[0].substr(1,comand[0].length-2);
				var ename = comand[1];

				if(this[mtype]!=null){
					if(_.isFunction(this[mtype].addEvent))
						return this[mtype].addEvent(ename,fn.bind(this));
					else
						return _.addEvent(this[mtype],ename,fn.bind(this));
				}

				return;
			}

			return _.addEvent(this,type,linkConect(type,fn));
		},

		removeEvent:function(type,fn){
			if(isSelfProp(type)){
				var comand = type.split("|");
				
				var mtype = comand[0].substr(1,comand[0].length-2);
				var ename = comand[1];

				if(this[mtype]!=null){
					if(_.isFunction(this[mtype].removeEvent))
						return this[mtype].removeEvent(ename,fn.bind(this));
					else
						return _.removeEvent(this[mtype],ename,fn.bind(this));
				}
				return;
			}

			return _.removeEvent(this,type,fn.link||fn);
		},

		dispatch:function(type,fn,args){
			if(_.isArray(fn))
				args = fn, fn = null;
			return _.dispatch(this,type,fn,args);
		},

		trigger:function(){
			return this.dispatch.apply(this,arguments);
		},

		emit:function(){
			return this.dispatch.apply(this,arguments);
		},

		connect:function(aixc){
			var list = _.isArray(aixc) ? aixc : [aixc];
		
			_.loop(list,function(component){
				if(component!=null)
					if(_.isObject(component)){
						this._connect.push(component);
						if(_.isArray(component._connect))
							component._connect.push(this);
					}
			},this);

			return this;
		}
	
	};

	// Extend method
	// Create Aix Pack extends
	aix.view.extend       = createExtend("view");
	aix.model.extend      = createExtend("model");
	aix.route.extend      = createExtend("route");
	aix.component.extend  = createExtend("component");
	aix.collection.extend = createExtend("collection");

	return aix;
});

