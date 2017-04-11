
# Aix - [ version 1.0 ]

Aix is a fast MVR JavaScript Framework. 

It require `Struct` utils lib, for the sake of better organization application structure with modular architecture( **AMD or CommonJS specification** ). This is not to replace `Backbone` or `Angular` etc, maybe it boring form of entertainment. Of course, it can cooperate with `React` very well.

> require [ Struct ] : [ Struct - the C Lang JavaScript Utils Lib ](https://github.com/DemonCloud/struct)

# Modules

- **Model**: Allows you to easily manage the data , model parse is the Immutable data, who can be monitored. So that data would not be modified by accident. Flexible authentication mechanism, to ensure the availability of data.


- **View**: The simple view is one of the essential of the app, it provides a flexible way to build the user interface, or use it as container for other view's lib (framework). it was given the complete events emitter and virtual DOM rendering mechanism by default way.


- **Route**: A routing manager for application, support regular expressions to match the router with multiple actions. Detection of hash change and carry any parameters at the same time.

> Document : [See how to use Aix in your project](https://github.com/DemonCloud/aix) (**comming soon**)

> Test : [Check Aix test in different browser](https://github.com/DemonCloud/aix) (**comming soon**)

# Examples
### ` - Model `

```javascript
var model = new aix.model({
	data:{
		name:"Cloud",
		info:{
			id:10024,
			score:88
		}
	},
	validate:{
		"name":function(name){
			return name.length>4;
		},
		"info.score":function(score){
			return score === +score;
		}
	}
});

model.data.name = "Trump"          // fail! it's immutable data
model.get("name");                 // "Cloud"
model.set("info.score","61");      // fail! score must be pure number
model.toJSON()                     // "{"name":"Cloud","info":{"id":10024,"score":88}}"
```

This example show how to set `validate` for model and an easy way to manager data.

Immutable data is extreme for the protection of itself,  the only way is that use `set` method to change data.

### ` - View `

```javascript
var view = new aix.view({
	template:"<div id='{{-id}}'>" +
				"Hello {{-name}}" +
			 "</div>",
	events:{
		"click:div":function(){
			alert(this.innerHTML);
		}
	}
});

// mount only once time on element[id=#app]
view.mount(
	document.getElementById("app"),
	{ id: "target" ,name: "Buke" }
);
```
This example will render **"Hello Buke"** into a container on the page.

mount application rendering at the element[#app], if set `root` property by default, `render` method can be using anytime directly (it means not create `mount` method).

# License

Open source don't need any permission, 

Fuck Any License(FAL) is the best license!


