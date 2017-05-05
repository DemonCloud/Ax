(function(){
	requirejs.config({
		baseUrl:"./app/",

		paths:{
			"text":"scripts/plugins/require-text.min",

			"route" : "route",
			"struct":"scripts/libs/struct.min",
			"ax":"scripts/libs/ax.min"
		},

		shim : {
			ax : {
				deps : ["struct"],
				exports : "ax"
			},
		},
	});

	return require(['route']);
}());
