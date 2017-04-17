define("actions/cap/export",
[
"actions/cap/model",
"actions/cap/view",
],
function(model,view){
	var prevKey;

	// add change event for language change
	model.on("change",function(){
		view.render(model.get(prevKey||"model"));
	});

	return function(key){
		if((prevKey = key)){
			window.scrollTo(0,0);
			view.render(model.get(key));
		}
	};
});
