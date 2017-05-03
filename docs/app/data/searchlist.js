define("data/searchlist",
[],function(){
	return Object.freeze([
		{ n:"model.get",      k: ["get","data"] },
		{ n:"model.set",      k: ["set","data"] },
		{ n:"model.send",     k: ["send","data"] },
		{ n:"model.fetch",    k: ["fetch","save","update","data"] },
		{ n:"model.sync",     k: ["sync","post","pull","data"] },
		{ n:"model.validate", k: ["validate","data"] },
		{ n:"model.events",   k: ["events"] },
		{ n:"model.extend",   k: ["extend","super"] },
		{ n:"view.mount",     k: ["mount","init"] },
		{ n:"view.render",    k: ["render","update"] },
		{ n:"view.events",    k: ["events"] },
		{ n:"view.extend",    k: ["extend","super"] },
	]);
});
