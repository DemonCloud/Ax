define("actions/api/view",
[
	"aix",
	"modules/tags",
	"modules/code",

	// template 
	"text!actions/api/tpl"
],
function(aix,tags,code,tpl){
	// mount at elment[#app]
	return new aix.view({
		root:document.getElementById("app"),
		template:tpl,
		events:{
			beforeRender:function(data){
				console.log("#api randering");
			},
			completed:function(data){
				sh_highlightDocument(tags.make(code.make()));
			}
		}
	});
});
