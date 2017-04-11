define("actions/cap/model",
[
	"aix",
	"data/capdata"
],
function(aix,capdata){
	return new aix.model({
		data:capdata
	});
});
