define("actions/introduce/view",
[
	"aix",
	// template 
	"text!actions/introduce/tpl"
],
function(aix,tpl){
	// mount at elment[#app]
	return new aix.view({
		root:document.getElementById("app"),
		template:tpl,
		events:{
			beforeRender:function(data){
				console.log("#introduce randering");
			},
			complete:function(data){
				sh_highlightDocument();

				//#example1
				var view = new aix.view({
					template:"<div class='name'>"+
											"Hello {{-name}}"+
									 "</div>"
				});

				view.mount(
					document.getElementById("mount1"),
					{ name : "Buke" }
				);

				//#example2
				var view2 = new aix.view({
					template:"<input id='text' value='{{-text}}'>"+
									 "<h2>{{-text}}</h2>",
					events:{
						"input:#text":function(event){
							model2.set("text",this.value);
						}
					}
				});

				var model2 = new aix.model({
					events:{
						change:function(){
							view2.render(this.data);
						}
					}
				});

				view2.mount(
					document.getElementById("mount2"),
					{ text: "Hello World" }
				);

				//example3
				var trim = struct.string("trim");

				var view3 = new aix.view({
					template:'{{ var each = struct.op() }}'+
									 '<input id="name" maxlength=10>'+
									 '<button id="add">add</button>'+
									 '<ul>'+
									 '{{ each(list,function(item,index){ }}'+
									 ' 	 <li>'+
									 '    {{-item.name}}'+
									 '    <span class="del" idx={{-index}}>×</span>'+
									 ' 	 </li>'+
									 '{{ }) }}'+
									 '</ul>',
					events:{
						"click:#add":function(){
							var getName = trim(document.getElementById("name").value);
							if(getName)
								model3.moc("list",{ name : getName });
						},
						"keypress:#name":function(event){
							if(event.keyCode === 13)
								event.data.self.emit("click:#add");
						},
						"click:.del":function(event){
							model3.remove("list."+this.getAttribute("idx"));
						}
					}
				});

				var model3 = new aix.model({
					data:{
						list:[]
					},
					events:{
						change:function(){
							view3.render(this.data);
						}
					}
				});

				view3.mount(
					document.getElementById("mount3"),
					model3.parse()
				);
			}
		}
	});
});
