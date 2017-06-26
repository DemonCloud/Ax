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
"modules/common"
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
	struct.root.struct = struct;
	struct.root.ax = ax;

	var has = struct.has(),
			_   = struct.link();

	var check = {
		api:function(param){
			if(has(ruleList.api,param.s))
				return param.s;
			else
				alert("This API gona to building!");
			throw new TypeError("(* _*) 凸");
		}
	};

	var app = ax.route({
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
