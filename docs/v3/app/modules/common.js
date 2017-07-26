define("modules/common",
["struct","ax","modules/search"],
function(struct,ax){
	'use strict';

	var slice = struct.slice();
	var each = struct.each("array");

	var logs = slice(document.querySelectorAll(".toggle-button")).concat(
             slice(document.querySelectorAll(".s-menu-tab")));
	var rmclass = function(elm){
		elm.setAttribute("class",elm.getAttribute("class").replace(/\s+active/,''));
	};

	return ax.view({
		root: document.getElementById("menu"),

		events:{
			"click:.toggle-button" : function(event){
				event.preventDefault();
				event.stopPropagation();

				if(!/active/.test(this.getAttribute("class"))){
					this.setAttribute((each(logs,rmclass),"class"),
						this.getAttribute("class")+" active");
					document.getElementById("tab-"+this.getAttribute("id"))
						.setAttribute("class","s-menu-tab active");
				}
			}
		}
	
	});
});
