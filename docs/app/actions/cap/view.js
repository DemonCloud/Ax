define("actions/cap/view",
[
	"aix",

	// template 
	"text!actions/cap/tpl"
],
function(aix,tpl){
	// mount at elment[#app]
	return new aix.view({
		root:document.getElementById("app"),
		template:tpl
	});
});
