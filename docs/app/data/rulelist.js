define("data/rulelist",
[],
function(){
	return Object.freeze({
		api:[
			"model:get",
			"model:set",
			"model:rm",
			"model:moc",
			"model:toJSON",
			"model:parse",
			"model:send",
			"model:fetch",
			"model:sync",
			"model:validate",
			"model:events",
			"model:extend",
			"view:events",
			"view:mount",
			"view:compile",
			"view:render",
			"view:extend",
			"route:listen",
			"route:stop",
			"route:assign",
			"route:events",
			"route:extend",
			"struct:define",
			"struct:extend",
			"struct:depextend",
			"struct:keys",
			"struct:noop",
			"struct:clone",
			"struct:depclone",
			"struct:not",
			"struct:cat",
			"struct:slice",
			"struct:find",
			"struct:filter",
			"struct:reject",
			"struct:every",
			"struct:some",
			"struct:diff",
			"struct:intsec",
			"struct:hook",
			"struct:chunk",
			"struct:compact",
			"struct:pluck",
			"struct:groupBy",
			"struct:countBy",
			"struct:concat",
			"struct:cast",
			"struct:shuffle",
			"struct:first",
			"struct:last",
			"struct:flat",
			"struct:merge",
			"struct:auto",
			"struct:part",
			"struct:once",
			"struct:eq",
			"struct:cookie",
			"struct:values",
			"struct:memoize",
			"struct:negate",
			"struct:link",
			"struct:size",
			"struct:now",
			"struct:sort",
			"struct:each",
			"struct:map",
			"struct:has",
			"struct:type",
			"struct:html",
			"struct:unique",
			"struct:convert",
			"struct:pull",
			"struct:param",
			"struct:ajax",
			"struct:event",
			"struct:prop",
			"struct:pairs",
			"struct:index",
			"struct:random",
			"struct:string",
			"struct:doom"
		],
		cap:[
			"model",
			"view",
			"route",
			"single",
			"mixed"
		]
	});
});
