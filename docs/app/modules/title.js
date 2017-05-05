define("modules/title",
["struct"],
function(struct){
	var slice = struct.slice();
	var first = struct.first();
	var trim  = struct.string("trim");

	var title = first(slice(document.getElementsByTagName("title")||[]));

	return function(content){
		title.innerText = trim(content);
	};
});
