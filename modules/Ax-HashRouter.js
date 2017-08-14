// import ax from "ax-js"
// import ax from "ax" #or from alias for webpack

ax.module("HashRouter",function(ax,struct){
'use strict';

var noop = struct.noop(),
		root = struct.root,
		clone = struct.cloneDeep(),
		merge = struct.merge();

var _ = [];
var mirco = "#/";
var returnT = function(){ return true; };

var DEFAULT_ROUTER_OPTION = {
	query: "@",
	routes: {},
	actions: {},
	beforeActions: returnT,
	completedActions: noop
};

var toActive = function(option, path, query){
	
};

var HashRouter = function(o){
	var option = merge(clone(DEFAULT_ROUTER_OPTION),o||{});

	this._status = 0;
	this._assert = function(idf){ return idf === _ ? option : {}; };


	root.addEventListener("hashchange",function(event){
		
	});
};

HashRouter.prototype = {
	start: function(path,query){
		this._status = 1;
	},

	to: function(path,query){
		if(this._status) return;
	
	},

	stop: function(){
		this._status = 0;
	}
};

return HashRouter;

});
