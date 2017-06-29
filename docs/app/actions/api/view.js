define("actions/api/view",
[
	"ax",
	"struct",
	"modules/tags",
	"modules/code",
	"modules/title",

	// template 
	"text!actions/api/tpl"
],
function(ax,struct,tags,code,title,tpl){
	// var sh_highlightDocument = sh_highlightDocument || struct.noop();
	
	var dom = struct.doom()(tpl);

	// mount at elment[#app]
	return ax.view({
		root:document.getElementById("app"),

		render: function(){
			this.root.innerHTML = dom.apply(this,arguments);
		},

		events:{
			beforeRender:function(data){
				title("Ax - API "+data.title);
			},
			completed:function(data){
				sh_highlightDocument(tags.make(code.make()));
				// tags.make(code.make());
			}
		}
	});
});
