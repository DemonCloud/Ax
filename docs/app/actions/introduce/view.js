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
									 "</div>",
					events:{
						"click:.name":function(){
							alert(this.innerHTML);
						}
					}
				});

				view.mount(
					document.getElementById("mount1"),
					{ name : "Buke" }
				);

				//#example2
				var view2 = new aix.view({
					template:"<input type='text' id='text'>"+
									 "<div>{{-text}}</div>",
					events:{
						"input:#text":function(){
							model2.set({ text:this.value });
						}
					}
				});

				var model2 = new aix.model({
					data : { text: "Hello World" }
				});

			}
		}
	});
});
