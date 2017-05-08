define("actions/introduce/view",
[
	"ax",
	"modules/tags",
	"modules/title",
	// template 
	"text!actions/introduce/tpl"
],
function(ax,tags,title,tpl){
	// mount at elment[#app]
	return new ax.view({
		root:document.getElementById("app"),
		template:tpl,
		events:{
			beforeRender:function(data){
				title("Ax - fast MVR JavaScript Framework");
			},
			completed:function(data){
				sh_highlightDocument(tags.make());

				//#example1
				var view = new ax.view({
					template:"<div class='name'>"+
											"Hello {{-name}}"+
									 "</div>"
				});

				view.mount(
					document.getElementById("mount1"),
					{ name : "Buke" }
				);

				//#example2
				var view2 = new ax.view({
					template:"<input value='{{-text}}' style='margin-bottom:5px'>"+
									 "<h2>{{-text}}</h2>",
					events:{
						"change:input":function(event){
							model2.set("text",this.value);
						}
					}
				});

				var model2 = new ax.model({
					events:{
						change:function(){
							view2.render(this.get());
						}
					}
				});

				view2.mount(
					document.getElementById("mount2"),
					{ text: "Hello World" }
				);

				//example3
				var trim = struct.string("trim");

				var view3 = new ax.view({
					template:'<input id="name" maxlength=10>'+
									 '<button id="add">add</button>'+
									 '<ul>'+
									 '{{* each [item,i] in list }}'+
									 ' 	 <li style="max-width:168px">'+
									 '    {{-cap(item.name)}}'+
									 '    <b class="del" key={{-i}}>×</b>'+
									 ' 	 </li>'+
									 '{{* end }}'+
									 '</ul>',
					props:{
						cap: struct.string("capit")
					},
					events:{
						"click:#add":function(event){
							var getName = trim(
								document.getElementById("name").value
							);
							if(getName)
								model3.moc("list",{ name : getName });
						},
						"keypress:#name":function(event){
							if(event.keyCode === 13)
								event.data.self.emit("click:#add");
						},
						"click:.del":function(event){
							model3.rm("list."+this.getAttribute("key"));
						}
					}
				});

				var model3 = new ax.model({
					store: true,
					url:"todolist",
					data:{ list:[] },

					events:{
						"change:list":function(){
							view3.render(this.get());
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
