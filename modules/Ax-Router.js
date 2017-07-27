// import ax from "ax-struct-js" 
// import ax from "ax" #or from alias for webpack

ax.module("Router",function(ax,struct){
'use strict';

// Router use HTML5 History API

// * use pushState or replaceState
// * onpopstate event only trigger when the History go(+-1) (user trigger)
// * state as a stack [ - - - - ]

// Define Utils [ struct ]
// define assert;
var _ = [];

var H = struct.root.history;
var merge = struct.merge(),
		clone = struct.clone(),
		is    = struct.type("def"),
		aget  = struct.prop("get"),
		each  = struct.each(),
		map   = struct.map(),
		trim  = struct.string("trim"),
		keys  = struct.keys(),
		slice = struct.slice(),
		cmb   = struct.combined(),
		isStr = struct.type("string"),
		isArr = struct.type("array"),
		noop  = struct.noop(),
		qstr  = struct.param("stringify"),
		toNum = struct.convert("number"),
		qpars = struct.param("parse"),
		aset  = struct.prop("set");
	

// delegator view
var delegatorView = ax.view.extend({
	root: document.documentElement,
	render: noop
});

// Default Options
var DEFAULT_ROUTER_OPTION = {
	routes: {},
	actions: {}
};

// About trigger
//  - when refresh browser at router init
//  - when the click binder router-link
//  - when the history go or back (popstate)
var pathReg = /\/:([^\s\/]+)/g;

var Router = function(option){
	var _this = this;
	var source = merge(
		clone(DEFAULT_ROUTER_OPTION),
		is(option,"Object") ? option : {}
	);
	
	// create Assert method
	this._status = 0;

	this._assert = function(name,idf){
		if(idf === _) 
			return aget(source,name);
	};

	var delegatorEvents = {};
	var events = map(source.elements,
		function(elm){ return "click:"+elm; });

	if(events = events.join("|")){
		delegatorEvents[events] = function(e){
			e.preventDefault();
			e.stopPropagation();
			var elm = e.target;

			return _this.to(
				elm.to    || elm.getAttribute("to"),    //path
				elm.query || elm.getAttribute("query"), //queryString
				elm.state || elm.getAttribute("state")  //state
			);
		};

		this.delegator = new delegatorView({ 
			events: delegatorEvents 
		});
	};

	source.mapping = {};
	source.params =  {};
	source.routes = map(source.routes,function(action){
		return isArr(action) ? action : [action];
	});

	each(source.routes,function(action,path){
		var actions, argslength;
		var routeParam = [];

		var pathMatcher = trim(path).replace(pathReg,
			function(match,param){ 
				routeParam.push(param);
				return "/([^\\s\\/]+)";
			}
		); 
		
		source.params[path] = routeParam;
		source.mapping[path] = RegExp("^"+pathMatcher+"[\/]?$");
	});

	// use location API
	// path : location.pathname
	// query : location.search
	// state : event.state
	window.addEventListener("popstate",function(event){
		if(this._status){
			var _ROUTER = this;
			var route, param , path = location.pathname;
			var key = keys(source.mapping);

			for(var i =0, l=key.length,checker;i<l; i++){
				checker = source.mapping[key[i]];
				if(checker.test(path)){
					route = key[i];
					param = cmb(source.params[route],slice(checker.exec(path),1));
					break;
				}
			}

			if(route){
				var query = location.search;
				each(map(source.routes[route],function(name){
					// setup funtion call
					return source.actions[name] || noop;
				}),function(fn){
					return fn.call(_ROUTER, param,
						is(query,"Object") ? query : qpars(query),
						event.state
					);
				});
			}
		}
	}.bind(this));
};

Router.prototype = {
	// goto take the initiative to trigger
	to: function(path,query,state,notpush){
		if(this._status && path){
			var _ROUTER = this;
			var mapping = this._assert("mapping",_);
			var params = this._assert("params",_);
			var routes = this._assert("routes",_);
			var actions = this._assert("actions",_);
			var key = keys(mapping);
	
			var route, param;
	
			for(var i =0, l=key.length,checker;i<l; i++){
				checker = mapping[key[i]];
				if(checker.test(path)){
					route = key[i];
					param = cmb(params[route],slice(checker.exec(path),1));
					break;
				}
			}
	
			if(route){
				if(!notpush){
					H.pushState(state,null,path+(isStr(query) ? 
						(query.charAt(0) !== '?' ? "?":"")+query :
						is(query,"Object") ? ("?"+qstr(query)) : ""));
				}
	
				each(map(routes[route],function(name){
				// setup funtion call
					return actions[name] || noop;
				}),function(fn){
					return fn.call(_ROUTER, param,
						is(query,"Object") ? query : qpars(query),
						state
					);
				});
			}
		};

		return this;
	},

	back: function(){
		H.back();

		return this;
	},

	length: function(){
		return H.length;
	},

	go: function(current){
		var c = toNum(current);
		if(c) H.go(c);
		return this;
	},

	start: function(path,query,state){
		if(this._status) 
			return this;

		this._status = 1;

		if(0 in arguments && path){
			var notpush = (
				path === location.pathname ||
				path === location.pathname+"/"
			);
			this.to.call(this,path,query,state,notpush);
		}

		return this;
	},

	stop: function(){
		this._status = 0;

		return this;
	}
}

return Router;

});
