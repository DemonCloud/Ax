define("data/searchlist",
[],function(){
	return Object.freeze([
		/* ax search */
		{ n:"model:get",        k: ["get","json","data"], t:1 },
		{ n:"model:set",        k: ["set","data"], t:1 },
		{ n:"model:rm",         k: ["remove","data","rm","delete"], t:1 },
		{ n:"model:moc",        k: ["moc","data"], t:1 },
		{ n:"model:toJSON",     k: ["tojson","data"], t:1 },
		{ n:"model:fetch",      k: ["fetch","save","update","data"], t:1},
		{ n:"model:send",       k: ["send","data"], t:1 },
		{ n:"model:sync",       k: ["sync","post","pull","data"], t:1 },
		{ n:"model:store",      k: ["store","save","data"], t:1 },
		{ n:"model:validate",   k: ["validate","data"], t:1 },
		{ n:"model:events",     k: ["events"] , t:1},
		{ n:"model:extend",     k: ["extend","super","class"] , t:1 },
		{ n:"store:store",      k: ["store","locally","age"] , t:1 },
		{ n:"store:get",        k: ["get"] , t:1 },
		{ n:"store:set",        k: ["set","locally"] , t:1 },
		{ n:"store:rm",         k: ["remove","rm","delete"] , t:1 },
		{ n:"store:clear",      k: ["clear","rm","delete"] , t:1 },
		{ n:"view:mount",       k: ["mount","init"], t:1 } ,
		{ n:"view:render",      k: ["render","update"] , t:1 },
		{ n:"view:props",       k: ["props"] , t:1 },
		{ n:"view:events",      k: ["events"], t:1 },
		{ n:"view:extend",      k: ["extend","super","class"] , t:1 },
		{ n:"route:listen",     k: ["listen","start"] , t:1 },
		{ n:"route:stop",       k: ["unlisten","stop"] , t:1 },
		{ n:"route:assign",     k: ["assign","goto"] , t:1 },
		{ n:"route:events",     k: ["events"], t:1 },
		{ n:"route:extend",     k: ["extend","super","class"] , t:1 },

		/* struct search */
		{ n:"struct:define",    k: ["define","property"] , t:2 },
		{ n:"struct:extend",    k: ["extend","compress"] , t:2 },
		{ n:"struct:depextend", k: ["depextend","compress"] , t:2 },
		{ n:"struct:keys",      k: ["keys"] , t:2 },
		{ n:"struct:noop",      k: ["noop","null"] , t:2 },
		{ n:"struct:clone",     k: ["clone","copy"] , t:2 },
		{ n:"struct:depclone",  k: ["depclone","copy"] , t:2 },
		{ n:"struct:not",       k: ["not","filter"] , t:2 },
		{ n:"struct:cat",       k: ["cat","filter"] , t:2 },
		{ n:"struct:slice",     k: ["slice","copy"] , t:2 },
		{ n:"struct:find",      k: ["find","filter"] , t:2 },
		{ n:"struct:reject",    k: ["reject","filter"] , t:2 },
		{ n:"struct:every",     k: ["every","all"] , t:2 },
		{ n:"struct:some",      k: ["some","only"] , t:2 },
		{ n:"struct:diff",      k: ["difference"] , t:2 },
		{ n:"struct:intsec",    k: ["intsec"] , t:2 },
		{ n:"struct:chunk",     k: ["chunk"] , t:2 },
		{ n:"struct:compact",   k: ["compact"] , t:2 },
		{ n:"struct:pluck",     k: ["pluck"] , t:2 },
		{ n:"struct:groupBy",   k: ["groupby"] , t:2 },
		{ n:"struct:countBy",   k: ["countby"] , t:2 },
		{ n:"struct:concat",    k: ["concat"] , t:2 },
		{ n:"struct:cast",      k: ["cast"] , t:2 },
		{ n:"struct:shuffle",   k: ["shuffle"] , t:2 },
		{ n:"struct:first",     k: ["first"] , t:2 },
		{ n:"struct:last",      k: ["last"] , t:2 },
		{ n:"struct:flat",      k: ["flat"] , t:2 },
		{ n:"struct:merge",     k: ["merge"] , t:2 },
		{ n:"struct:auto",      k: ["auto"] , t:2 },
		{ n:"struct:part",      k: ["part"] , t:2 },
		{ n:"struct:once",      k: ["once"] , t:2 },
		{ n:"struct:eq",        k: ["equal"] , t:2 },
		{ n:"struct:values",    k: ["values"] , t:2 },
		{ n:"struct:memoize",   k: ["memoize"] , t:2 },
		{ n:"struct:negate",    k: ["negate"] , t:2 },
		{ n:"struct:link",      k: ["link","wrap"] , t:2 },
		{ n:"struct:size",      k: ["size","length"] , t:2 },
		{ n:"struct:now",       k: ["now","time"] , t:2 },
		{ n:"struct:sort",      k: ["sort"] , t:2 },

		{ n:"struct:each",      k: ["each","loop","forin"] , t:2 },
		{ n:"struct:map",       k: ["map","hook"] , t:2 },
		{ n:"struct:has",       k: ["haskey"] , t:2 },
		{ n:"struct:type",      k: ["type","is"] , t:2 },
		{ n:"struct:html",      k: ["html","strip"] , t:2 },
		{ n:"struct:unique",    k: ["unique"] , t:2 },
		{ n:"struct:convert",   k: ["convert","tostring","hex","rgb"] , t:2 },
		{ n:"struct:pull",      k: ["pullleft","pullright","pullwith"] , t:2 },
		{ n:"struct:drop",      k: ["dropleft","dropright","dropto"] , t:2 },
		{ n:"struct:param",     k: ["param","parse","stringify"] , t:2 },
		{ n:"struct:ajax",      k: ["ajax","ajaxget","ajaxpost"] , t:2 },
		{ n:"struct:event",     k: ["events"] , t:2 },
		{ n:"struct:prop",      k: ["prop","delete","get","set"] , t:2 },
		{ n:"struct:pairs",     k: ["pairs"] , t:2 },
		{ n:"struct:index",     k: ["index","idx"] , t:2 },
		{ n:"struct:random",    k: ["random"] , t:2 },
		{ n:"struct:string",    k: ["string","rize","capit","came"] , t:2 },
		{ n:"struct:assembly",  k: ["assembly","atob","utf8","btoa"] , t:2 },
		{ n:"struct:doom",      k: ["doom","template"] , t:2 }
	]);
});
