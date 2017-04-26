define("data/searchlist",
[],function(){
	return Object.freeze([
		{ n:"api:model.get",      k: ["get","data"] },
		{ n:"api:model.set",      k: ["set","data"] },
		{ n:"api:model.send",     k: ["send","data"] },
		{ n:"api:model.fetch",    k: ["fetch","save","update","data"] },
		{ n:"api:model.sync",     k: ["sync","post","pull","data"] },
		{ n:"api:model.validate", k: ["validate","data"] },
		{ n:"api:model.events",   k: ["events"] },
		{ n:"api:model.extend",   k: ["extend","super"] },
		{ n:"api:view.mount",   k: ["mount","init"] },
		{ n:"api:view.render",   k: ["render","update"] },
		{ n:"api:view.events",   k: ["events"] },
		{ n:"api:view.extend",   k: ["extend","super"] },
	]);
	
});
