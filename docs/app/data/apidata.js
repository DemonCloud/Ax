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
console.log(m.get(\"a.d\",size));\n\
console.log(m.get(\"a.d\",JSON.stringify));"
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
					code:"var m = new aix.model();\n\
// bind change event\n\
m.on(\"change\",function(){\n\
	console.log(\"data has been changed!\",this);\n\
});\n\
m.set(\"a\",1);"
				},
				{ 
					title: "Multiple events",
					code:"var m = new aix.model({\n\
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
					code:"var m = new aix.model({\n\
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
					code:"var m = new aix.model({\n\
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
				"new aix.model.extend(defaultOption)",
			],
			params:[
				{ name:"defaultOption", type:"Object" }
			],
			examples:[
				{ 
					title: "Basic usage",
					code:"var m = new aix.model.extend({\n\
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
					code:"var m = new aix.model.extend({\n\
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
			console.log(\"can't set [\"+key+\"] as (\"+ val +\")\");\n\
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
					code:"var v = new aix.view({\n\
	template:\"&lt;span&gt;Hello {{-text}}&lt;/span&gt;\",\n\
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
				{ name:"view.mount", target:"view:mount" }
			],
			examples:[
				{ 
					title: "Basic init",
					preview:"base2",
					code:"var v = new aix.view({\n\
	root:document.getElementById(\"base2\"),\n\
	template:\"Hi! {{-text}}\",\n\
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
var v = new aix.view({\n\
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
					code:"var v = new aix.view({\n\
	template:\"Hi! {{#capit(random(length))}}\",\n\
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
					code:"var v = new aix.view({\n\
	root:document.getElementById(\"v1\"),\n\
	template:\"{{-number}}\",\n\
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
					code:"var v = new aix.view({\n\
	root:document.getElementById(\"base\"),\n\
	template:\"{{-number}}\"\n\
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
					code:"var v = new aix.view({\n\
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
				"new aix.view.extend(defaultOption)",
			],
			params:[
				{ name:"defaultOption", type:"Object" }
			],
			examples:[
				{ 
					title: "Basic usage",
					preview:"v",
					code:"var v = new aix.view.extend({\n\
	root: document.getElementById(\"v\"),\n\
	template: \"&lt;span&gt;{{-code}}&lt;/span&gt;\",\n\
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
					code:"var route = new aix.route({\n\
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
					code:"var route = new aix.route({\n\
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
var route = new aix.route( /*...*/ )\n\
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
					code:"var v = new aix.route({\n\
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
				"new aix.route.extend(defaultOption)",
			],
			params:[
				{ name:"defaultOption", type:"Object" }
			],
			examples:[
				{ 
					title: "Basic usage",
					not: true,
					code:"var route = new aix.route.extend({\n\
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
			info:"<p>extend method can also use for Array</p><p>method compress to <code>aix.model</code>, use it as <code>model.extend(target)</code> (compress model data)</p>",
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
				{ name:"args", type:"Array" },
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
	});
});
