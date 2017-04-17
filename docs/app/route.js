define("route",
[
"aix",
"struct",

// data
"data/rulelist",

// actions
"actions/introduce/export",
"actions/api/export",
"actions/cap/export"
],
function(
aix,
struct,

ruleList,

introduce,
api,
cap
){
	'use strict';

	struct.root.aix = aix;

	var has = struct.has(),
			_ = struct.link();

	var check = {
		api:function(param){
			if(has(ruleList.api,param.s))
				return param.s;
			else
				alert("do not get fuck off hash change?");
			throw new TypeError("fuck you with make bich off hash url?");
		},
		cap:function(param){
			if(has(ruleList.cap,param.s))
				return param.s;
			else
				alert("do not get fuck off hash change?");
			throw new TypeError("fuck you with make bich off hash url?");
		}
	};

	var app = new aix.route({
		routes:{
			"^introduce$" : "index",
			"^api$"       : "api",
			"^cap$"       : "cap"
		},
		actions:{
			index : introduce,
			api   : _(check.api,api),
			cap   : _(check.cap,cap)
		}
	});

	// route start
	app.listen(
		window.location.hash ? 
		void 0 : 
		"introduce"
	);
});
