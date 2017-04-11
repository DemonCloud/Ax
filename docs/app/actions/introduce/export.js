define("actions/introduce/export",
[
"actions/introduce/model",
"actions/introduce/view",
],
function(model,view){
	return function(key){
		if(key) 
			view.render(model.parse());
	};
});
