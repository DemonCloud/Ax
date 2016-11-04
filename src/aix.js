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
 * @License : MIT
 *
 * require Lib [ _ , jQuery or Other DOM lib ]
 *
 */

(function(root,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define(factory);
	else if(typeof exports === "object")
		// support NodeJS exports
		module.exports = factory(_,__);
	else
		// build on browser global object
		root.aix = factory(_,__);

})( this , function(_,$){
	'use strict';

	var aix = {};
	
	var AIX_MODELS_COUNT = 0;
	var AIX_MODELS_DEFAULT = {
		data:""
		//events : {
		// init : 					[@function || @array[@fn]]   #init Event when model to be new
		// change : *       [@function || @array[@fn]]   #when change data value will trigger
		// custom event :   [@function || @array[@fn]]   #custom [ model.addevent or model.dispatch ] api 
		//}
	};

	var AIX_COLLECTION_COUNT = 0;
	var AIX_COLLECTION_DEFAULT = {
		data:[],
		model: 0
		//events : {
		// init : 					[@function || @array[@fn]]   #init Event when model to be new
		// change : *       [@function || @array[@fn]]   #when change data value will trigger
		// custom event :   [@function || @array[@fn]]   #custom [ model.addEvent or model.dispatch ] api 
		//}
	};

	var AIX_VIEW_COUNT = 0;
	var AIX_VIEW_DEFAULT = {
		el : "",
		template : ""
	};

	// log the prefernce
	aix.pref = function(){
		return {
			count:{
				views : AIX_VIEW_COUNT,
				models : AIX_MODELS_COUNT,
				collections : AIX_COLLECTION_COUNT
			},
			setting:{
				view : _.clone(AIX_VIEW_DEFAULT),
				models : _.clone(AIX_MODELS_DEFAULT),
				collection : _.clone(AIX_COLLECTION_DEFAULT)
			}
		};
	};

	// Aix model format
	// you can define Data as : 
	//
	// { 
	//	 aid : 		 [@string]{""}  						# signet id for search ,
	//	 data : 	 [@string]{""}							# object data or array data. save the mode 
	// }
	//
	aix.model = function(obj){
		var _this = this;

		_.define(_this,{
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

		//delete undefault properties
		delete obj.change;
		delete obj.events;

		_.extend(_this,_.extend(_.clone(AIX_MODELS_DEFAULT),obj));

		//add listen for object data change
		_.watch(_this,"data",function(nv,ov){
			// Validate checker for change
			if(_this.validate){
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

	
	// aix model genertor function
	function _genertor_(api){
		return function(){
			var tmp = _.clonedoom(this.data);
			var args = [tmp].concat(_.slice(arguments));
			tmp = _[api].apply(tmp,args);
			if(!_.isequal(tmp,this.data))
				this.data = tmp;
			return this;
		};
	}

	function _genertor_$(api){
		return function(){
			var tmp = _.clonedoom(this.data);
			var args = [tmp].concat(_.slice(arguments));
			return _[api].apply(tmp,args);
		};
	}

	// Model Prototype extend
	// model data usually define as pure data, not javascript event or function
	// because it much as MVC-M logs 
	aix.model.prototype = {
		constructor : aix.model,

		get : function(key){
			if(_.isString(key))
				return _.clone(this.data[key]||"");
			return _.clone(this.data);
		},

		set : function(){
			var args = _.slice(arguments);
			if(args.length>1)
				this.data[args[0]] = args[1];
			else
				this.data = args[0];
			return this;
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
			var tmp = _.clonedoom(this.data) , type = _.typeof(tmp);
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

		// reduce [remove]
		red : function(){
			// only deel with Array and object
			var args = _.slice(arguments);
			var tmp = _.clonedoom(this.data) , type = _.typeof(tmp);
			_.foreach(args,function(data){
				switch(type){
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
			this.data = tmp;

			return this.dispatch("remove",null,args);
		},

		reduce : function(){
			return this.red.apply(this,_.slice(arguments));
		},

		remove : function(){
			return this.red.apply(this,_.slice(arguments));
		}
	};

	// Extend aix model method 
	// as Backbone extend
	aix.model.extend = function(def){
		var extend = function(ops){
			var _this = this;
			var updef = _.extend(_.clone(AIX_MODELS_DEFAULT),def);
			var obj = _.extend(updef,ops);

			// if userobj has more events
			if(_.isObject(obj.events))
				_.foreach(obj.events,function(v,k){
					_.addEvent(_this,k,v);
				});

			//delete undefault properties
			delete obj.change;
			delete obj.events;

			// copy data
			_.compose(_this,obj);
			_this.data = _.clone(this.data);

			_.define(_this,{
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

			//add listen for object data change
			_.watch(_this,"data",function(nv,ov){
			// Validate checker for change
				if(_this.validate){
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

			_.dispatch(_this,"init");
		};

		_.compose(extend.prototype,aix.model.prototype);
		extend.prototype.constructor = extend;
		extend.base = aix.model;

		return extend;
	};


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

		//delete undefault properties
		delete obj.change;
		delete obj.events;

		_.extend(_this,_.extend(_.clone(AIX_COLLECTION_DEFAULT),obj));
		
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
			if(_this.validate){
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

	aix.collection.extend = function(def){
		var extend = function(ops){
			var _this = this;
			var updef = _.extend(_.clone(AIX_COLLECTION_DEFAULT),def);
			var obj = _.extend(updef,ops);

			// if userobj has more events
			if(_.isObject(obj.events))
				_.foreach(obj.events,function(v,k){
					_.addEvent(_this,k,v);
				});

			//delete undefault properties
			delete obj.change;
			delete obj.events;

			// copy data
			_.compose(_this,obj);

			_.define(_this,{
				aid : {
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

			//add listen for object data change
			_.watch(_this,"data",function(nv,ov){
				// collection must be format as arr
				if(!_.isArray(nv))
					nv = [nv];

				// Validate checker for change
				if(_this.validate){
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

			_.dispatch(_this,"init");
		};

		_.compose(extend.prototype,aix.collection.prototype);
		extend.prototype.constructor = extend;
		extend.base = aix.collection;

		return extend;
	};


	aix.collection.prototype = {
		constructor : aix.collection,

		add : function(){
			var args = _.slice(arguments);
			var tmp = _.slice(this.data);
			tmp = tmp.concat.apply(tmp,args);

			if(_.isequal(this.data,tmp))
				return this;

			this.data = tmp;
			return this.dispatch("add",null,args);
		},

		get : function(id){
			if(id)
				return _.filter(this.data,function(one){
					return one.aid === "#"+id;
				});
			else
				return _.slice(this.data);
		},

		set : function(data){
			this.data = _.isArray(data) ? data : [data];
			return this;
		},

		dispatch : function(type,fn,args){
			return _.dispatch(this,type,_.isFunction(fn) ? fn : null , args);
		}
	
	};

	// #genertor
	_.foreach([
		"foreach",
		"splice",
		"unique",
		"reject",
		"filter",
		"map",
		"find",
		"cat",
		"groupby",
		"toarray",
		"forarray",
		"pairs",
		"not",
		"bale",
		"pluck",
		"shuffle",
		"merge"
	],function(api){
		aix.model.prototype[api]= _genertor_(api);
		aix.collection.prototype[api]= _genertor_(api);
	});

	_.foreach([
		"keys",
		"clone",
		"contain",
		"has",
		"isequal",
		"requery",
		"typeof"
	],function(api){
		aix.model.prototype[api]=_genertor_$(api);
		aix.collection.prototype[api]= _genertor_$(api);
	});

	// Aix Restful API design for
	// [Aix Model] data format serialize
	//
	var RESTFUL_LIST = {
		get    : "GET",
		put    : "PUT",
		post   : "POST",
		pull   : "POST",
		fetch  : "GET",
		update : "POST",
		delete : "DELETE"
	};

	_.extend(aix.model.prototype,{
		toJSON : function(){
			if(_.isArray(this.data) || _.isObject(this.data))
				return JSON.stringify(this.data);
			return this.data;
		},

		parse : function(){
			if(_.isString(this.data))
				return JSON.parse(this.data);
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

		pull : function(){
			return this.fetch.apply(this,_.slice(arguments));
		},

		post: function(url,param,fns,fnf){
			fns = _.isFunction(fns) ?  fns : _.NULL;
			fnf = _.isFunction(fnf) ?  fnf : _.NULL;
		  return this.pipe.apply(this,["post",url||(this.url||""),param || this.parse(),fns,fnf]);
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
				var _this = this;
				_this.data = JSON.parse(responseText);
				if(_this.model)
					_.foreach(data,function(val,index){
						data[index] = new _this.model({ data : val });
					});
				_this.data = data;
				fns.call(this,responseText,xhr,event);
			},fnf]);
		},

		pull : function(){
			return this.fetch.apply(this,_.slice(arguments));
		},

		post: function(url,param,fns,fnf){
			fns = _.isFunction(fns) ?  fns : _.NULL;
			fnf = _.isFunction(fnf) ?  fnf : _.NULL;
		  return this.pipe.apply(this,["post",url||(this.url||""),param || this.parse(),fns,fnf]);
		}
	});

	$ = $ || _.NULL; 

	aix.view = function(obj){
		obj = obj || {};
		if(!_.isString(obj.el))
			return console.error("view must define its 'el' prop bind with dom elm");

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
				if(type.length > 1){
					$(obj.el).on(type[0],type[1],{self:_this},v);
				}else{
					_.addEvent(_this,k,v);
				}
		});

		// parse template
		if(!obj.template || _.isString(obj.template))
			obj.template = _.doom(obj.template||"");
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
				success:function(text){
					obj.template = _.doom(text);
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
	};

	aix.view.extend = function(def){
		var extend = function(ops){
			def = def || {};
			if(!_.isString(def.el))
				return console.error("view must define its 'el' prop bind with dom elm");

			var _this = this;
			var updef = _.extend(_.clone(AIX_VIEW_DEFAULT),def);
			var obj = _.extend(updef,ops);

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
					if(type.length > 1){
						$(obj.el).on(type[0],type[1],{ self:_this },v);
					}else{
						_.addEvent(_this,k,v);
					}
				});

			// parse template
			if(!obj.template || _.isString(obj.template))
				obj.template = _.doom(obj.template||"");
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
					success:function(text){
						obj.template = _.doom(text);
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


		_.compose(extend.prototype,aix.view.prototype);
		extend.prototype.constructor = extend;
		extend.base = aix.view;

		return extend;
	};

	//get Hash param form URL
	var getHash = aix.getHash = function(url){
		var arr = url.split("#");
		var res = "";
		if(arr.length>1)
			res = arr[1];
		return res;
	};

	//if HashChange callee
	function changeHash(hash,oldhash,event){
		var _this = this;
		_.foreach(_this.routes,function(fn,key){
			if(RegExp(key,"im").test(hash))
				fn.call(_this,hash,oldhash,event,key);
		});
	}

	// define route for SPA
	aix.route = function(obj){
		var _this = this;

		if(_.isObject(obj.events))
			_.foreach(obj.events,function(v,k){
				_.addEvent(_this,k,v);
			});

		//delete undefault properties
		delete obj.events;

		// cant change regular hash title
		_.define(_this,"history",{
			value : { old:"" , now:"" },
			writable : true,
			enumerable : false
		});

		_.root.addEventListener("hashchange",function(event){
			_this.history.now = event.newURL;
			_this.history.old = event.oldURL;
			
			_.dispatch(_this,"hashchange",null,
								[getHash(event.newURL),getHash(event.oldURL),event]);
		});

		_.addEvent(_this,"hashchange",changeHash);
		_.dispatch(_this,"init");
	};

	aix.route.prototype = {
		constructor : aix.route,

		goBack : function(){
			window.location.href = this.history.old;
			return this;
		},
		
		getHistory : function(){
			return _.clone(this.history);
		}
	};

	return aix;
});

