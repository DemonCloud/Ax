define("route",
[
"ax",
"struct",

// data
"data/rulelist",

// actions
"actions/introduce/export",
"actions/api/export",

// module
"modules/common",

],
function(
ax,
struct,

ruleList,

introduce,
api
){
	'use strict';

	// make ax as GLOBAL
	struct.root.ax = ax;

	var has = struct.has(),
			_   = struct.link();

	var check = {
		api:function(param){
			if(has(ruleList.api,param.s))
				return param.s;
			else
				alert("do not get fuck off hash change?");
			throw new TypeError("fuck you with make bich off hash url?");
		}
	};

	var app = new ax.route({
		routes:{
			"^introduce$" : "index",
			"^api$"       : "api"
		},
		actions:{
			index : introduce,
			api   : _(check.api,api)
		}
	});

	// route start
	return app.listen(
		window.location.hash ? 
		void 0 : 
		"introduce"
	);
});
