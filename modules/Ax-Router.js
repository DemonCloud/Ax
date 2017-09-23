// import ax from "ax-js"
// import ax from "ax" #or from alias for webpack

ax.module("Router",function(ax,struct){
'use strict';
// Router use HTML5 History API

// * use pushState or replaceState
// * onpopstate event only trigger when the History go(+-1) (user trigger)
// * historyStates as a stack [ - - - = - - ]

// *define assert;
// *define history [H]
// *define pathReg to exec
var _ = [], H = struct.root.history,
		pathReg = /\/:([^\s/]+)/g,
		mappingReg = "/([^\\s\\/]+)";

// Define Utils [ struct ]
var merge = struct.merge(),
		is    = struct.type("def"),
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
		clone = struct.cloneDeep(),
		qpars = struct.param("parse");

// delegator view
// view bind on root;
// for reg Element to trigger the Router change;
var delegatorView = ax.view.extend({
	root: document.documentElement,
	render: noop
});

// About trigger
//  - when refresh browser at router init
//  - when the click binder router-link
//  - when the history go or back (popstate)

// Active the routers
function checkPath(path){
	return path &&
				path !== location.pathname &&
				path !== location.pathname + "/";
}

function returnT(){
	return true;
}

function toActive(source,path,query,state,notpush,isLink){
	var cpath = checkPath(path);

	if(!(isLink && !cpath) && this._status){

		var _this = this, i, l, checker, 
				key = keys(source.mapping), route, param;
				state = is(state,"Object") ? state : {};

		for(i=0,l=key.length,checker; i<l; i++)
			if((checker = source.mapping[key[i]]).test(path)){
				route = key[i];
				param = cmb(
					source.params[route],
					slice(checker.exec(path),1)
				);
				break;
			}

		// if exist router
		if(route){
			var queryString = (isStr(query) ?
					(query.charAt(0) !== '?' ? "?" : "") + query :
					is(query,"Object") ? ("?"+qstr(query)) : "");

			query = is(query,"Object") ? query : qpars(query);

			if(source.beforeActions(param,query,state)){

				each(map(source.routes[route],function(name){
					// setup funtion call
					return source.actions[name] || noop;
				}),function(fn){
					return fn.call(_this, param, query, state);
				});

				if(!notpush)
					H[cpath ? "pushState" : "replaceState"](state, null, path+queryString);

				source.completedActions(param,query);
			}
		}

	}

	return this;
}

// Default Options
// for merge the keywords
// * example :
//
//  new Router({
//  	elements: [".router"],
//  
//  	routes:{
//  		"/": ["home"],
//  		"/hifi" : ["hifi"],
//  		"/article/:name" : ["article"],
//  	},
//
//  	actions:{
//  		home: act_home,
//  		hifi: act_hifi,
//  		article: act_post
//  	}
//  });

var DEFAULT_ROUTER_OPTION = {
	routes: {},
	actions: {},
	beforeActions: returnT,
	completedActions: noop
};

var Router = function(option){

	var _this = this;
	var source = merge(
		clone(DEFAULT_ROUTER_OPTION),
		is(option,"Object") ? option : {}
	); 

	// create Assert method
	this._status = 0;
	this._assert = function(idf){ if(idf === _) return source; };

	var delegatorEvents = {}, events;

	if((events = map(source.elements, function(elm){
		return "click:"+elm; }).join("|"))){

		delegatorEvents[events] = function(e){
			e.preventDefault();
			e.stopPropagation();
			var elm = e.target;

			// click event trigger
			return _this.to(
				elm.to    || elm.getAttribute("to"),    //path
				elm.query || elm.getAttribute("query"), //queryString
				elm.state || elm.getAttribute("state"), //state
				0,                                      //needpush
				1                                       //isLink
			);
		};

		// create delegatorView on root
		delegatorView({ events: delegatorEvents });
	}

	source.mapping = {};
	source.params =  {};
	source.routes = map(source.routes,function(action){
		return isArr(action) ? action : [action];
	});

	each(source.routes,function(action,path){
		var routeParam = [],
		pathMatcher = trim(path).replace(pathReg,
		function(match,param){ 
			routeParam.push(param);
			return mappingReg;
		});
		source.params[path] = routeParam;
		source.mapping[path] = RegExp("^"+pathMatcher+"[/]?$");
	});

	// use location API
	// path : location.pathname
	// query : location.search
	// state : event.state
	struct.root.addEventListener("popstate",function(event){
		return toActive.call(this,
			source,
			location.pathname,
			location.search,
			event.state,
			true
		);
	}.bind(this));

};

Router.prototype = {
	// goto take the initiative to trigger
	to: function(path,query,state,notpush,isLink){
		return toActive.call(this,
			this._assert(_),
			path,
			query,
			state,
			notpush,
			isLink
		);
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
		if(this._status) return this;
		this._status = 1;
		if(0 in arguments && path)
			this.to(path,query,state);
		return this;
	},

	stop: function(){
		this._status = 0;
		return this;
	},

	resolve: function(state){
		if(!this._status) return;

		H.replaceState(
			is(state,"Object") ? state : {},
			null,
			location.href
		);

		return this;
	}
};

return Router;

});
