define("modules/search",
["struct","data/searchlist"],
function(struct,slist){
	'use strict';

	var DOOM = struct.doom();
	var size = struct.size();
	var find = struct.find();
	var has  = struct.has();
	var trim = struct.string("trim");

	var list = slist;
	var sinput = document.getElementById("search");
	var sresult = document.getElementById("search-result");

	// build search template
	var bt = DOOM(
		"{{*each [item] in list}}"+
		"	 <a href='#api@s={{#item.n}}' p=\"{{#(item.t===1 ? 'aix' : 'struct')}}\">"+
		"	 <i class='{{#(item.t===1 ? 'ion-ios-navigate'  :'ion-ios-circle-filled')}}'></i> "+
		"	 {{#item.n}}</a>"+
		"{{*end}}"
	);
	
	return sinput.addEventListener("input",function(event){
		event.stopPropagation();
		
		var val = trim(this.value);
		if(size(val) > 1){
			var reg = new RegExp(val,'i');
			var res = find(list,function(item){
				return has(item.k,reg);
			});

			sresult.innerHTML = bt({ list: res });
		}else{
			sresult.innerHTML = "";
		}
	});
});
