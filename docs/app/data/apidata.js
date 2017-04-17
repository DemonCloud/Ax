define("data/apidata",
[],
function(){
	return Object.freeze({
		"model:get" : {
			title:"Model.get",
			introduce:"<code>model.get</code> it is mainly used to get the data form model with <code>key</code>, it provides a more secure and reliable mechanism. alse u can give a <code>todo</code> function to dispose get-value, that not suggest to use <code>model.data</code> direactly, because assist model.data is just return its copy. ",
			usages:[
				"model.get()",
				"model.get(key)",
				"model.get(key,todo(value,...$args),...$args)"
			],

			params:[
				{ name:"key", type:"String,Number" },
				{ name:"todo", type:"Function" },
			],
			info:"<p><code>todo</code> function would not change <code>model.data</code></p><p>u can binding more <code>...args</code> for <code>todo</code> </p>",
			related:[
				{ name:"model.set", target:"model:set" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model(); \n\
// set the data \n\
m.set({ a:1 }); \n\
console.log(m.data);"
				},
				{
					title: "Use key",
					code:"var m = new aix.model();\n\
// set the data\n\
m.set(\"a\",1);\n\
console.log(m.data);"
				},
				{
					title: "Change deeping target",
					code:"var m = new aix.model({\n\
	data : {\n\
		a : {\n\
			b : 1,\n\
			c : {\n\
				d : 3\n\
			}\n\
		}\n\
	}\n\
});\n\
\n\
// set the data\n\
m.set(\"a.b\",10);\n\
m.set(\"a.c.d\",5);\n\
console.log(m.toJSON());"
				},
				{
					title: "Set with Validate",
					code:"var m = new aix.model({\n\
	// validate the property \"a\" isString\n\
	validate:{\n\
		a : function(a){\n\
			return typeof a === \"string\";\n\
		}\n\
	},\n\
	// if pass validate\n\
	events:{\n\
		change : function(){\n\
			console.log(\"set sucessful!\");\n\
		}\n\
	}\n\
});\n\
\n\
// set as number\n\
m.set(\"a\",1);\n\
console.log(m.data);\n\
\n\
// set as array\n\
m.set(\"a\",[]);\n\
console.log(m.data);\n\
\n\
// set as string\n\
m.set(\"a\",\"Buke\");\n\
console.log(m.data);"
				}
			]
		},
		"model:set" : {
			title:"Model.set",
			introduce:"<code>model.set</code> it is mainly used to update the data of the model, <code>aix.model</code> data is <b>immutable</b>, it provides a more secure and reliable mechanism. so change the model.data.* direactly may not work.",
			usages:[
				"model.set(data)",
				"model.set(key,data)"
			],
			params:[
				{ name:"key", type:"String,Number" },
				{ name:"data", type:"Auto" },
			],
			info:"<p>set will be auto validate if defined <code>validate</code> property on defaults</p><p>set sucessful will trigger <code>change</code> events</p>",
			related:[
				{ name:"model.get", target:"model:get" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model(); \n\
// set the data \n\
m.set({ a:1 }); \n\
console.log(m.data);"
				},
				{
					title: "Use key",
					code:"var m = new aix.model();\n\
// set the data\n\
m.set(\"a\",1);\n\
console.log(m.data);"
				},
				{
					title: "Change deeping target",
					code:"var m = new aix.model({\n\
	data : {\n\
		a : {\n\
			b : 1,\n\
			c : {\n\
				d : 3\n\
			}\n\
		}\n\
	}\n\
});\n\
\n\
// set the data\n\
m.set(\"a.b\",10);\n\
m.set(\"a.c.d\",5);\n\
console.log(m.toJSON());"
				},
				{
					title: "Set with Validate",
					code:"var m = new aix.model({\n\
	// validate the property \"a\" isString\n\
	validate:{\n\
		a : function(a){\n\
			return typeof a === \"string\";\n\
		}\n\
	},\n\
	// if pass validate\n\
	events:{\n\
		change : function(){\n\
			console.log(\"set sucessful!\");\n\
		}\n\
	}\n\
});\n\
\n\
// set as number\n\
m.set(\"a\",1);\n\
console.log(m.data);\n\
\n\
// set as array\n\
m.set(\"a\",[]);\n\
console.log(m.data);\n\
\n\
// set as string\n\
m.set(\"a\",\"Buke\");\n\
console.log(m.data);"
				}
			]
		}
	});
});
