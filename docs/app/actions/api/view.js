define("actions/api/view",
[
	"aix",

	// template 
	"text!actions/api/tpl"
],
function(aix,tpl){
	// mount at elment[#app]
	return new aix.view({
		root:document.getElementById("app"),
		template:tpl,
		events:{
			beforeRender:function(data){
				console.log("#api randering")
			}
		}
	});
});
