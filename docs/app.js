(function(){
	requirejs.config({
		baseUrl:"./app/",

		paths:{
			"text":"scripts/plugins/require-text.min",

			"route" : "route",
			"struct":"scripts/libs/struct.min",
			"aix":"scripts/libs/aix.min"
		},

		shim : {
			aix : {
				deps : ["struct"],
				exports : "aix"
			},
		},
	});

	require(['route']);
}());
