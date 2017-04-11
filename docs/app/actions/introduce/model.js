define("actions/introduce/model",
[
"aix",
"data/introduceinfo"
],
function(aix,introduceinfo){
	return new aix.model({
		data:introduceinfo
	});
});
