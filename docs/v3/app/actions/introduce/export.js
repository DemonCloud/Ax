define("actions/introduce/export",
[
"actions/introduce/model",
"actions/introduce/view",
],
function(model,view){
	return function(key){
		if(key){
			window.scrollTo(0,0);
			view.render(model.get());
		}
	};
});
