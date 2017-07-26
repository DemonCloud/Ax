define("actions/api/export",
[
"actions/api/model",
"actions/api/view",
],
function(model,view){
	var prevKey;

	// add change event for language change
	model.on("change",function(){
		view.render(model.get(prevKey||"model.get"));
	});

	return function(key){
		if((prevKey = key)){
			window.scrollTo(0,0);
			view.render(model.get(key));
		}
	};
});
