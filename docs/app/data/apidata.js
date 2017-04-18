define("data/apidata",
[],
function(){
	return Object.freeze({
		//#model.get
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
				{ name:"model.rm", target:"model:rm" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model({\n\
	data:{\n\
		b : 1\n\
	}\n\
});\n\
// get data \n\
console.log(m.get());"
				},
				{
					title: "Get with key",
					code:"var m = new aix.model({\n\
	data:{\n\
		a : 1,\n\
		b : { c : 2 }\n\
	}\n\
});\n\
// get data \n\
console.log(m.get(\"b.c\"));"
				},
				{
					title: "Dowith property method",
					code:"var m = new aix.model({\n\
	data:{\n\
		b : \"abcd\",\n\
		a : [2,3,4]\n\
	}\n\
});\n\
// get data \n\
console.log(m.get(\"b\",\"length\"));\n\
console.log(m.get(\"a\",\"toString\"));"
				},
				{
					title: "Dowith function",
					code:"var size = struct.size();\n\
var m = new aix.model({\n\
	data:{\n\
		a : { b:1, c:2, d:{ e:3, f:4 } }\n\
	}\n\
});\n\
// get data \n\
console.log(m.get(\"a.d\",size));"
				}
			]
		},

		//#model.set
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
				{ name:"model.rm", target:"model:rm" },
				{ name:"model.moc", target:"model:moc" },
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

		//#model.rm
		"model:rm" : {
			title:"Model.rm",
			introduce:"<code>model.rm</code> use to remove data in model",
			usages:[
				"model.rm()",
				"model.rm(key)"
			],
			params:[
				{ name:"key", type:"String,Number" }
			],
			info:"<p>care about <code>rm</code> method, if the key target not exist, the code would not throw a error, but deal it silence</p><p>direactly use <code>model.rm</code> will set <code>model.data</code> as <code>null</code>",
			related:[
				{ name:"model.get", target:"model:get" },
				{ name:"model.set", target:"model:set" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model({\n\
	data:{\n\
		a : 1,\n\
		b : 2\n\
	}\n\
});\n\
// remove data\n\
m.rm(\"a\");\n\
console.log(m.get());"
				},
				{ 
					title: "Remove directly",
					code:"var m = new aix.model({\n\
	data:{\n\
		a : 1\n\
	}\n\
});\n\
// remove data\n\
m.rm();\n\
console.log(m.get());"
				},
			]
		},

		//#model.moc
		"model:moc" : {
			title:"Model.moc",
			introduce:"<code>model.moc</code> is useful update <code>Object</code> , <code>Array</code> target in model",
			usages:[
				"model.moc(key,val)"
			],
			params:[
				{ name:"key", type:"String,Number" },
				{ name:"val", type:"Auto" }
			],
			info:"<p>In some case, use <code>model.data[somekey]=somevalue</code> method is invalid, <code>model.moc</code> given a simple way to update model at somewhere.</p><p>it will auto emit an <code>change</code> events</p>",
			// related:[
			// 	{ name:"model.get", target:"model:get" },
			// 	{ name:"model.set", target:"model:set" },
			// 	{ name:"model.moc", target:"model:moc" },
			// ],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model({\n\
	data:{\n\
		a : []\n\
	}\n\
});\n\
// moc the data\n\
m.moc(\"a\",[2,1,3])\n\
console.log(m.get());"
				},
				{ 
					title: "Update Object",
					code:"var m = new aix.model({\n\
	data:{\n\
		a : { b:1 }\n\
	}\n\
});\n\
// moc the data\n\
m.moc(\"a\",{b:2, c:3})\n\
console.log(m.get());"
				},
			]
		},

		//#model.toJSON
		"model:toJSON" : {
			title:"Model.toJSON",
			introduce:"<code>model.toJSON</code>, convert the model data to JSON string",
			usages:[
				"model.toJSON()"
			],
			info:"<p>sure you model is JSON format, <a href='https://zh.wikipedia.org/zh-hans/JSON' target='blank'>see more about JSON</a></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model({\n\
	data:{\n\
		a : 1,\n\
		b : {\n\
			c : 2,\n\
			d : 3\n\
		},\n\
		e : {\n\
			f: [1,2]\n\
		}\n\
	}\n\
});\n\
// convert data to JSON string format\n\
console.log(m.toJSON());"
				}
			]
		},

		//#model.send
		"model:send" : {
			title:"Model.send",
			introduce:"<code>model.send</code> send model data to server with \"GET\" method, auto convert data to querystring, this action be sure the data is typeof <code>Object</code> ",
			usages:[
				"model.send()",
				"model.send(fn,header)",
				"model.send(url,fn,header)"
			],

			params:[
				{ name:"url", type:"String" },
				{ name:"fn", type:"Function" },
				{ name:"header", type:"Object" }
			],
			info:"<p>it will trigger the <code>send</code> events</p>\n\
						<p><code>send:success</code> or <code>send:fail</code>, or with callback, also u can custom [ HTTP header ] to server</p>",
			related:[
				{ name:"model.fetch", target:"model:fetch" },
				{ name:"model.sync", target:"model:sync" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model({\n\
	url:\"ajax/action\",\n\
	data:{\n\
		id : 1002,\n\
		name : \"buke\",\n\
		score : 99\n\
	}\n\
});\n\
// send data \n\
console.log(m.send());\n\
// send to custom url \n\
console.log(m.send(\"ajax/other\"));"
				},
				{ 
					title: "With callback",
					code:"var m = new aix.model({\n\
	url:\"ajax/data1\",\n\
	data:{\n\
		id : 213\n\
	}\n\
});\n\
// send data with callback \n\
m.send(function(res){\n\
	console.log(res);\n\
});"
				},
				{ 
					title: "With custom HTTP header",
					code:"var m = new aix.model({\n\
	url:\"ajax/data1\",\n\
	data:{\n\
		id : 213\n\
	}\n\
});\n\
// send data with custom HTTP header \n\
m.send(struct.noop(),{\n\
	MyCustom : \"Buke\"\n\
});"
				}
			]
		},

		//#model.fetch
		"model:fetch" : {
			title:"Model.fetch",
			introduce:"<code>model.fetch</code>, fetch the data form server(model's url) with \"GET\" method, auto update as <code>JSON</code> format by default, change <code>model.data</code> with emitter events",
			usages:[
				"model.fetch()",
				"model.fetch(param)",
				"model.fetch(by,header)",
				"model.fetch(param,by,header)"
			],

			params:[
				{ name:"param", type:"Object" },
				{ name:"by", type:"Function" },
				{ name:"header", type:"Object" },
			],
			info:"<p>u can fetch data with queryString when u set <code>param</code> arg, it will trigger the <code>fetch</code> events:</p>\n\
						<p><code>fetch:success</code> or <code>fetch:fail</code></p>\n\
						<p>the arg - <code>by</code> is use to processing data format, must return a data for set</p>",
			related:[
				{ name:"model.send", target:"model:send" },
				{ name:"model.sync", target:"model:sync" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model({\n\
	url:\"ajax/data2\",\n\
	events:{\n\
		\"fetch:success\":function(){\n\
			console.log(this.get());\n\
		}\n\
	}\n\
});\n\
// fetch data\n\
m.fetch();"
				},
				{ 
					title: "Fetch byFilter",
					code:"var m = new aix.model({\n\
	url:\"ajax/data2\",\n\
	events:{\n\
		\"fetch:success\":function(){\n\
			console.log(this.get());\n\
		}\n\
	}\n\
});\n\
// filter the data\n\
m.fetch(function(res){\n\
	return { json: res };\n\
});"
				}
			]
		},

		//#model.sync
		"model:sync" : {
			title:"Model.sync",
			introduce:"<code>model.sync</code> use \"POST\" method to sync the data to Server",
			usages:[
				"model.sync()",
				"model.sync(header)"
			],
			params:[
				{ name:"header", type:"Object" }
			],
			info:"<p>sync with only single param <code>header</code>, use to set [ HTTP Header ]</p>",
			related:[
				{ name:"model.send", target:"model:send" },
				{ name:"model.fetch", target:"model:fetch" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model({\n\
	url:\"ajax/data3\",\n\
	data:{\n\
		a:1,\n\
		b:\"abc\"\n\
	}\n\
});\n\
// sync data to server\n\
m.sync();"
				},
				{ 
					title: "Sync with HTTP Header",
					code:"var m = new aix.model({\n\
	url:\"ajax/data3\",\n\
	data:{\n\
		a:1\n\
	}\n\
});\n\
// sync data to server\n\
m.sync({\n\
	SeeConsole : \"Here\"\n\
});"
				}
			]
		},

		//#model.validate
		"model:validate" : {
			title:"Model [ Validate ]",
			introduce:"<code>model</code> provides a mechanism checker for setting up the data, (this checker will not apply to initialize) before <code>model.change</code>.",
			usages:[
				"validate:",
			],
			params:[
				{ name:"validate", type:"Object" }
			],
			info:"<p><code>validate</code> should be defined at <code>model</code> initialize, if u set <code>model.validate</code>, it would not be any sense.</p><p><code>validate</code> function should return boolean type for checker</p>",
			related:[
				{ name:"model.set", target:"model:set" },
				{ name:"model.moc", target:"model:moc" },
				{ name:"model.fetch", target:"model:fetch" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model({\n\
	validate:{\n\
		a : function(value){\n\
			return typeof value === \"number\";\n\
		}\n\
	},\n\
	events:{\n\
		\"validate:success\":function(){\n\
			console.log(\"validate success!\",this.get());\n\
		},\n\
		\"validate:fail\":function(){\n\
			console.log(\"validate fail!\",this.get());\n\
		}\n\
	}\n\
});\n\
// try to change the data\n\
m.set(\"a\",\"1\");\n\
m.set(\"a\",6);"
				},
				{ 
					title: "Deeping checking",
					code:"var m = new aix.model({\n\
	validate:{\n\
		\"a.b\" : function(value){\n\
			return typeof value === \"string\";\n\
		}\n\
	},\n\
	events:{\n\
		\"validate:success\":function(){\n\
			console.log(\"validate success!\",this.get());\n\
		},\n\
		\"validate:fail\":function(){\n\
			console.log(\"validate fail!\",this.get());\n\
		}\n\
	}\n\
});\n\
// try to change the data\n\
m.set(\"a\",[\"b\",\"c\"]);\n\
m.set(\"a\",{});\n\
m.set(\"a\",{ b : 6 });\n\
m.set(\"a\",{ b : \"7\" });"
				},
				{ 
					title: "Error handling",
					code:"var m = new aix.model({\n\
	validate:{\n\
		\"a.b\" : function(value){\n\
			return typeof value === \"string\";\n\
		},\n\
		\"a.c\" : function(value){\n\
			return +value === value;\n\
		}\n\
	},\n\
	events:{\n\
		\"validate:fail\":function(set,key,value){\n\
			console.log(\n\
				\"set Property [\"+key+\"] with \" + \n\
				\"(\"+value+\") not pass validate\"\n\
			);\n\
		}\n\
	}\n\
});\n\
// try to change the data\n\
m.set(\"a\",[\"b\",\"c\"]);\n\
m.set(\"a\",{ b:6, c:2 });\n\
m.set(\"a\",{ b:\"7\", c:\"2\" })\n\
console.log(\"see the model's data -> \",m.get());"
				}
			]
		},
	});
});
