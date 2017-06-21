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
	// mount at elment[#app]
	return ax.view({
		root:document.getElementById("app"),
		template:tpl,
		events:{
			beforeRender:function(data){
				title("Ax - fast MVR JavaScript Framework");
			},
			completed:function(data){
				sh_highlightDocument(tags.make());

				//#example1
				var view = ax.view({
					template: "Hello {{-name}}"
				});

				view.mount(
					document.getElementById("mount1"),
					{ name : "Buke" }
				);

				//#example2
				var model2 = ax.model();

				var view2 = ax.view({
					template:"<input value='{{-text}}' style='margin-bottom:5px'>"+
									 "<h2>{{-text}}</h2>",

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
				var trim = struct.string("trim");

				var model3 = ax.model({
					url:"todolist",

					data:{ list:[] },
					store: true,
				});

				var view3 = ax.view({
					template:'<form id="form"><input id="name" maxlength=10>'+
									 '<button id="add">Add</button></form>'+
									 '<ul>'+
									 '{{* each [item,i] in list }}'+
									 ' 	 <li style="max-width:168px">'+
									 '    {{-item.name}}'+
									 '    <b class="del" key={{-i}}>×</b>'+
									 ' 	 </li>'+
									 '{{* end }}'+
									 '</ul>',

					model: model3,

					events:{
						"submit:#form":function(event){
							event.preventDefault();
							var getName = trim(document.getElementById("name").value);
							if(getName) model3.moc("list",{ name : getName });
						},
						"click:.del":function(event){
							model3.rm("list."+this.getAttribute("key"));
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
