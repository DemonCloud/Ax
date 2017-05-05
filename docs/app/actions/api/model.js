define("actions/api/model",
[
	"ax",
	"data/apidata"
],
function(ax,apidata){
	return new ax.model({
		data:apidata
	});
});
