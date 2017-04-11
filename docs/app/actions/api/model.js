define("actions/api/model",
[
	"aix",
	"data/apidata"
],
function(aix,apidata){
	return new aix.model({
		data:apidata
	});
});
