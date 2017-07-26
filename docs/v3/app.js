(function(){
	requirejs.config({
		baseUrl:"./app/",

		paths:{
			"text":"scripts/plugins/require-text.min",

			"route" : "route",
			"struct":"scripts/libs/struct.min",
			"ax":"scripts/libs/ax.min",

			"sh_main":"scripts/libs/sh_main.min",
			"sh_js":"scripts/libs/sh_javascript.min"
		},

		shim : {
			ax : {
				deps : ["struct"],
				exports : "ax"
			},

			sh_js : {
				deps : ["sh_main"]
			},
		},
	});

	return require(['route']);
}());
