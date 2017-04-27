define("modules/common",
["struct","aix"],
function(struct,aix){
	'use strict';

	var slice = struct.slice();
	var each = struct.each("array");

	var logs = slice(document.querySelectorAll(".toggle-button")).concat(
             slice(document.querySelectorAll(".s-menu-tab")));
	var rmclass = function(elm){
		elm.setAttribute("class",elm.getAttribute("class").replace(/\s+active/,''));
	};

	return new aix.view({
		root: document.getElementById("menu"),

		events:{
			"click:.toggle-button" : function(event){
				event.preventDefault();
				event.stopPropagation();

				each(logs,rmclass);
				
				this.setAttribute("class",this.getAttribute("class")+" active");
				document.getElementById("tab-"+this.getAttribute("id"))
								.setAttribute("class","s-menu-tab active");
			}
		}
	
	});
});
