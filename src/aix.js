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
 * @Date    : 2016.6.22
 * @Version : 0.1
 *
 * @License : Fuck any LISCENSE
 *
 * require Lib [ _ , jQuery or Other DOM lib ]
 */

(function(root,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define(['_','__'],factory);
	else
		// build on browser global object
		root.aix = factory(_,__);

})( this , function(_,$){
	"use strict";

	var aix = {};
	
	var AIX_VIEW_COUNT = 0,
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
		post   : "POST",
		pull   : "PULL",
		fetch  : "FETCH",
		update : "UPDATE",
		delete : "DELETE"
	};
	var RESTFUL_disable = {
		get    : "GET",
		put    : "POST",
		post   : "POST",
		pull   : "POST",
		fetch  : "GET",
		update : "POST",
		delete : "POST"
	};
	// default with disable and emude RESTFUL_API
	var RESTFUL_LIST = RESTFUL_disable;

	// log the prefernce
	aix.aixpref = function(){
		return {
			count:{
				views : AIX_VIEW_COUNT,
				models : AIX_MODELS_COUNT,
				collections : AIX_COLLECTION_COUNT
			}
		};
	};

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
		}
	}

	// Aix Model
	aix.model = function(obj){
		var _this = this;

		_.define(this,{
			aid : {
				value : "#"+(++AIX_MODELS_COUNT),
				writable : true,
				enumerable : false
			},
			change : {
				value : false,
				writable : true,
				enumerable : false
			}
		});

		// if userobj has more events
		if(_.isObject(obj.events))
			_.foreach(obj.events,function(v,k){
				_.addEvent(_this,k,v);
		});

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

		_.extend(_this,_.extend(_.clone(AIX_MODELS_DEFAULT),obj));

		//add listen for object data change
		_.watch(_this,"data",function(nv,ov){
			// Validate checker for change
			if(_.isFunction(_this.validate)){
				var vali = true;

				if(_.isFunction(_this.validate) ? !_this.validate.call(_this,nv) : 0 )
					vali = false;

				// validate status check
				if(vali){
					// trigger validate and success events
					if(!_.isequal(nv,ov)){
						_.dispatch(_this,"change",null,[nv,ov]);
						_this.change = true;
					}
					_.dispatch(_this,"validate",null,[nv,ov]);
					_.dispatch(_this,"validate:success",null,[nv,ov]);
					return nv;
				}else{
					// trigger validate and fail events
					_.dispatch(_this,"validate",null,[nv,ov]);
					_.dispatch(_this,"validate:fail",null,[nv,ov]);
					return ov;
				}
			}else{
				// No validate 
				if(!_.isequal(nv,ov)){
					_.dispatch(_this,"change",null,[nv,ov]);
					_this.change = true;
				}
				return nv;
			}
		});

		// first trgger "init" event
		_.dispatch(_this,"init");
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
			return _.dispatch(this,type,_.isFunction(fn) ? fn : null , args);
		},

		trigger : function(type,fn,args){
			return this.dispatch(type,fn,args);
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
		var _this = this;

		_.define(_this,{
			cid : {
				value : "#"+(++AIX_COLLECTION_COUNT),
				writable : true,
				enumerable : false
			},
			change : {
				value : false,
				writable : true,
				enumerable : false
			}
		});

		// if userobj has more events
		if(_.isObject(obj.events))
			_.foreach(obj.events,function(v,k){
				_.addEvent(_this,k,v);
		});

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

		_.extend(_this,_.extend(_.clone(AIX_COLLECTION_DEFAULT),obj));
		
		// filter init data as this.model type
		if(_this.model){
			_this.data = _.filter(_this.data,function(one){
				return one.constructor === _this.model;
			});
		}

		//add listen for object data change
		_.watch(_this,"data",function(nv,ov){
			// collection must be format as arr
			if(!_.isArray(nv))
				nv = [nv];

			// Validate checker for change
			if(_.isFunction(_this.validate)){
				var vali = true;

				_.foreach(nv,function(one){
					if(_this.model ? (one.constructor !== _this.model) : 0 )
						vali = false;
					if(_.isFunction(_this.validate) ? !_this.validate.call(_this,one) : 0 )
						vali = false;
				});

				// validate status check
				if(vali){
					// trigger validate and success events
					if(!_.isequal(nv,ov)){
						_.dispatch(_this,"change",null,[nv,ov]);
						_this.change = true;
					}
					_.dispatch(_this,"validate",null,[nv,ov]);
					_.dispatch(_this,"validate:success",null,[nv,ov]);
					return nv;
				}else{
					// trigger validate and fail events
					_.dispatch(_this,"validate",null,[nv,ov]);
					_.dispatch(_this,"validate:fail",null,[nv,ov]);
					return ov;
				}
			}else{
				// No validate 
				if(!_.isequal(nv,ov)){
					_.dispatch(_this,"change",null,[nv,ov]);
					_this.change = true;
				}
				return nv;
			}
		});

		// first trgger "init" event
		_.dispatch(_this,"init");
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
			if(_.isString(id)||_.isNumber(id))
				return _.filter(this.data,function(one){
					return one.aid === ("#"+id);
				});
			else
				return _.slice(this.data);
		},

		set : function(data){
			this.data = _.isArray(data) ? data : [data];
			return this.dispatch("set",null,[data]);
		},

		dispatch : function(type,fn,args){
			return _.dispatch(this,type,_.isFunction(fn) ? fn : null , args);
		},
	
		trigger : function(type,fn,args){
			return this.dispatch(type,fn,args);
		}

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
		pipe : function(type,url,param,fns,fnf){
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

		aget: function(url,param,fns,fnf){
			fns = _.isFunction(fns) ?  fns : _.NULL;
			fnf = _.isFunction(fnf) ?  fnf : _.NULL;
			return this.pipe.apply(this,["get",url||(this.url||""),param,fns,fnf]);
		},

		fetch: function(param,fns,fnf){
			fns = _.isFunction(fns) ?  fns : _.NULL;
			fnf = _.isFunction(fnf) ?  fnf : _.NULL;
			return this.pipe.apply(this,["fetch",(this.url||""),param,function(responseText,xhr,event){
				this.data = JSON.parse(responseText);
				fns.call(this,responseText,xhr,event);
			},fnf]);
		},

		sync: function(){
			return this.fetch.apply(this,_.slice(arguments));
		},

		post: function(url,param,fns,fnf){
			fns = _.isFunction(fns) ?  fns : _.NULL;
			fnf = _.isFunction(fnf) ?  fnf : _.NULL;
		  return this.pipe.apply(this,["post",url||(this.url||""),param || this.parse(),fns,fnf]);
		},

		save: function(){
			return this.post.apply(this,_.slice(arguments));
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

		pipe : function(type,url,param,fns,fnf){
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

		aget: function(url,param,fns,fnf){
			fns = _.isFunction(fns) ?  fns : _.NULL;
			fnf = _.isFunction(fnf) ?  fnf : _.NULL;
			return this.pipe.apply(this,["get",url||(this.url||""),param,fns,fnf]);
		},

		fetch: function(param,fns,fnf){
			fns = _.isFunction(fns) ?  fns : _.NULL;
			fnf = _.isFunction(fnf) ?  fnf : _.NULL;

			return this.pipe.apply(this,["fetch",(this.url||""),param,function(responseText,xhr,event){
				var data = JSON.parse(responseText);
				if(this.model)
					_.foreach(data,function(val,index){
						data[index] = new this.model({ data : val });
					},this);
				this.data = data;
				fns.call(this,responseText,xhr,event);
			},fnf]);
		},

		sync: function(){
			return this.fetch.apply(this,_.slice(arguments));
		},

		post: function(url,param,fns,fnf){
			fns = _.isFunction(fns) ?  fns : _.NULL;
			fnf = _.isFunction(fnf) ?  fnf : _.NULL;
		  return this.pipe.apply(this,["post",url||(this.url||""),param || this.parse(),fns,fnf]);
		},

		save: function(){
			return this.post.apply(this,_.slice(arguments));
		}
	});

	// bind selector
	$ = $ || _.NULL; 

	aix.view = function(obj){
		obj = obj || {};
		if(!_.isString(obj.el))
			return console.error("view must define its 'el' prop bind with elm (custom string)");

		var _this = this;

		_.define(_this,{
			vid : {
				value : "#"+(++AIX_VIEW_COUNT),
				writable : true,
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
					_.addEvent(_this,k,v);
			},this);

		// parse template
		if(!obj.template || _.isString(obj.template))
				obj.template = _.isFunction(obj.build)?
											 obj.build.call(_this,obj.template||""):
											 _.doom(obj.template||"");
		if(!obj.render || !_.isFunction(obj.render)){
			obj.render = function(data){ 
				return $(this.el).html(this.template(data)) && this;
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

		_.extend(_this,_.extend(_.clone(AIX_VIEW_DEFAULT),obj));
		// first trgger "init" event
		_.dispatch(_this,"init");
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
		},

		dispatch : function(type,fn,args){
			return _.dispatch(this,type,_.isFunction(fn) ? fn : null , args);
		},

		trigger : function(){
			return this.dispatch.apply(this,_.slice(arguments));
		}
	};

	//get Hash param form URL
	var getHash = aix.getHash = function(url){
		var index = url.search("#");
		return index>0?url.slice(index+1):"";
	};

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
				_.addEvent(_this,k,v);
			});

		delete obj.events;

		_.extend(this,_.extend(_.clone(AIX_ROUTE_DEFAULT),obj));

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
				value : "aix-route-"+Math.random(),
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

		_.dispatch(_this,"init");
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
			return _.dispatch(this,type,fn,args);
		},

		addRoute:function(route,fname){
			if(_.isString(fname)||_.isArray(fnname))
		 		this.routes[route] = fnname
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

		stop: function(){
			if(delete this._listen){
				_.root.removeEventListener("hashchange",this.event);
				this.dispatch("stop");
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

	aix.model.extend      = createExtend("model");
	aix.collection.extend = createExtend("collection");
	aix.view.extend       = createExtend("view");
	aix.route.extend      = createExtend("route");

	return aix;

});

