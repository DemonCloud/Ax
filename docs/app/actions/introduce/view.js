define("actions/introduce/view",
[
	"ax",
	"struct",

	"modules/tags",
	"modules/title",
	// template 
	"text!actions/introduce/tpl"
],
function(ax,struct,tags,title,tpl){
	var dom = struct.doom()(tpl);
	// mount at elment[#app]
	return ax.view({
		root:document.getElementById("app"),

		render: function(){
			this.root.innerHTML = dom.apply(this,arguments);
		},

		events:{
			beforeRender:function(data){
				title("Ax - fast MVR JavaScript Framework");
			},
			completed:function(data){
				sh_highlightDocument(tags.make());
				// tags.make();

				//#example1
				var view = ax.view({
					template: "<span>Hello {{-name}}</span>"
				});

				view.mount(
					document.getElementById("mount1"),
					{ name : "Buke" }
				);

				//#example2
				var model2 = ax.model();

				var view2 = ax.view({
					template:"<div><input style='margin-bottom:5px' value='{{-text}}' />"+
					"<h2>{{-text}}</h2></div>",

					model : model2,

					events:{
						"change:input":function(event){
							model2.set("text",this.value);
						}
					}
				});

				view2.mount(
					document.getElementById("mount2"),
					{ text: "Hello World" }
				);

				//example3
				var model3 = ax.model({
					name:"todolist",
					data:{ list:[] },
					store: true,
				});

				var view3 = ax.view({
					template:'<form id="form"><input id="name" maxlength=10 />'+
					'<button id="add">Add</button>'+
					'<ul>'+
					'{{* each [item,i] in list }}'+
					' 	 <li style="max-width:168px">'+
					'    <span>{{-item.name}}</span>'+
					'    <b class="del" key={{-i}}>×</b>'+
					' 	 </li>'+
					'{{* end }}'+
					'</ul>></form>',

					model: model3,

					events:{
						"submit:#form":function(event){
							event.preventDefault();
							var name = document.getElementById("name");
							var getName = name.value.trim();
							if(getName){
								name.value="";
								model3.moc("list",{ name : getName });
							}
						},

						"click:.del":function(event){
							model3.rm("list."+this.key);
						}
					}
				});

				view3.mount(
					document.getElementById("mount3"),
					model3.get()
				);
			}
		}
	});
});
