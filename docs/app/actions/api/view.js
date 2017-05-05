define("actions/api/view",
[
	"ax",
	"modules/tags",
	"modules/code",
	"modules/title",

	// template 
	"text!actions/api/tpl"
],
function(ax,tags,code,title,tpl){
	// mount at elment[#app]
	return new ax.view({
		root:document.getElementById("app"),
		template:tpl,
		events:{
			beforeRender:function(data){
				title("Ax - API "+data.title);
			},
			completed:function(data){
				sh_highlightDocument(tags.make(code.make()));
			}
		}
	});
});
