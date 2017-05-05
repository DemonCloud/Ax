define("data/apidata",
[],
function(){
	// api data
	// binding the template
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
					code:"var m = new ax.model({\n\
	data:{\n\
		b : 1\n\
	}\n\
});\n\
// get data \n\
console.log(m.get());"
				},
				{
					title: "Get with key",
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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
var m = new ax.model({\n\
	data:{\n\
		a : { b:1, c:2, d:{ e:3, f:4 } }\n\
	}\n\
});\n\
// get data \n\
console.log(m.get(\"a.d\",size));\n\
console.log(m.get(\"a.d\",JSON.stringify));"
				}
			]
		},

		//#model.set
		"model:set" : {
			title:"Model.set",
			introduce:"<code>model.set</code> it is mainly used to update the data of the model, <code>ax.model</code> data is <b>immutable</b>, it provides a more secure and reliable mechanism. so change the model.data.* direactly may not work.",
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
					code:"var m = new ax.model(); \n\
// set the data \n\
m.set({ a:1 }); \n\
console.log(m.data);"
				},
				{
					title: "Use key",
					code:"var m = new ax.model();\n\
// set the data\n\
m.set(\"a\",1);\n\
console.log(m.data);"
				},
				{
					title: "Change deeping target",
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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
			info:"<p>sure you model is JSON format, <a href='https://en.wikipedia.org/wiki/JSON' target='_blank'>see more about JSON</a></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new ax.model({\n\
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
				"model.send(header)",
				"model.send(url,header)"
			],

			params:[
				{ name:"url", type:"String" },
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
					code:"var m = new ax.model({\n\
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
					title: "With custom HTTP header",
					code:"var m = new ax.model({\n\
	url:\"ajax/data1\",\n\
	data:{\n\
		id : 213\n\
	}\n\
});\n\
// send data with custom HTTP header \n\
m.send({\n\
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
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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
				"model.sync(header)",
				"model.sync(url,header)"
			],
			params:[
				{ name:"url", type:"String" },
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
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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

		//#model.store
		"model:store" : {
			title:"Model [ Store ]",
			introduce:"<code>model</code> provides a mechanism for data persistence can be stored locally",
			usages:[
				"store:(Boolean)",
			],
			params:[
				{ name:"store", type:"Boolean" }
			],
			info:"<p><code>store</code> property should define with <code>url</code> at the same time, otherwise the storage will not take effect!</p><p>Persistent storage data can be shared by multiple models at the same time, as long as they define the <b>same</b> <code>url</code>.</p><p>store data will be synced when the model <b>changed</b></p>",
			related:[
				{ name:"model.set", target:"model:set" },
				{ name:"model.moc", target:"model:moc" },
				{ name:"model.fetch", target:"model:fetch" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var size = struct.size();\n\
var m = new ax.model({\n\
	url:\"myCustom\",\n\
	store:true,\n\
});\n\
// store data at locally\n\
if(size(m.data)){\n\
	console.log(\"store data: \" + m.toJSON());\n\
}else{\n\
	m.set({ a:1, b:2, c:3, d:4 });\n\
	console.log(\"refresh this page and rerun the code example\");\n\
}"
				},
			]
		},

		//#model.validate
		"model:validate" : {
			title:"Model [ Validate ]",
			introduce:"<code>model</code> provides a mechanism checker for setting up the data, (this checker will not apply to initialize) before <code>model.change</code>.",
			usages:[
				"validate:(Object)",
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
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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
					code:"var m = new ax.model({\n\
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

		//#model.events
		"model:events" : {
			title:"Model [ Events ]",
			introduce:"<code>model.events</code> extend to <code>struct</code> event-dispatching thread, give the events to Object, the events can be easy to extend, there is no performance loss",
			usages:[
				"model.on(type,fn)",
				"model.emit(type,args)",
				"model.unbind(type,fn)",
			],
			params:[
				{ name:"type", type:"String" },
				{ name:"fn", type:"Function" },
				{ name:"args", type:"Array" }
			],
			info:"<p>if not enter <code>fn</code> args, the <code>model.unbind</code>, would remove events of <code>type</code>,</p><p>if not <code>type</code> param, it will remove all the events for this model.</p> <p>model has some basic events , see this table: </p> <h2 tc=4>Built-in events</h2>\n\
<table>\n\
	<thead>\n\
		<tr>\n\
			<th>Event Name</th>\n\
			<th>Event Info</th>\n\
		</tr>\n\
	</thead>\n\
	<tbody>\n\
		<tr>\n\
			<td>init</td>\n\
			<td>when model create, it will trigger <b>once time</b></td>\n\
		</tr>\n\
		<tr>\n\
			<td>change</td>\n\
			<td>when model.data has been changed</td>\n\
		</tr>\n\
		<tr>\n\
			<td>validate</td>\n\
			<td>begin to validate the set-data ( model not change )</td>\n\
		</tr>\n\
		<tr>\n\
			<td>validate:success</td>\n\
			<td>set-data pass validate ( same as \"change\" )</td>\n\
		</tr>\n\
		<tr>\n\
			<td>validate:fail</td>\n\
			<td>set-data fail to pass validate</td>\n\
		</tr>\n\
		<tr>\n\
			<td>send</td>\n\
			<td>begin to send model.data to server</td>\n\
		</tr>\n\
		<tr>\n\
			<td>send:success</td>\n\
			<td>get 200 success or 304 HTTP code</td>\n\
		</tr>\n\
		<tr>\n\
			<td>send:fail</td>\n\
			<td>send fail to server</td>\n\
		</tr>\n\
		<tr>\n\
			<td>fetch</td>\n\
			<td>begin to fetch the data form server</td>\n\
		</tr>\n\
		<tr>\n\
			<td>fetch:success</td>\n\
			<td>get 200 success or 304 HTTP code ( data should pass validate )</td>\n\
		</tr>\n\
		<tr>\n\
			<td>fetch:fail</td>\n\
			<td>fetch fail to server</td>\n\
		</tr>\n\
		<tr>\n\
			<td>sync</td>\n\
			<td>sync the data to server</td>\n\
		</tr>\n\
		<tr>\n\
			<td>sync:success</td>\n\
			<td>get 200 success or 304 HTTP code ( save the data in server )</td>\n\
		</tr>\n\
		<tr>\n\
			<td>sync:fail</td>\n\
			<td>sync data fail to server</td>\n\
		</tr>\n\
	</tbody>\n\
</table>\n\
",
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new ax.model();\n\
// bind change event\n\
m.on(\"change\",function(){\n\
	console.log(\"data has been changed!\",this);\n\
});\n\
m.set(\"a\",1);"
				},
				{ 
					title: "Multiple events",
					code:"var m = new ax.model({\n\
	events:{\n\
		// define at model initialize\n\
		change:function(){\n\
			console.log(\"My Events 0\");\n\
		}\n\
	}\n\
});\n\
// bind change event\n\
m.on(\"change\",function(){\n\
	console.log(\"My Events 1\");\n\
});\n\
m.on(\"change\",function(){\n\
	console.log(\"My Events 2\");\n\
});\n\
m.on(\"change\",function(){\n\
	console.log(\"My Events 3\",this);\n\
});\n\
// trigger change\n\
m.set({ a:1 });"
				},
				{ 
					title: "Proactive trigger",
					code:"var m = new ax.model({\n\
	events:{\n\
		custom:function(a,b){\n\
			console.log(\"see the total \"+(a+b));\n\
		}\n\
	}\n\
});\n\
// Proactive emit with params\n\
m.emit(\"custom\",[2,3]);"
				},
				{ 
					title: "Remove event",
					code:"var m = new ax.model({\n\
	events:{\n\
		change:function(){\n\
			console.log(\"change event 1\");\n\
		}\n\
	}\n\
});\n\
\n\
m.on(\"change\",function(){\n\
	console.log(\"change event 2\");\n\
})\n\
// remove events\n\
m.unbind(\"change\");\n\
\n\
// see emit\n\
console.log(m.set({ a:1,b:2 }));"
				}
			]
		},

		//#model.extend
		"model:extend" : {
			title:"Model [ Extend ]",
			introduce:"<code>model.extend</code>,it provides a way of object-oriented programming",
			usages:[
				"new ax.model.extend(defaultOption)",
			],
			params:[
				{ name:"defaultOption", type:"Object" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new ax.model.extend({\n\
	data:{\n\
		a : 2\n\
	},\n\
	events:{\n\
		change: function(){\n\
			console.log(\"data changed!\",this.get());\n\
		}\n\
	}\n\
});\n\
\n\
// new m constructor\n\
var n = new m();\n\
n.set({ a:1, b:2 });"
				},
				{ 
					title: "Override default option",
					code:"var m = new ax.model.extend({\n\
	data:{\n\
		a : \"abc\"\n\
	}\n\
});\n\
\n\
// new m constructor\n\
var n = new m({\n\
	data:{\n\
		a : \"213\"\n\
	},\n\
	validate:{\n\
		a : function(val){\n\
			return typeof val === \"string\";\n\
		}\n\
	},\n\
	events:{\n\
		\"validate:fail\":function(data,key,val){\n\
			console.log(\n\
				\"can't set [\"+key+\"] as (\"+ val +\")\"\n\
			);\n\
		}\n\
	}\n\
});\n\
\n\
n.set({ a:1, b:2 });\n\
console.log(n.get());"
				}
			]
		},

		//#view.mount
		"view:mount" : {
			title:"View [ mount ]",
			introduce:"<code>mount</code> is once-time function to initialize view ( if not set <code>root</code> property )",
			usages:[
				"view.mount(elm)",
				"view.mount(elm,initdata)"
			],
			params:[
				{ name:"elm", type:"DOMElement,DOMHTMLCollection" },
				{ name:"initdata", type:"Object" }
			],
			info:"<p>if <code>view</code> not define <code>root</code> property, the view will not create <code>render</code> function</p> <p>just create <code>mount</code> once-time function, call <code>mount</code> then create <code>render</code> method</p>",
			related:[
				{ name:"view.render", target:"view:render" }
			],
			examples:[
				{ 
					title: "Basic usage",
					preview:"base",
					code:"var v = new ax.view({\n\
	template:\"&lt;span&gt;Hello &#123;&#123;-text&#125;&#125;&lt;/span&gt;\",\n\
	events:{\n\
		\"click:span\":function(){\n\
			alert(this.innerHTML);\n\
		}\n\
	}\n\
});\n\
// mount to elm\n\
v.mount(\n\
	document.getElementById(\"base\"),\n\
	{ text : \"Mary\" }\n\
)"
				}
			]
		},

		//#view.render
		"view:render" : {
			title:"View [ render ]",
			introduce:"<code>render</code> function create at view initialize ( if set <code>root</code> property )",
			usages:[
				"view.render(...args)",
			],
			params:[
				{ name:"...args", type:"AnyType" }
			],
			info:"<p>create render function must define <code>root</code> property at initialize.</p><p></p><p>u should be care about rewrite render function with <code>(view.render = somefunction )</code>, because rewrite render function make view repackage render events</p>",
			related:[
				{ name:"view.mount", target:"view:mount" },
				{ name:"struct.doom", target:"struct:doom" }
			],
			examples:[
				{ 
					title: "Basic init",
					preview:"base2",
					code:"var v = new ax.view({\n\
	root:document.getElementById(\"base2\"),\n\
	template:\"Hi! &#123;&#123;-text&#125;&#125;\",\n\
	events:{\n\
		init: function(){\n\
			this.render({ text: \"Cloud\" });\n\
		}\n\
	}\n\
});"
				},
				{ 
					title: "Custom render",
					preview:"base3",
					code:"var rs = struct.random(\"string\");\n\
\n\
var v = new ax.view({\n\
	root:document.getElementById(\"base3\"),\n\
	render: function(data){\n\
		var div = document.createElement(\"div\");\n\
		div.innerHTML = data.text;\n\
		return this.root.appendChild(div);\n\
	}\n\
});\n\
\n\
v.render({ text: rs(5) });"
				},
			]
		},

		//#view.props
		"view:props" : {
			title:"View [ props ]",
			introduce:"<code>view.props</code> is methods collection ember in template, it must define at initialize",
			usages:[
				"props:",
			],
			info:"care about <code>props</code> object methods name, dont make same name to <code>render-data</code>",
			related:[
				{ name:"view.mount", target:"view:mount" },
				{ name:"view.render", target:"view:render" }
			],
			examples:[
				{ 
					title: "Basic usage",
					preview:"base",
					code:"var v = new ax.view({\n\
	template:\"Hi! &#123;&#123;#capit(random(length))&#125;&#125;\",\n\
	props:{\n\
		// dont make method name as 'length'\n\
		capit : struct.string(\"capitalize\"),\n\
		random : struct.random(\"string\")\n\
	}\n\
});\n\
\n\
v.mount(\n\
	document.getElementById(\"base\"),\n\
	{ length: 6 }\n\
)"
				}
			]
		},

		//#view.events
		"view:events" : {
			title:"View [ events ]",
			introduce:"<code>view.events</code> provide a complete mechanism within the view on delegate DOM elements and their own custom events for binding. The event is different form <code>model</code>, <code>route</code>",
			usages:[
				"view.on(type,fn)",
				"view.emit(type,args)",
				"view.unbind(type,fn)",
			],
			params:[
				{ name:"type", type:"String" },
				{ name:"fn", type:"Function" },
				{ name:"args", type:"Array" }
			],
			info:"<p><code>view.emit</code> trigger event with mutilp assembly like <code>view.emit(\"event1,event2,event3,...\", [args])</code></p><h2 tc=4>Built-in events</h2>\n\
<table>\n\
	<thead>\n\
		<tr>\n\
			<th>Event Name</th>\n\
			<th>Event Info</th>\n\
		</tr>\n\
	</thead>\n\
	<tbody>\n\
		<tr>\n\
			<td>init</td>\n\
			<td>when view create, it will trigger <b>once time</b> ( even if it not mount or not trigger render )</td>\n\
		</tr>\n\
		<tr>\n\
			<td>beforeRender</td>\n\
			<td>before calling the <b>render</b> function</td>\n\
		</tr>\n\
		<tr>\n\
			<td>completed</td>\n\
			<td>when <b>render</b> completed</td>\n\
		</tr>\n\
	</tbody>\n\
</table>\n\
",
			examples:[
				{ 
					title: "Basic usage",
					preview:"v1",
					code:"var v = new ax.view({\n\
	root:document.getElementById(\"v1\"),\n\
	template:\"&#123;&#123;-number&#125;&#125;\",\n\
	events:{\n\
		init: function(){\n\
			this.render({ number: 2 });\n\
		}\n\
	}\n\
});"
				},
				{ 
					title: "Detect beforeRender",
					preview:"v2",
					code:"var v = new ax.view({\n\
	root:document.getElementById(\"base\"),\n\
	template:\"&#123;&#123;-number&#125;&#125;\"\n\
});\n\
\n\
v.on(\"beforeRender\",function(data){\n\
	data.number += 2;\n\
});\n\
\n\
v.mount(\n\
	document.getElementById(\"v2\"),\n\
	{ number : 8 }\n\
)"
				},
				{ 
					title: "Custom event",
					preview:"v3",
					code:"var v = new ax.view({\n\
	template:\"&lt;input id='t' &gt;\" +\n\
					 \"&lt;button&gt;send&lt;/button&gt;\",\n\
	events:{\n\
		\"click:button\":function(event){\n\
			event.preventDefault();\n\
			var input = document.getElementById(\"t\");\n\
\n\
			// event.data.self -> view *this\n\
			event.data.self.emit(\n\
				\"send\",\n\
				[input.value,input.value = \"\"]\n\
			);\n\
		},\n\
\n\
		send:function(msg){\n\
			alert(\"your msg [ \" +\n\
						msg +\n\
						\" ]\ has been send!\"\n\
			);\n\
		}\n\
	}\n\
});\n\
\n\
v.mount(\n\
	document.getElementById(\"v3\"),\n\
	void 0\n\
)"
				}
			]
		},

		//#view.extend
		"view:extend" : {
			title:"View [ Extend ]",
			introduce:"<code>view.extend</code>,it provides a way of object-oriented programming",
			usages:[
				"new ax.view.extend(defaultOption)",
			],
			params:[
				{ name:"defaultOption", type:"Object" }
			],
			examples:[
				{ 
					title: "Basic usage",
					preview:"v",
					code:"var v = new ax.view.extend({\n\
	root: document.getElementById(\"v\"),\n\
	template: \"&lt;span&gt;&#123;&#123;-code&#125;&#125;&lt;/span&gt;\",\n\
	events: {\n\
		init : function(){\n\
			this.render(this.state);\n\
		}\n\
	}\n\
});\n\
\n\
// extend v\n\
var view = new v({\n\
	state : {\n\
		code : \"JavaScript\"\n\
	}\n\
});"
				}
			]
		},

		//#route.listen
		"route:listen" : {
			title:"Route.listen",
			introduce:"<code>route.listen</code> let route start listening the change",
			usages:[
				"route.listen()",
				"route.listen(default)",
				"route.listen(default,params)"
			],
			related:[
				{ name:"route.assign", target:"route:assign" }
			],
			params:[
				{ name:"default", type:"String" },
				{ name:"params",  type:"Object" }
			],
			info:"<p>use it to start <code>routes</code> actions</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var route = new ax.route({\n\
	routes:{\n\
		\"^post\":\"renderPost\"\n\
	},\n\
	actions:{\n\
		renderPost:function(param){\n\
			alert(\n\
				\"goto hash post! \" + \n\
				JSON.stringify(param)\n\
			);\n\
		}\n\
	}\n\
});\n\
\n\
route.listen(\"post\",{a:1,b:2});"
				},
				{ 
					title: "Init",
					not: true,
					code:"var route = new ax.route({\n\
	routes:{\n\
		\"^index\":\"index\"\n\
	},\n\
	actions:{\n\
		index:function(param){\n\
			// ...\n\
		}\n\
	},\n\
	events:{\n\
		init:function(){\n\
			// auto start listen at create\n\
			this.listen();\n\
		}\n\
	}\n\
});\n\
"
				}
			]
		},

		//#route.stop
		"route:stop" : {
			title:"Route.stop",
			introduce:"<code>route.stop</code> let route stop listening the change.",
			usages:[
				"route.stop()"
			],
			info:"<p>use it to stop <code>routes</code> actions</p>"
		},

		//#route.assign
		"route:assign" : {
			title:"Route.assign",
			introduce:"<code>route.assign</code> trigger hashchange",
			usages:[
				"route.assign(hash)",
				"route.assign(hash,params)"
			],
			related:[
				{ name:"route.listen", target:"route:listen" }
			],
			params:[
				{ name:"hash", type:"String" },
				{ name:"params", type:"Object" }
			],
			info:"do not add param char in hash string",
			examples:[
				{ 
					title: "Basic usage",
					not : true,
					code:"// assign to route \"post\" with param \n\
var route = new ax.route( /*...*/ )\n\
route.assign(\"post\",{ id : 10243 });"
				},
			]
		},

		//#route.events
		"route:events" : {
			title:"Route [ events ]",
			introduce:"<code>route.events</code> base events method with route",
			usages:[
				"route.on(type,fn)",
				"route.emit(type,args)",
				"route.unbind(type,fn)",
			],
			params:[
				{ name:"type", type:"String" },
				{ name:"fn", type:"Function" },
				{ name:"args", type:"Array" }
			],
			info:"<p><code>view.emit</code> </p><h2 tc=4>Built-in events</h2>\n\
<table>\n\
	<thead>\n\
		<tr>\n\
			<th>Event Name</th>\n\
			<th>Event Info</th>\n\
		</tr>\n\
	</thead>\n\
	<tbody>\n\
		<tr>\n\
			<td>init</td>\n\
			<td>when route create, it will trigger <b>once time</b></td>\n\
		</tr>\n\
	</tbody>\n\
</table>\n\
",
			examples:[
				{ 
					title: "Basic usage",
					not : true,
					code:"var v = new ax.route({\n\
	events:{\n\
		init: function(){\n\
			this.listen(\"index\");\n\
		}\n\
	}\n\
});"
				}
			]
		},

		//#route.extend
		"route:extend" : {
			title:"Route [ Extend ]",
			introduce:"<code>route.extend</code>,it provides a way of object-oriented programming",
			usages:[
				"new ax.route.extend(defaultOption)",
			],
			params:[
				{ name:"defaultOption", type:"Object" }
			],
			examples:[
				{ 
					title: "Basic usage",
					not: true,
					code:"var route = new ax.route.extend({\n\
		routes : { /* ... */ },\n\
		actions : { /* ... */ },\n\
		init : function(){\n\
			this.listen(\"index\");\n\
		}\n\
	}\n\
});\n\
\n\
// extend route\n\
var r = new route();"
				}
			]
		},

		//#struct.define
		"struct:define" : {
			title:"define",
			introduce:"<code>struct.define</code> use to define property for object",
			usages:[
				"define -> struct.define()",
				"define(obj,name,props)"
			],
			params:[
				{ name:"obj", type:"Object,Array,Function" },
				{ name:"name", type:"String,Object(properties)" },
				{ name:"props", type:"Object" },
			],
			info:"<p>this use method contain <b>Object.defineProperty</b> and <b>Object.defineProperties</b></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var define = struct.define();\n\
var obj = {};\n\
\n\
define(obj,\"a\",{\n\
	value: 1,\n\
	configurable:false,\n\
	enumerable:true,\n\
	writable:false\n\
});\n\
\n\
console.log(obj);\n\
obj.a = 2;\n\
console.log(obj);"
				},
			]
		},

		//#struct.extend
		"struct:extend" : {
			title:"extend",
			introduce:"<code>struct.extend</code> use to extend property for origin object, will change <b>not</b> origin and return itself",
			usages:[
				"extend -> struct.extend()",
				"extend(org,obj)"
			],
			params:[
				{ name:"org", type:"Object,Array" },
				{ name:"obj", type:"Object,Array" },
			],
			related:[
				{ name:"struct.depextend", target:"struct:depextend" }
			],
			info:"<p>extend method can also use for Array</p><p>method compress to <code>ax.model</code>, use it as <code>model.extend(target)</code> (compress model data)</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var extend = struct.extend();\n\
var obj = {};\n\
\n\
extend(obj,{ a:1,b:2 });\n\
console.log(obj);"
				},
				{ 
					title: "Use for Array",
					code:"var extend = struct.extend();\n\
var arr = [1,2,3,4];\n\
\n\
extend(arr,[5,6,7]);\n\
console.log(arr);"
				}
			]
		},

		//#struct.depextend
		"struct:depextend" : {
			title:"depextend",
			introduce:"<code>struct.depextend</code> use to extend property for origin object, will <b>change</b> origin and return itself",
			usages:[
				"depextend -> struct.depextend()",
				"depextend(org,obj)"
			],
			params:[
				{ name:"org", type:"Object,Array" },
				{ name:"obj", type:"Object,Array" },
			],
			related:[
				{ name:"struct.extend", target:"struct:extend" }
			],
			info:"<p>depextend method can also use for Array</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var extend = struct.depextend();\n\
var obj = {};\n\
\n\
var b = extend(obj,{ a:1,b:2 });\n\
console.log(obj,b);"
				},
				{ 
					title: "Use for Array",
					code:"var extend = struct.depextend();\n\
var arr = [1,2,3,4];\n\
\n\
var b = extend(arr,[5,6,7]);\n\
console.log(arr,b);"
				}
			]
		},

		//#struct.keys
		"struct:keys" : {
			title:"keys",
			introduce:"<code>struct.keys</code> use to extend property for origin object, will <b>change</b> origin and return itself",
			usages:[
				"keys -> struct.keys()",
				"keys(obj)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
			],
			info:"<p>Progressive enhancement with this keys method</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var keys = struct.keys();\n\
var obj = {a:1,b:2};\n\
var arr = [1,2,3];\n\
\n\
console.log(keys(obj));\n\
console.log(keys(arr));"
				}
			]
		},

		//#struct.noop
		"struct:noop" : {
			title:"noop",
			introduce:"<code>struct.noop</code> point at useless function", 
			usages:[
				"noop -> struct.noop()",
			],
			info:"<p>Generally make useless function point to it</p>"
		},

		//#struct.clone
		"struct:clone" : {
			title:"clone",
			introduce:"<code>struct.clone</code> base , fast copy Object and Array",
			usages:[
				"clone -> struct.clone()",
				"clone(obj)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
			],
			related:[
				{ name:"struct.slice", target:"struct:slice" },
				{ name:"struct.depclone", target:"struct:depclone" }
			],
			info:"<p>For arrays, the clone method just shallow copy, for object, clone copies only pure data objects</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var clone = struct.clone();\n\
var obj = { a:1, b:2 };\n\
var obj2 = clone(obj);\n\
\n\
console.log(obj,obj2,obj===obj2);"
				},
				{ 
					title: "Clone array",
					code:"var clone = struct.clone();\n\
var arr = [{a:1},{b:2}];\n\
var arr2 = clone(arr);\n\
\n\
// care about array\n\
console.log(arr2,arr===arr2,arr[0]===arr2[0]);"
				}
			]
		},

		//#struct.depclone
		"struct:depclone" : {
			title:"depclone",
			introduce:"deeping clone the Object, Array with there prototypes",
			usages:[
				"depclone -> struct.depclone()",
				"depclone(obj)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
			],
			related:[
				{ name:"struct.clone", target:"struct:clone" }
			],
			info:"<p>deeping clone copy the Object, Array completed with there data and prototype</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var clone = struct.depclone();\n\
var obj = { a:1, b:2 };\n\
var obj2 = clone(obj);\n\
\n\
console.log(obj,obj2,obj===obj2);"
				},
				{ 
					title: "Clone array",
					code:"var clone = struct.depclone();\n\
var arr = [{a:1},{b:2}];\n\
var arr2 = clone(arr);\n\
\n\
// care about array\n\
console.log(arr2,arr===arr2,arr[0]===arr2[0]);"
				}
			]
		},

		//#struct.not
		"struct:not" : {
			title:"not",
			introduce:"<code>struct.not</code> use to remove target value in Object, Array",
			usages:[
				"not -> struct.not()",
				"not(obj,find)",
				"not(obj,find,useEqual)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
				{ name:"find", type:"AnyType (exist RegExp)" },
				{ name:"useEqual", type:"Boolean" },
			],
			related:[
				{ name:"struct.cat", target:"struct:cat" },
				{ name:"struct.find(filter)", target:"struct:find" }
			],
			info:"support <b>RegExp</b> to match the value what u wanto remove",
			examples:[
				{ 
					title: "Basic usage",
					code:"var not = struct.not();\n\
var obj = [1,2,3,4,5,6];\n\
var obj2 = [1,2,3,4,5,6,7];\n\
\n\
not(obj,2);\n\
not(obj2,4);\n\
\n\
console.log(obj,obj2);"
				},
				{ 
					title: "Use equal",
					code:"var not = struct.not();\n\
var obj = [{a:1},{b:2},{c:3},{d:4}];\n\
\n\
// use equal compare\n\
not(obj,{a:1},true);\n\
\n\
console.log(obj);"
				},
				{ 
					title: "Use RegExp",
					code:"var not = struct.not();\n\
var obj = [\"abc\",\"sbc\",\"eds\",\"bce\",\"acb\"];\n\
\n\
// use RegExp to compare\n\
not(obj,/bc/,true);\n\
\n\
console.log(obj);"
				},
				{ 
					title: "For Object",
					code:"var not = struct.not();\n\
var obj = { a:1,b:2,c:3,d:1,e:1 };\n\
\n\
not(obj,1);\n\
\n\
console.log(obj);"
				}
			]
		},

		//#struct.cat
		"struct:cat" : {
			title:"cat",
			introduce:"<code>struct.cat</code> use to remove target and cat remove value for return",
			usages:[
				"cat -> struct.cat()",
				"cat(obj,idf)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
				{ name:"idf", type:"AnyType (exist RegExp)" },
			],
			related:[
				{ name:"struct.not", target:"struct:not" }
			],
			info:"support <b>RegExp</b> to match the value what u wanto remove and cat",
			examples:[
				{ 
					title: "Basic usage",
					code:"var cat = struct.cat();\n\
var obj = [1,2,3,4,5,6];\n\
var cobj = cat(obj,function(n){ return n>3 });\n\
// part2\n\
var obj2 = [1,1,3,4,5];\n\
var cobj2 = cat(obj2,1);\n\
\n\
console.log(obj,cobj);\n\
console.log(obj2,cobj2);"
				},
				{ 
					title: "Use Regexp",
					code:"var cat = struct.cat();\n\
var obj = [\"abc\",\"asd\",\"vjs\",\"bsd\",\"zos\"];\n\
var cobj = cat(obj,/a/);\n\
\n\
console.log(obj,cobj);"
				},
				{ 
					title: "For Object",
					code:"var cat = struct.cat();\n\
var obj = {a:1,b:2,c:3,d:4,f:5};\n\
var cobj = cat(obj,function(v){ return v>3 });\n\
\n\
console.log(obj,cobj);"
				}
			]
		},

		//#struct.slice
		"struct:slice" : {
			title:"slice",
			introduce:"<code>struct.slice</code> fast copy Array(shawllow) and convert ArrayLike to array",
			usages:[
				"slice -> struct.slice()",
				"slice(obj)"
			],
			params:[
				{ name:"obj", type:"Array" }
			],
			related:[
				{ name:"struct.clone", target:"struct:clone" }
			],
			info:"<p>use it to copy Array or convert ArrayLike( arguments )</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var slice = struct.slice();\n\
var obj = [1,2,3,4];\n\
console.log(slice(obj));"
				},
				{
					title: "Slice arguments",
					code:"var slice = struct.slice();\n\
var fn = function(){\n\
	return slice(arguments);\n\
};\n\
console.log(fn(1,2,3,\"4\"));"
				}
			]
		},

		//#struct.find
		"struct:find" : {
			title:"find",
			introduce:"<code>struct.find</code> fast filter value for Object and Array", 
			usages:[
				"alias: (filter)",
				"find -> struct.find()",
				"filter -> struct.filter()",
				"find(obj,idf)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
				{ name:"idf", type:"Function,RegExp"  }
			],
			related:[
				{ name:"struct.reject", target:"struct:reject" },
				{ name:"struct.not", target:"struct:not" },
				{ name:"struct.cat", target:"struct:cat" }
			],
			info:"<p>use to filter Object</p><p>it return new <code>copy</code></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var find = struct.find();\n\
var obj = [1,2,3,4];\n\
var fobj = find(obj,function(n){\n\
	return n>2;\n\
});\n\
console.log(obj,fobj);"
				},
				{ 
					title: "Use RegExp",
					code:"var find = struct.find();\n\
var obj = [\"abc\",\"cad\",\"sad\",\"csv\",\"dfa\",\"bfw\"];\n\
var fobj = find(obj,/d/)\n\
console.log(obj,fobj);"
				},
				{ 
					title: "For Object",
					code:"var find = struct.find();\n\
var obj = { a:\"as\", b:\"sd\", c:\"saw\", d:\"vc\" }\n\
var fobj = find(obj,/a/)\n\
console.log(obj,fobj);"
				}
			]
		},

		//#struct.reject
		"struct:reject" : {
			title:"reject",
			introduce:"<code>struct.reject</code> fast filter value for Object and Array, reverse to filter", 
			usages:[
				"reject -> struct.reject()",
				"reject(obj,idf)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
				{ name:"idf", type:"Function,RegExp"  }
			],
			related:[
				{ name:"struct.find(filter)", target:"struct:find" },
				{ name:"struct.not", target:"struct:not" },
				{ name:"struct.cat", target:"struct:cat" }
			],
			info:"<p>use to filter Object</p><p>it return new <code>copy</code></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var reject = struct.reject();\n\
var obj = [1,2,3,4];\n\
var fobj = reject(obj,function(n){\n\
	return n>2;\n\
});\n\
console.log(obj,fobj);"
				},
				{ 
					title: "Use RegExp",
					code:"var reject = struct.reject();\n\
var obj = [\"abc\",\"cad\",\"sad\",\"csv\",\"dfa\",\"bfw\"];\n\
var fobj = reject(obj,/d/)\n\
console.log(obj,fobj);"
				},
				{ 
					title: "For Object",
					code:"var reject = struct.reject();\n\
var obj = { a:\"as\", b:\"sd\", c:\"saw\", d:\"vc\" }\n\
var fobj = reject(obj,/a/)\n\
console.log(obj,fobj);"
				}
			]
		},

		//#struct.every
		"struct:every" : {
			title:"every",
			introduce:"<code>struct.every</code> check if all the value pass identify", 
			usages:[
				"every -> struct.every()",
				"every(obj,idf)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
				{ name:"idf", type:"Function,RegExp"  }
			],
			related:[
				{ name:"struct.some", target:"struct:some" },
			],
			info:"<p>Also can use for RegExp</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var every = struct.every();\n\
var obj = [1,2,3,4];\n\
var fobj = every(obj,function(n){\n\
	return n>0;\n\
});\n\
console.log(fobj);"
				}
			]
		},

		//#struct.some
		"struct:some" : {
			title:"some",
			introduce:"<code>struct.some</code> check if there is at least one pass identify", 
			usages:[
				"some -> struct.some()",
				"some(obj,idf)"
			],
			params:[
				{ name:"obj", type:"Object,Array" },
				{ name:"idf", type:"Function,RegExp"  }
			],
			related:[
				{ name:"struct.every", target:"struct:every" },
			],
			info:"<p>Also can use for RegExp</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var some = struct.some();\n\
var obj = [1,2,3,4];\n\
var fobj = some(obj,function(n){\n\
	return n>3;\n\
});\n\
console.log(fobj);"
				}
			]
		},

		//#struct.diff
		"struct:diff" : {
			title:"diff",
			introduce:"<code>struct.diff</code> diff the Array", 
			usages:[
				"diff -> struct.diff()",
				"diff(...args)"
			],
			params:[
				{ name:"args", type:"Array" },
			],
			related:[
				{ name:"struct.intsec", target:"struct:intsec" },
			],
			info:"diff any length Array arguments",
			examples:[
				{ 
					title: "Basic usage",
					code:"var diff = struct.diff();\n\
var df = diff([1,2,3,4],[0,3,4]);\n\
console.log(df);"
				},
				{ 
					title: "Mutilp usage",
					code:"var diff = struct.diff();\n\
var df = diff([0,3,4],[2,0,1,4],[\"3\",3]);\n\
console.log(df);"
				},
				{ 
					title: "With single value",
					code:"var diff = struct.diff();\n\
var df = diff([0,4],3,4,[\"3\",3]);\n\
console.log(df);"
				}
			]
		},

		//#struct.intsec
		"struct:intsec" : {
			title:"intsec",
			introduce:"<code>struct.intsec</code> intsec same values the Array", 
			usages:[
				"intsec -> struct.intsec()",
				"intsec(...args)"
			],
			params:[
				{ name:"args", type:"Array" },
			],
			related:[
				{ name:"struct.diff", target:"struct:diff" },
			],
			info:"intsec same any length Array arguments",
			examples:[
				{ 
					title: "Basic usage",
					code:"var intsec = struct.intsec();\n\
var df = intsec([1,2,4],[2,4],[4,2]);\n\
console.log(df);"
				},
				{ 
					title: "Mutilp usage",
					code:"var intsec = struct.intsec();\n\
var df = intsec([0,3],[2,0,3],[\"3\",0]);\n\
console.log(df);"
				},
				{ 
					title: "For same object",
					code:"var intsec = struct.intsec();\n\
var df = intsec([{a:1}],[{a:1},{b:1}],[{a:1},{c:2}]);\n\
console.log(df);"
				}
			]
		},

		//#struct.chunk
		"struct:chunk" : {
			title:"chunk",
			introduce:"<code>struct.chunk</code> make part for array", 
			usages:[
				"chunk -> struct.chunk()",
				"chunk(arr,size)"
			],
			params:[
				{ name:"arr", type:"Array" },
				{ name:"size", type:"Number" },
			],
			info:"default size part of 2",
			examples:[
				{ 
					title: "Basic usage",
					code:"var chunk = struct.chunk();\n\
console.log(chunk([1,2,3,4,5,6],3));"
				},
				{ 
					title: "Default part",
					code:"var chunk = struct.chunk();\n\
console.log(chunk([1,2,3,4,5,6]));"
				}
			]
		},

		//#struct.compact
		"struct:compact" : {
			title:"compact",
			introduce:"<code>struct.compact</code> filter true value for Array", 
			usages:[
				"compact -> struct.compact()",
				"compact(arr)"
			],
			params:[
				{ name:"arr", type:"Array" },
			],
			related:[
				{ name:"struct.find(filter)", target:"struct:find" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var compact = struct.compact();\n\
console.log(compact([null,1,undefined,2,\"0\",0,\"a\",true,false]));"
				},
			]
		},

		//#struct.pluck
		"struct:pluck" : {
			title:"pluck",
			introduce:"<code>struct.pluck</code> collect target values list", 
			usages:[
				"pluck -> struct.pluck()",
				"pluck(list,mapkey)",
				"pluck(list,mapkey,dowith)"
			],
			params:[
				{ name:"list", type:"Array,Object" },
				{ name:"mapkey", type:"String" },
				{ name:"dowith", type:"String,Function" },
			],
			related:[
				{ name:"struct.groupBy", target:"struct:groupBy" },
				{ name:"struct.countBy", target:"struct:countBy" }
			],
			info:"<p>use the dowith to fack the value</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var pluck = struct.pluck();\n\
var data = { \n\
	a : { a : 1, b : 6 }, \n\
	b : { a : 2, b : 5 }, \n\
	c : { a : 3, b : 4 }, \n\
	d : { a : 4, b : 3 }, \n\
	e : { a : 5, b : 2 }, \n\
	f : { a : 6, b : 1 } \n\
};\n\
console.log(pluck(data,\"a\"));\n\
console.log(pluck(data,\"b\",\"toString\"));"
				},
				{ 
					title: "Deeping key",
					code:"var pluck = struct.pluck();\n\
var data = { \n\
	a : [ { a:[1,2] }, { b:[6,7] } ], \n\
	b : [ { a:[2,3] }, { b:[5,6] } ], \n\
	c : [ { a:[3,4] }, { b:[4,5] } ], \n\
	d : [ { a:[4,5] }, { b:[3,4] } ], \n\
	e : [ { a:[5,6] }, { b:[2,3] } ], \n\
	f : [ { a:[6,7] }, { b:[1,2] } ] \n\
};\n\
console.log(pluck(data,\"0.a.1\"));\n\
console.log(pluck(data,\"1.b.0\",\"toString\"));"
				}
			]
		},

		//#struct.groupBy
		"struct:groupBy" : {
			title:"groupBy",
			introduce:"<code>struct.groupBy</code> group part of data", 
			usages:[
				"groupBy -> struct.groupBy()",
				"groupBy(list,by)",
			],
			params:[
				{ name:"list", type:"Array" },
				{ name:"by", type:"String,Function" },
			],
			related:[
				{ name:"struct.pluck", target:"struct:pluck" },
				{ name:"struct.countBy", target:"struct:countBy" }
			],
			info:"<p>use the dowith to fack the value</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var groupBy = struct.groupBy();\n\
var data = [ \n\
	{ name : \"Nike\"   , score : 68 }, \n\
	{ name : \"Joye\"   , score : 30 }, \n\
	{ name : \"Sam\"    , score : 81 }, \n\
	{ name : \"Cloudy\" , score : 22 }, \n\
	{ name : \"Marry\"  , score : 98 }, \n\
	{ name : \"Leon\"   , score : 94 } \n\
];\n\
var check = groupBy(data,function(item){\n\
	return item.score>60 ? \"pass\" : \"notpass\";\n\
});\n\
console.log(check);"
				},
				{ 
					title: "By porperty",
					code:"var groupBy = struct.groupBy();\n\
var data = [ \n\
	{ name : \"Nike\"   , course : [1,3] }, \n\
	{ name : \"Nike\"   , course : [6,9] }, \n\
	{ name : \"Sam\"    , course : [1] }, \n\
	{ name : \"Cloudy\" , course : [4,6] }, \n\
	{ name : \"Sam\"    , course : [2,4] }, \n\
	{ name : \"Leon\"   , course : [9] } \n\
];\n\
var check = groupBy(data,\"name\")\n\
console.log(check);"
				}
			]
		},

		//#struct.countBy
		"struct:countBy" : {
			title:"countBy",
			introduce:"<code>struct.countBy</code> group part of data", 
			usages:[
				"countBy -> struct.countBy()",
				"countBy(list,by)",
			],
			params:[
				{ name:"list", type:"Array" },
				{ name:"by", type:"String,Function" },
			],
			related:[
				{ name:"struct.pluck", target:"struct:pluck" },
				{ name:"struct.groupBy", target:"struct:groupBy" }
			],
			info:"<p>use the dowith to fack the value</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var countBy = struct.countBy();\n\
var data = [ \n\
	{ name : \"Nike\"   , score : 68 }, \n\
	{ name : \"Joye\"   , score : 30 }, \n\
	{ name : \"Sam\"    , score : 81 }, \n\
	{ name : \"Cloudy\" , score : 22 }, \n\
	{ name : \"Marry\"  , score : 98 }, \n\
	{ name : \"Leon\"   , score : 94 } \n\
];\n\
var check = countBy(data,function(item){\n\
	return item.score>60 ? \"pass\" : \"notpass\";\n\
});\n\
console.log(check);"
				},
				{ 
					title: "By porperty",
					code:"var countBy = struct.countBy();\n\
var data = [ \n\
	{ name : \"Nike\"   , course : [1,3] }, \n\
	{ name : \"Nike\"   , course : [6,9] }, \n\
	{ name : \"Sam\"    , course : [1] }, \n\
	{ name : \"Cloudy\" , course : [4,6] }, \n\
	{ name : \"Sam\"    , course : [2,4] }, \n\
	{ name : \"Leon\"   , course : [9] } \n\
];\n\
var check = countBy(data,\"name\")\n\
console.log(check);"
				}
			]
		},

		//#struct.concat
		"struct:concat" : {
			title:"concat",
			introduce:"<code>struct.concat</code> concat mutilp array", 
			usages:[
				"concat -> struct.concat()",
				"concat(..args)"
			],
			params:[
				{ name:"..args", type:"Array,SingleValue" },
			],
			related:[
				{ name:"struct.merge", target:"struct:merge" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var concat = struct.concat();\n\
console.log(concat([1,2],[3,4,5],6,[7],8))"
				},
			]
		},

		//#struct.cast
		"struct:cast" : {
			title:"cast",
			introduce:"<code>struct.cast</code> fast cast arguments", 
			usages:[
				"cast -> struct.cast()",
				"cast(..args)"
			],
			params:[
				{ name:"..args", type:"AnyType" },
			],
			related:[
				{ name:"struct.concat", target:"struct:concat" },
				{ name:"struct.merge", target:"struct:merge" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var cast = struct.cast();\n\
console.log(cast([1,2],[3,4,5],6,[7],8));"
				},
			]
		},

		//#struct.shuffle
		"struct:shuffle" : {
			title:"shuffle",
			introduce:"<code>struct.shuffle</code> array of random sequence", 
			usages:[
				"shuffle -> struct.shuffle()",
				"shuffle()"
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var shuffle = struct.shuffle();\n\
console.log(shuffle([1,2,3,4,5,6]));\n\
console.log(shuffle([1,2,3,4,5,6]));"
				},
			]
		},

		//#struct.first
		"struct:first" : {
			title:"first",
			introduce:"<code>struct.first</code> first value in array", 
			usages:[
				"first -> struct.first()",
				"first(ary)"
			],
			params:[
				{ name:"ary", type:"Array" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var first = struct.first();\n\
console.log(first([1,2,3]));"
				},
			]
		},

		//#struct.last
		"struct:last" : {
			title:"last",
			introduce:"<code>struct.last</code> last value in array", 
			usages:[
				"last -> struct.last()",
				"last(ary)"
			],
			params:[
				{ name:"ary", type:"Array" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var last = struct.last();\n\
console.log(last([1,2,3]));"
				},
			]
		},

		//#struct.flat
		"struct:flat" : {
			title:"flat",
			introduce:"<code>struct.flat</code> deconstruction array", 
			usages:[
				"flat -> struct.flat()",
				"flat(arr,deep)",
			],
			params:[
				{ name:"arr", type:"Array" },
				{ name:"deep", type:"Boolean" },
			],
			related:[
				{ name:"struct.merge", target:"struct:merge" },
				{ name:"struct.pluck", target:"struct:pluck" }
			],
			info:"<p>default use a layer of flat</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var flat = struct.flat();\n\
console.log(flat([1,2,[3,4,[5,6,[7,8]]]]));"
				},
				{ 
					title: "Deeping flat",
					code:"var flat = struct.flat();\n\
console.log(flat([1,2,[3,4,[5,6,[7,8]]]],true));"
				},
			]
		},

		//#struct.merge
		"struct:merge" : {
			title:"merge",
			introduce:"<code>struct.merge</code> merge the same data on mutilp array", 
			usages:[
				"merge -> struct.merge()",
				"merge(...args)",
			],
			params:[
				{ name:"...args", type:"Array" },
			],
			related:[
				{ name:"struct.concat", target:"struct:concat" },
				{ name:"struct.unique", target:"struct:unique" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var merge = struct.merge();\n\
console.log(merge([1,2,3],[2,4,3],[2,1],[5,1]));"
				}
			]
		},

		//#struct.auto
		"struct:auto" : {
			title:"auto",
			introduce:"<code>struct.auto</code> random slice part in Array  or String", 
			usages:[
				"auto -> struct.auto()",
				"auto(arr)",
				"auto(arr,num)",
			],
			params:[
				{ name:"arr", type:"Array,String" },
				{ name:"num", type:"Number" },
			],
			related:[
				{ name:"struct.shuffle", target:"struct:shuffle" },
				{ name:"struct.random", target:"struct:random" }
			],
			info:"<p>default part size 1</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var auto = struct.auto();\n\
console.log(auto([1,2,3,4,5]));\n\
console.log(auto([1,2,3,4,5],3));"
				},
				{ 
					title: "For String",
					code:"var auto = struct.auto();\n\
console.log(auto(\"Hello\"));\n\
console.log(auto(\"SKULLCANDY\",3));"
				}
			]
		},

		//#struct.part
		"struct:part" : {
			title:"part",
			introduce:"<code>struct.part</code> generate part times function", 
			usages:[
				"part -> struct.part()",
				"part(fn)",
				"part(fn,times)",
			],
			params:[
				{ name:"fn", type:"Function" },
				{ name:"times", type:"Number" },
			],
			related:[
				{ name:"struct.once", target:"struct:once" },
			],
			info:"<p>default part size 1, if not has <code>times</code> param, the <code>part(fn)</code> equal to use <code>once(fn)</code></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var part = struct.part();\n\
var a = 0;\n\
var fn = part(function(){ a++; },2);\n\
// run it 4 times\n\
fn();fn();fn();fn();\n\
console.log(a);"
				},
			]
		},

		//#struct.once
		"struct:once" : {
			title:"once",
			introduce:"<code>struct.once</code> generate once times function", 
			usages:[
				"once -> struct.once()",
				"once(fn)",
			],
			params:[
				{ name:"fn", type:"Function" },
			],
			related:[
				{ name:"struct.part", target:"struct:part" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var once = struct.once();\n\
var a = 0;\n\
var fn = once(function(){ a++; });\n\
// run it 4 times\n\
fn();fn();fn();fn();\n\
console.log(a);"
				},
			]
		},

		//#struct.eq
		"struct:eq" : {
			title:"eq",
			introduce:"<code>struct.eq</code> advanced method to compare isEqual", 
			usages:[
				"eq -> struct.eq()",
				"eq(a,b)",
			],
			params:[
				{ name:"a,b", type:"AnyType" },
			],
			info:"<p>By default, we use <code>==</code> and <code>===</code> to compare two variable in JavaScript. Think that : <code>{a:1}==={a:1}</code>, In theory，we believe that as long as the key and value are the same object should be equal</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var eq = struct.eq();\n\
console.log({a:1}==={a:1});\n\
console.log(eq({a:1},{a:1}));"
				},
				{ 
					title: "Complex data",
					code:"var eq = struct.eq();\n\
console.log(eq(\n\
	[{a:[{b:1,c:[2,{d:3,e:[4,5]}]}]}],\n\
	[{a:[{b:1,c:[2,{d:3,e:[4,5]}]}]}]\n\
));"
				},
			]
		},

		//#struct.values
		"struct:values" : {
			title:"values",
			introduce:"<code>struct.values</code> directly get values collection form Object", 
			usages:[
				"values -> struct.values()",
				"values(obj)",
			],
			params:[
				{ name:"obj", type:"Object" },
			],
			info:"<p>also use it for String, but not make sense</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var values = struct.values();\n\
console.log(values({ a:1, b:2, d:\"3\"}));"
				},
				{ 
					title: "Complex data",
					code:"var values = struct.values();\n\
console.log((values(\"MyName\")));"
				},
			]
		},

		//#struct.memoize
		"struct:memoize" : {
			title:"memoize",
			introduce:"<code>struct.memoize</code> create memoize function ,store result in memory", 
			usages:[
				"memoize -> struct.memoize()",
				"memoize(fn)",
				"memoize(fn,context)",
			],
			params:[
				{ name:"fn", type:"Function" },
				{ name:"context", type:"AnyType" },
			],
			info:"<p><code>context</code> allow u bind this for <code>fn</code>.</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var memoize = struct.memoize();\n\
var b = 1;\n\
var fn = function(a){\n\
	// variable [b] natural growth\n\
	return a+(b++);\n\
};\n\
var fnmemo = memoize(fn);\n\
\n\
console.log(fnmemo(1));\n\
console.log(fnmemo(1));\n\
console.log(fnmemo(1));"
				}
			]
		},

		//#struct.negate
		"struct:negate" : {
			title:"negate",
			introduce:"<code>struct.negate</code> create reverse result function", 
			usages:[
				"negate -> struct.negate()",
				"negate(fn)",
				"negate(fn,context)",
			],
			params:[
				{ name:"fn", type:"Function" },
				{ name:"context", type:"AnyType" },
			],
			info:"<p><code>context</code> allow u bind this for <code>fn</code>.</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var negate = struct.negate();\n\
var fn = negate(function(){ return true; });\n\
console.log(fn());"
				}
			]
		},

		//#struct.link
		"struct:link" : {
			title:"link",
			introduce:"<code>struct.link</code> create a continuous execution stack", 
			usages:[
				"link -> struct.link()",
				"link(...args)",
			],
			params:[
				{ name:"...args", type:"Function" },
			],
			info:"<p>Function of execution order is determined based on the order through time, that you can only use <code>single param</code></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var _ = struct.link();\n\
var fn = function(a){ return a+a; };\n\
var fn1 = function(c){ return c*c };\n\
var fn2 = function(d){ return d/2; };\n\
\n\
// create stack chain\n\
var link = _(fn,fn1,fn2);\n\
\n\
// 2+2  = 4\n\
// 4*4  = 16\n\
// 16/2 = 8\n\
console.log(link(2));"
				}
			]
		},

		//#struct.size
		"struct:size" : {
			title:"size",
			introduce:"<code>struct.size</code> check variable length(size)", 
			usages:[
				"size -> struct.size()",
				"size(obj)",
			],
			params:[
				{ name:"obj", type:"AnyType" },
			],
				info:"<p>if primitive not has <code>length</code> property. as it become <code>null</code><code>undefined</code> size to be 0</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var size = struct.size();\n\
console.log(size([1,2,3]))\n\
console.log(size('abcd'))\n\
console.log(size({a:1,b:3,c:2}))\n\
console.log(size(null))\n\
console.log(size(NaN))"
				}
			]
		},

		//#struct.now
		"struct:now" : {
			title:"now",
			introduce:"<code>struct.now</code> now Date Unix timestamp", 
			usages:[
				"now -> struct.now()",
				"now()",
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var now = struct.now();\n\
console.log(now())"
				}
			]
		},

		//#struct.now
		"struct:sort" : {
			title:"sort",
			introduce:"<code>struct.sort</code> array sort method( will rewirte at <code>VERSION 1.1</code>)", 
			usages:[
				"sort -> struct.sort()",
				"sort(arr)",
				"sort(arr,compare)",
			],
			info:"<p>it use default <code>Array.sort</code></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var sort = struct.sort();\n\
var a = [10,9,8,2,1];\n\
console.log(sort(a))"
				},
				{ 
					title: "Use compare",
					code:"var sort = struct.sort();\n\
var a = [1,9,4,8,3,2,6];\n\
console.log(sort(a,function(a,b){ return b-a; }))"
				}
			]
		},

		// Mixed Chaos API
		//#struct.each
		"struct:each" : {
			title:"each [ array,object ]",
			introduce:"<code>struct.each</code>, simple loop function",
			usages:[
				"Each -> struct.each()",
				"ArrayEach -> struct.each(\"array\")",
				"ObjectEach -> struct.each(\"object\")",
				"",
				"Each( list,fn(val,key|index,list),context )",
				"ArrayEach( arr,fn(val,index,arr),context )",
				"ObjectEach( obj,fn(val,key,obj),context )",
			],

			params:[
				{ name:"list", type:"Array,Object" },
				{ name:"arr", type:"Array" },
				{ name:"obj", type:"Object" },
				{ name:"fn", type:"Function" },
				{ name:"context", type:"AnyType" },
			],
			info:"<p> if u already now typeof <code>list</code>, that u should use <code>each(array|object)</code> current target,</p><p><code>each</code> api is best than <code>Array.forEach</code> or <code>for in</code> loop</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var each = struct.each();\n\
var arr = [1,2,3,4];\n\
var obj = { Nike:1, Cloud:2, Sam:3, Buke:4 };\n\
var a=0,b=\"Pack\";\n\
\n\
// each action\n\
each(arr,function(num){ a+=num; });\n\
each(obj,function(val,name){ b+=\",\"+name; });\n\
console.log(a);\n\
console.log(b)"
				},
				{ 
					title: "For Array",
					code:"var each = struct.each(\"array\");\n\
var arr = [1,2,3,4],a=1;\n\
\n\
// each action\n\
each(arr,function(num){ a=a*num; });\n\
console.log(a)"
				},
				{ 
					title: "Bind Context",
					code:"var each = struct.each(\"object\");\n\
var obj = { Nike:98, Cloud:18, Sam:21 },\n\
		a=[];\n\
\n\
// each action bind context(a)\n\
each(obj, function(score){\n\
	this.push(score);\n\
}, a);\n\
console.log(a)"
				},
			]
		},

		//#struct.map
		"struct:map" : {
			title:"map [ key,hook ]",
			introduce:"<code>struct.map</code>, mapping method for Array and isObject",
			usages:[
				"Map -> struct.map()",
				"Hook -> struct.map(\"hook\")",
				"MapKey -> struct.map(\"key\")",
				"",
				"Map( list,fn(val,index,list) )",
				"Hook( list,fn(val,index,arr) )",
				"MapKey( obj,fn(val,key,obj) )",
			],

			params:[
				{ name:"list", type:"Array,Object" },
				{ name:"obj", type:"Object" },
				{ name:"fn", type:"Function" },
			],
			info:"<p>instanceof <code>Array.map</code></p><p><code>hook</code> is compress advance mapping method</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var map = struct.map();\n\
var a = [0,1,2,3,4];\n\
var b = map(a,function(n){ return n+1; });\n\
console.log(a,b)"
				},
				{ 
					title: "Hook",
					code:"var hook = struct.map(\"hook\");\n\
var a = [0,1,2,3,4];\n\
var b = hook(a,\"valueOf\");\n\
var c = hook(a,function(n){ return n*n; });\n\
console.log(a);\n\
console.log(b,c);"
				},
				{ 
					title: "Mapping Key",
					code:"var mapkey = struct.map(\"key\");\n\
var a = { a:1, b:2, c:3 };\n\
var b = mapkey(a,function(val,key){\n\
	return key+val;\n\
});\n\
console.log(b);"
				}
			]
		},

		//#struct.has
		"struct:has" : {
			title:"has [ key ]",
			introduce:"<code>struct.has</code> check param in Array or Object",
			usages:[
				"Has -> struct.has()",
				"HasKey -> struct.has(\"key\")",
				"",
				"Has( list,value,useEqual )",
				"HasKey( list,value,useEqual )",
			],

			params:[
				{ name:"list", type:"Array,Object" },
				{ name:"value", type:"AnyType" },
				{ name:"useEqual", type:"Boolean" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var has = struct.has();\n\
var a = [0,1,2,3,4];\n\
console.log(has(a,2))\n\
console.log(has(a,5))"
				},
				{ 
					title: "Use eq",
					code:"var has = struct.has();\n\
var a = [{a:1},{b:2},{c:{a:{b:1}}}];\n\
console.log(has(a,{c:{a:{b:1}}},true))\n\
console.log(has(a,{a:1},true))\n\
console.log(has(a,{a:1}))"
				},
				{ 
					title: "Has Key",
					code:"var has = struct.has(\"key\");\n\
var a = {a:1,b:2,c:3};\n\
console.log(has(a,\"a\"))"
				},
			]
		},

		//#struct.type
		"struct:type" : {
			title:"type [ ... ]",
			introduce:"<code>struct.type</code> ",
			usages:[
				"type -> struct.type()",
				"",
				"isObject -> struct.type(\"object\")",
				"isArray -> struct.type(\"array\")",
				"isArrayLike -> struct.type(\"arraylike\")",
				"isFunction -> struct.type(\"function\")",
				"isNaN -> struct.type(\"nan\")",
				"isPrimitive -> struct.type(\"prim\")",
				"isIdentifier -> struct.type(\"idt\")",
				"isDefine -> struct.type(\"define\")",
				"isInt -> struct.type(\"int\")",
				"isFloat -> struct.type(\"float\")",
				"isDate -> struct.type(\"date\")",
				"isEmpty -> struct.type(\"empty\")",
				"isElement -> struct.type(\"elm\")",
				"isNative -> struct.type(\"native\")",
				"",
				"isDefine(val,defineName)"
			],
			params:[
				{ name:"val", type:"AnyType" },
				{ name:"defineName", type:"String" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var type = struct.type();\n\
console.log(type({a:1}))\n\
console.log(type([1,2,3]))\n\
console.log(type(1))\n\
console.log(type(\"a\"))\n\
console.log(type(null))\n\
console.log(type(NaN))\n\
console.log(type(void 0))\n\
console.log(type(struct.noop()))\n\
console.log(type(Date))"
				},
				{ 
					title: "Check Native",
					code:"var type = struct.type(\"native\");\n\
console.log(type(alert))\n\
console.log(type(console))\n\
console.log(type(struct.noop()))"
				},
				{ 
					title: "Detect arguments",
					code:"var isAryL = struct.type(\"arraylike\");\n\
var isAry = struct.type(\"array\");\n\
var fn = function(){ \n\
	console.log(\n\
		isAry(arguments),\n\
		isAryL(arguments)\n\
	); \n\
};\n\
fn(1,2,3,4);"
				}
			]
		},

		//#struct.html
		"struct:html" : {
			title:"html [ encode,decode,strip ]",
			introduce:"<code>struct.html</code> encode decode pack with html string",
			usages:[
				"encode -> struct.html(\"encode\")",
				"decode -> struct.html(\"decode\")",
				"strip -> struct.html(\"strip\")",
				"",
				"html(htmlStr)"
			],

			params:[
				{ name:"htmlStr", type:"String" },
			],

			examples:[
				{ 
					title: "Basic usage",
					code:"var encode = struct.html(\"encode\");\n\
console.log(encode(\"&lt;div&gt;&lt;/div&gt;\"))"
				}
			]
		},

		//#struct.unique
		"struct:unique" : {
			title:"unique [ fast ]",
			introduce:"<code>struct.unique</code> fast unique in Array",
			usages:[
				"slimUnique -> struct.unique()",
				"fastUnique -> struct.unique(\"fast\")",
				"",
				"slimUnique(arr)",
				"fastUnique(arr)"
			],
			params:[
				{ name:"arr", type:"Array" },
			],
			info:"<p>care about <code>(fast)unqiue</code>, it also use for pure same typeof <code>string,number</code> array, if the array exist <code>function,array,object</code>, it will get error</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var unique = struct.unique(\"fast\");\n\
console.log(unique([1,3,2,1,4,5,6,2,3,5,4,1,1,4,2,5,6,8,7,3,1,2,8]))"
				}
			]
		},

		//#struct.convert
		"struct:convert" : {
			title:"convert [ ... ]",
			introduce:"<code>struct.convert</code> safe type convert",
			usages:[
				"toString -> struct.convert()",
				"toString -> struct.convert(\"str\")",
				"toNumber -> struct.convert(\"num\")",
				"toArray  -> struct.convert(\"arr\")",
				"toHEX    -> struct.convert(\"hex\")",
				"toRGB    -> struct.convert(\"rgb\")",
				"toMinus  -> struct.convert(\"minus\")",
			],
			info:"<p>the method to safe convert. see more info form tables:</p>\n\
<table>\n\
	<thead>\n\
		<tr>\n\
			<th>Convert method</th>\n\
			<th>Usage info</th>\n\
		</tr>\n\
	</thead>\n\
	<tbody>\n\
		<tr>\n\
			<td>toString</td>\n\
			<td>Safe to String, use if it exist first, or return empty string</td>\n\
		</tr>\n\
		<tr>\n\
			<td>toNumber</td>\n\
			<td>Safe to Number, if it can convert to number, or return 0</td>\n\
		</tr>\n\
		<tr>\n\
			<td>toArray</td>\n\
			<td>Safe to Array, return a array eternal</td>\n\
		</tr>\n\
		<tr>\n\
			<td>toHEX</td>\n\
			<td>Convert RGB object <code>{r:255,g:255,b:255}</code> to HEX string #<code>ffffff</code></td>\n\
		</tr>\n\
		<tr>\n\
			<td>toRGB</td>\n\
			<td>Convert HEX string <code>#ffffff</code> to RGB object <code>{r:255,g:255,b:255}</code></td>\n\
		</tr>\n\
		<tr>\n\
			<td>toMinus</td>\n\
			<td>Convert number minus <code>1</code> to <code>-1</code></td>\n\
		</tr>\n\
	</tbody>\n\
</table>\n\
",
			examples:[
				{ 
					title: "Basic usage",
					code:"var toString = struct.convert();\n\
console.log(toString([1,3,2]))\n\
console.log(toString({ a:1, b:2 }))\n\
console.log(toString(struct.noop()))\n\
console.log(toString(null))\n\
console.log(toString(void 0))\n\
console.log(toString(213))"
				},
				{ 
					title: "toNumber",
					code:"var toNumber = struct.convert(\"number\");\n\
console.log(toNumber(null));\n\
console.log(toNumber(\"abc\"));\n\
console.log(toNumber(\"213\"));"
				},
				{ 
					title: "toArray",
					code:"var toArray = struct.convert(\"array\");\n\
console.log(toArray({a:1,b:2,c:3}));\n\
console.log(toArray(\"1234\"));\n\
console.log(toArray(1));\n\
console.log(toArray(null));"
				}
			]
		},

		//#struct.pull
		"struct:pull" : {
			title:"pull [ at,with,all ]",
			introduce:"<code>struct.pull</code> fast pull elm in Array",
			usages:[
				"pullAll -> struct.pull()",
				"pullAt -> struct.pull(\"at\")",
				"pullWith -> struct.pull(\"with\")",
				"",
				"pullAll(arr,...args)",
				"pullAt(arr,...indexs)",
				"pullWith(arr,val)"
			],
			params:[
				{ name:"arr", type:"Array" },
				{ name:"val", type:"AnyType" },
				{ name:"...args", type:"AnyType" },
				{ name:"...indexs", type:"Number" },
			],
			info:"<p>pull position or value form Array, change origin ary</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var pullAll = struct.pull(\"all\");\n\
console.log(pullAll([1,2,3,4],1,2))"
				},
				{ 
					title: "At index",
					code:"var pullAt = struct.pull(\"at\");\n\
console.log(pullAt([1,2,3,4],1,2))"
				},
				{ 
					title: "With single",
					code:"var pull = struct.pull();\n\
console.log(pull([1,2,3,4],4))"
				}
			]
		},

		//#struct.drop
		"struct:drop" : {
			title:"drop [ ... ]",
			introduce:"<code>struct.drop</code> fast drop part size in Array",
			usages:[
				"dropLeft -> struct.drop(\"left\")",
				"dropRight -> struct.drop(\"right\")",
				"dropLeftTo -> struct.drop(\"leftto\")",
				"dropRightTo -> struct.drop(\"rightto\")",
				"",
				"dropLeft(arr,pos)",
				"dropLeftTo(arr,until)",
			],
			params:[
				{ name:"arr", type:"Array" },
				{ name:"pos", type:"Number" },
				{ name:"until", type:"AnyType" },
			],
			info:"<p><code>dropTo</code> means drop until assert defined value</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var dropLeft = struct.drop(\"left\");\n\
console.log(dropLeft([1,2,3,4],2))"
				},
				{ 
					title: "Drop form Right",
					code:"var dropRight = struct.drop(\"right\");\n\
console.log(dropRight([1,2,3,4],2))"
				},
				{ 
					title: "Drop until catch",
					code:"var drop = struct.drop(\"leftto\");\n\
console.log(drop([1,2,\"2\",3,4,5],\"2\"))"
				},
			]
		},

		//#struct.param
		"struct:param" : {
			title:"param [ ... ]",
			introduce:"<code>struct.param</code> given binding method for params queryString",
			usages:[
				"pmParse -> struct.param()",
				"pmParse -> struct.param(\"parse\")",
				"pmRequery -> struct.param(\"query\")",
				"pmStringify -> struct.param(\"serialize\")",
				"",
				"pmParse(paramString)",
				"pmStringify(paramObject)",
				"pmRequery([jQuery|Zepto]serializeArray)"
			],
			params:[
				{ name:"paramString", type:"String" },
				{ name:"paramObject", type:"Object" },
				{ name:"serializeArray", type:"Array" },
			],
			info:"<p><code>param(query)</code> to parse <code>jQuery|Zepto</code> serializeArray API export</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var parse = struct.param();\n\
var url = \"https://chrome.google.com/search/LocalStorage?hl=en-US&_category=extensions\";\n\
var param = \"sl=strick&wonder=true&catch=1&id=2001\";\n\
console.log(parse(url));\n\
console.log(parse(param));"
				},
				{ 
					title: "Param serialize",
					code:"var serialize = struct.param(\"serialize\");\n\
var param = {\n\
	id : 2014,\n\
	search : \"hl-cake\",\n\
	trick: false\n\
};\n\
console.log(serialize(param));"
				},
				{ 
					title: "Use Requery",
					code:"var query = struct.param(\"query\");\n\
// jQuery form.serializeArray cap formData\n\
var serializeArray = [\n\
	{ name:\"sj\"     , value:\"something\" }     ,\n\
	{ name:\"search\" , value:\"goods\" }         ,\n\
	{ name:\"score\"  , value:1088 }            ,\n\
	{ name:\"p\"      , value:\"dekAx_SADodPS\" } ,\n\
];\n\
console.log(query(serializeArray));"
				},
			]
		},

		//#struct.ajax
		"struct:ajax" : {
			title:"ajax [ ... ]",
			introduce:"<code>struct.ajax</code> basic ajax method with appliction",
			usages:[
				"ajax -> struct.ajax()",
				"aget -> struct.ajax(\"get\")",
				"apost -> struct.ajax(\"post\")",
				"jsonp -> struct.ajax(\"jsonp\")",
				"",
				"ajax(option)",
				"jsonp(option)",
				"aget (url,[param].success,error)",
				"apost(url,[param].success,error)",
			],
			params:[
				{ name:"option", type:"Object" },
				{ name:"url", type:"String" },
				{ name:"param", type:"String,Object,NOT" },
				{ name:"success", type:"Function" },
				{ name:"error", type:"Function" },
			],
				info:"<p><code>param</code> is not necessary argument</p><p>ajax ,ethod support <code>JSONP</code></p>",
			examples:[
				{ 
					title: "Basic usage",
					not:true,
					code:"var ajax = struct.ajax();\n\
ajax({\n\
	url         : /* string */,\n\
	type        : /* string */,\n\
	param       : /* string | object */,\n\
	success     : /* function */,\n\
	error       : /* function */,\n\
	timeout     : /* number */,\n\
	cache       : /* boolean */,\n\
	valid       : /* boolean */,\n\
	header      : /* object */,\n\
	charset     : /* string */,\n\
	contentType : /* boolean */\n\
});"
				},
				{ 
					title: "Use get",
					not:true,
					code:"var get = struct.ajax(\"get\");\n\
get(\"/ajax/data1\",function(res){\n\
	//success for response data\n\
	console.log(res);\n\
});"
				},
			]
		},

		//#struct.event
		"struct:event" : {
			title:"event [ on,unbind,emit ]",
			introduce:"<code>struct.event</code> given pure object event capable",
			usages:[
				"addEvent -> struct.event(\"on\")",
				"hasEvent -> struct.event(\"has\")",
				"copyEvent -> struct.event(\"copy\")",
				"emitEvent -> struct.event(\"emit\")",
				"unbindEvent -> struct.event(\"unbind\")",
				"",
				"addEvent(obj,type,fn)",
				"hasEvent(obj,type,fn)",
				"unbindEvent(obj,type,fn)",
				"emitEvent(obj,type,args)",
				"copyEvent(obj,related)",
			],
			params:[
				{ name:"obj", type:"Object,Array,Function" },
				{ name:"type", type:"String" },
				{ name:"fn", type:"Function" },
				{ name:"args", type:"Array,NOT" },
				{ name:"related", type:"Object,Array,Function" },
			],
			info:"<p></p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var on = struct.event(\"on\");\n\
var emit = struct.event(\"emit\");\n\
\n\
var o = {};\n\
on(o,\"myevent\",function(a,b){\n\
	console.log(a+b);\n\
});\n\
\n\
emit(o,\"myevent\",[1,2]);"
				},
				{ 
					title: "Has event",
					code:"var on = struct.event(\"on\");\n\
var has = struct.event(\"has\");\n\
\n\
var o = {};\n\
on(o,\"myevent\",struct.noop());\n\
on(o,\"mysun\",struct.noop());\n\
\n\
console.log(has(o,\"mysun\"));\n\
console.log(has(o,\"myevent\",struct.noop()));\n\
console.log(has(o,\"myevent\",function(){}));"
				},
			]
		},

		//#struct.prop
		"struct:prop" : {
			title:"prop [ get,set,not ]",
			introduce:"<code>struct.prop</code> given pure object prop capable",
			usages:[
				"getProp -> struct.prop(\"get\")",
				"setProp -> struct.prop(\"set\")",
				"removeProp -> struct.prop(\"not\")",
				"",
				"getProp(obj,name,dowith,...args)",
				"setProp(obj,name,value)",
				"removeProp(obj,name)",
			],
			params:[
				{ name:"obj", type:"Object,Array,Function" },
				{ name:"name", type:"String,Number" },
				{ name:"value", type:"AnyType" },
				{ name:"dowith", type:"String,Function" },
			],
			info:"<p>advance method ADRC property</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var get = struct.prop(\"get\");\n\
\n\
var o = { a:{ b:{ c:2 } } };\n\
console.log(get(o,\"a.b.c\"));"
				},
				{ 
					title: "Set property",
					code:"var set = struct.prop(\"set\");\n\
\n\
var o = {};\n\
console.log(set(o,\"a\",213));"
				},
			]
		},

		//#struct.pairs
		"struct:pairs" : {
			title:"pairs [ un ]",
			introduce:"<code>struct.pairs</code> pairs unpairs data",
			usages:[
				"pairs -> struct.pairs()",
				"unpairs -> struct.pairs(\"un\")",
				"",
				"pairs(obj)",
				"unpairs(arr)",
			],
			params:[
				{ name:"obj", type:"Object" },
				{ name:"ary", type:"Array" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var pairs = struct.pairs();\n\
\n\
console.log(pairs({a:1,b:2}));"
				},
				{ 
					title: "Unpairs",
					code:"var unpairs = struct.pairs(\"un\");\n\
\n\
console.log(unpairs([['a',1],['b',2]]));"
				},
			]
		},

		//#struct.index
		"struct:index" : {
			title:"index [ ... ]",
			introduce:"<code>struct.index</code> fast find value index in Array | Object",
			usages:[
				"firstIndex -> struct.index(\"first\")",
				"lastIndex -> struct.index(\"last\")",
				"single -> struct.index(\"one\")",
				"index -> struct.index()",
				"",
				"index(arr,idf)"
			],
			params:[
				{ name:"arr", type:"Array" },
				{ name:"idf", type:"AnyType" },
			],
			info:"<p><code>idf</code> support regexp</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var index = struct.index();\n\
\n\
// find number 1 indexs collection\n\
console.log(index([2,3,4,1,2,4,2,1,1],1));"
				},
				{ 
					title: "First Index",
					code:"var findex = struct.index(\"first\");\n\
\n\
console.log(findex([2,3,4,1,2,4,2,1,1],1));"
				},
				{ 
					title: "Last Index",
					code:"var lindex = struct.index(\"last\");\n\
\n\
console.log(lindex([2,3,4,1,2,4,2,1,1],1));"
				},
				{ 
					title: "Get first SingleValue",
					code:"var one = struct.index(\"one\");\n\
\n\
console.log(one([2,4,2,1,1],function(res){\n\
	return res>3;\n\
}));"
				},
			]
		},

		//#struct.random
		"struct:random" : {
			title:"random [ ... ]",
			introduce:"<code>struct.random</code> random someting custom",
			usages:[
				"rInt -> struct.random(\"int\")",
				"rFloat -> struct.random(\"float\")",
				"rString -> struct.random(\"string\")",
				"rBool -> struct.random(\"boolean\")",
				"rChar -> struct.random(\"char\")",
				"rDate -> struct.random(\"date\")",
				"rHex -> struct.random(\"hex\")",
				"rDice -> struct.random(\"dice\")",
				"rDefault -> struct.random() -> Math.random",
				"",
				"rInt(min,max)",
				"rFloat(min,max,fix)",
				"rBool(range)",
				"rChar(all,upper)",
				"rString(leng,all,upper)",
				"rHex(format)",
				"rDate()",
				"rDice(max)"
			],
			params:[
				{ name:"min", type:"Number" },
				{ name:"max", type:"Number" },
				{ name:"fix", type:"Number" },
				{ name:"range", type:"Number" },
				{ name:"all", type:"Boolean" },
				{ name:"upper", type:"Boolean" },
				{ name:"leng", type:"Number" },
				{ name:"format", type:"Boolean" },
			],
			info:" <p> <code>upper</code> setting the uppercase character</p><p>the range is gona be int <code>1-100</code> number like persistent</p>",
			examples:[
				{ 
					title: "Basic usage",
					code:"var random = struct.random(\"int\");\n\
console.log(random(1,8));"
				},
				{ 
					title: "Float",
					code:"var random = struct.random(\"float\");\n\
console.log(random(1,3.2,6/*fixed*/));"
				},
				{ 
					title: "Range boolean",
					code:"var random = struct.random(\"bool\");\n\
console.log(random(40));"
				},
				{ 
					title: "String",
					code:"var random = struct.random(\"string\");\n\
console.log(random(8,false,true));"
				},
			]
		},

		//#struct.string
		"struct:string" : {
			title:"string [ ... ]",
			introduce:"<code>struct.string</code> method to deal with format",
			usages:[
				" toString -> struct.string()",
				" trim -> struct.string(\"trim\")",
				" trimLeft -> struct.string(\"trimLeft\")",
				" trimRight -> struct.string(\"trimRight\")",
				" camelize -> struct.string(\"came\")",
				" capitalize -> struct.string(\"capit\")",
				" rize -> struct.string(\"rize\")",
				"",
				"trim(str)",
			],
			params:[
				{ name:"str", type:"String" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var trim = struct.string(\"trim\");\n\
console.log(trim(\"  Buke Gun \"));"
				},
				{
					title: "Camelize",
					code:"var came = struct.string(\"came\");\n\
console.log(came(\"background-color\"));\n\
console.log(came(\"name_gen\"));\n\
console.log(came(\"font-size\"));"
				},
				{
					title: "Rize",
					code:"var rize = struct.string(\"rize\");\n\
console.log(rize(\"fontSize\"));\n\
console.log(rize(\"borderTop\"));"
				}
			]
		},

		//#struct.assembly
		"struct:assembly" : {
			title:"assembly [ ... ]",
			introduce:"<code>struct.assembly</code> provide some computer at the bottom of the method",
			usages:[
				" atob -> struct.assembly(\"atob\")",
				" btoa -> struct.assembly(\"btoa\")",
				" utob -> struct.assembly(\"utob\")",
				" btou -> struct.assembly(\"btou\")",
				"",
				"atob(str)",
			],
			info:"\n\
<table>\n\
	<thead>\n\
		<tr>\n\
			<th>Assembly</th>\n\
			<th>Info</th>\n\
		</tr>\n\
	</thead>\n\
	<tbody>\n\
		<tr>\n\
			<td>btoa</td>\n\
			<td>convert str to Base64 encoding</td>\n\
		</tr>\n\
		<tr>\n\
			<td>atob</td>\n\
			<td>decode convert Base64 to str</td>\n\
		</tr>\n\
		<tr>\n\
			<td>utob</td>\n\
			<td>convert utf8(all lang) Base64 to str</td>\n\
		</tr>\n\
		<tr>\n\
			<td>btou</td>\n\
			<td>decode convert Base64 to utf8-str</td>\n\
		</tr>\n\
	</tbody>\n\
</table>\n\
",
			params:[
				{ name:"str", type:"String" },
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var atob = struct.assembly(\"atob\");\n\
console.log(atob(\"Buke\"));"
				},
			]
		},

		//#struct.doom
		"struct:doom" : {
			title:"doom [ template ]",
			introduce:"<code>DOOM</code> slim fast JavaScript template, with <b>precomplete, chache, performance</b>",
			usages:[
				" doom -> struct.doom(setting)",
				" doom(str)",
			],
			params:[
				{ name:"str", type:"String" },
				{ name:"setting", type:"Object" },
				{ name:"setting:interpolate", type:"String" },
				{ name:"setting:escape", type:"String" },
				{ name:"setting:command", type:"String" },
				{ name:"setting:evaluate", type:"String" },
			],
			related:[
				{ name:"view.mount", target:"view:mount" },
				{ name:"view.render", target:"view:render" }
			],
			info:"<p>DOOM is <b>[ fast, precomplete, cache, dynamic parameter ]</b> template engine </p>\n\
<p>DOOM can be regarded as a compiler, build string template like <code>mustache</code>, there use some grammar as :</p>\n\
<table>\n\
	<thead>\n\
		<tr>\n\
			<th>Grammar</th>\n\
			<th>Format</th>\n\
			<th>RegExp</th>\n\
			<th>Info</th>\n\
		</tr>\n\
	</thead>\n\
	<tbody>\n\
		<tr>\n\
			<td>interpolate</td>\n\
			<td>&#123;&#123;# &#125;&#125;</td>\n\
			<td>&#123;&#123;#([\\s\\S]+?)&#125;&#125;</td>\n\
			<td>directly output variable</td>\n\
		</tr>\n\
		<tr>\n\
			<td>escape</td>\n\
			<td>&#123;&#123;- &#125;&#125;</td>\n\
			<td>&#123;&#123;-([\\s\\S]+?)&#125;&#125;</td>\n\
			<td>output variable with <b>escape</b> (prevent being  XSS attacked)</td>\n\
		</tr>\n\
		<tr>\n\
			<td>command</td>\n\
			<td>&#123;&#123;* &#125;&#125;</td>\n\
			<td>&#123;&#123;*([\\s\\S]+?)&#125;&#125;</td>\n\
			<td>extra command parse with doom grammar</td>\n\
		</tr>\n\
		<tr>\n\
			<td>evaluate</td>\n\
			<td>&#123;&#123;&nbsp; &#125;&#125;</td>\n\
			<td>&#123;&#123;([\\s\\S]+?)&#125;&#125;</td>\n\
			<td>parse normal JavaScript code</td>\n\
		</tr>\n\
	</tbody>\n\
</table>\n\
<br>\n\
<br>\n\
<p>DOOM bind some command grammar, Usually they are used to reduce the code size</p>\n\
<table style=\"table-layout:auto\">\n\
	<thead>\n\
		<tr>\n\
			<th>Command</th>\n\
			<th>Usage</th>\n\
			<th>Info</th>\n\
		</tr>\n\
	</thead>\n\
	<tbody>\n\
		<tr>\n\
			<td>exist(if)</td>\n\
			<td style=\"white-space:nowrap; color:#778e9c\">&#123;&#123;*exist [var]&#125;&#125; ,<br>\n\
			&#123;&#123;*exist [var] then [arguments]&#125;&#125;\n\
			</td>\n\
			<td>check the variable if exist, <code>then</code> means use some variable. not as function, should use with <code>&#123;&#123;*end&#125;&#125;</code> together</td>\n\
		</tr>\n\
		<tr>\n\
			<td>each(for)</td>\n\
			<td style=\"white-space:nowrap; color:#778e9c\">&#123;&#123;*each [..args] in [list]&#125;&#125;</td>\n\
			<td>each method given a simple way to loop the (Array|Object), should use with <code>&#123;&#123;*end&#125;&#125;</code> together</td>\n\
		</tr>\n\
		<tr>\n\
			<td>not</td>\n\
			<td style=\"white-space:nowrap; color:#778e9c\">&#123;&#123;*not [value] with [list]&#125;&#125;</td>\n\
			<td>simple way to fast pull(not) value in [list], it would change list</td>\n\
		</tr>\n\
		<tr>\n\
			<td>extend</td>\n\
			<td style=\"white-space:nowrap; color:#778e9c\">&#123;&#123;*extend [target] with [list]&#125;&#125;</td>\n\
			<td>simple way extend target into [list]</td>\n\
		</tr>\n\
		<tr>\n\
			<td>map</td>\n\
			<td style=\"white-space:nowrap; color:#778e9c\">&#123;&#123;*map [list] use [param]&#125;&#125;</td>\n\
			<td>directly map list use (param) - struct.map</td>\n\
		</tr>\n\
		<tr>\n\
			<td>find</td>\n\
			<td style=\"white-space:nowrap; color:#778e9c\">&#123;&#123;*find [list] use [param]&#125;&#125;</td>\n\
			<td>directly filter list use (param) - struct.find</td>\n\
		</tr>\n\
		<tr>\n\
			<td>unique</td>\n\
			<td style=\"white-space:nowrap; color:#778e9c\">&#123;&#123;*unique [list]&#125;&#125;<br>\n\
			&#123;&#123;*unique:fast [list]&#125;&#125;</td>\n\
			<td>unique array - struct.unique</td>\n\
		</tr>\n\
		<tr>\n\
			<td>...</td>\n\
			<td></td>\n\
			<td></td>\n\
		</tr>\n\
	</tbody>\n\
</table>\n\
",
			examples:[
				{ 
					title: "Basic usage",
					code:"var doom = struct.doom();\n\
//Compiling templates\n\
var bt = doom(\"&lt;b&gt;Hello &#123;&#123;#name&#125;&#125;&lt;/b&gt;\");\n\
console.log(bt({ name: \"&lt;Buke&gt;\" }));"
				},
				{ 
					title: "Escape",
					code:"var doom = struct.doom();\n\
//Compiling templates\n\
var bt = doom(\"HTML-> &#123;&#123;-tag&#125;&#125;\");\n\
console.log(bt({\n\
	tag: \"&lt;script&gt;alert()&lt;/script&gt;\"\n\
}));"
				},
				{
					title: "Parse Javascript",
					code:"var doom = struct.doom();\n\
//Compiling templates\n\
var bt = doom(\n\
	\"&#123;&#123; if(score>60){ &#125;&#125;\"+\n\
	\"Awesame! you have pass this test.\"+\n\
	\"&#123;&#123; }else{ &#125;&#125;\"+\n\
	\"Fail! you may retry this test.\"+\n\
	\"&#123;&#123; } &#125;&#125;\"\n\
);\n\
console.log(bt({ score:42 }));\n\
console.log(bt({ score:98 }));"
				},
				{
					title: "Use build-in Command",
					preview: "tpl",
					code:"var doom = struct.doom();\n\
var data = { \n\
	members:[\n\
		{ name:\"Cloud\" , score:62 },\n\
		{ name:\"Buke\"  , score:98 },\n\
		{ name:\"Uncle\" , score:12 },\n\
		{ name:\"Shougo\", score:85 }\n\
	]\n\
};\n\
\n\
var bt = doom(\n\
	\"&lt;ul&gt;\"+\n\
	\"&#123;&#123;* each [people] in members &#125;&#125;\"+\n\
	\"	&lt;li&gt;\"+\n\
	\"		 &#123;&#123;-people.name&#125;&#125; - \"+\n\
	\"		 &#123;&#123;-people.score&#125;&#125; \"+\n\
	\"	&lt;/li&gt;\"+\n\
	\"&#123;&#123;* end &#125;&#125;\"+\n\
	\"&lt;/ul&gt;\"\n\
);\n\
// mount in dom\n\
document.getElementById(\"tpl\")\n\
				.innerHTML = bt(data);"
				},
				{
					title: "Use command [unique]",
					code:"var doom = struct.doom();\n\
var data = {\n\
	arr: [2,3,1,4,2,1,4,5,6,3,4,1,8,6,7]\n\
};\n\
\n\
var bt = doom(\n\
	\"{{*unique:fast arr}}\"+\n\
	\"{{console.log(arr)}}\"\n\
);\n\
bt(data);"
				}
			]
		},
	});
});
