define("modules/code",
["struct"],
function(struct){
	'use strict';

	var slice = struct.slice();
	var each = struct.op("array");
	var code = {};

	code.make = function(){
		each(slice(document.querySelectorAll(".code")),function(elm){
			var runcode = elm.innerText;
			var runbtn = document.createElement("button");
			
			runbtn.setAttribute("class","btn btn-fb-default run-code");
			runbtn.innerHTML = "run <i class='ion-compose'></i>";
			runbtn.onclick = function(event){
				event.preventDefault();
				event.stopPropagation();

				eval("(function(){\n"+runcode+"\n}())");
			};

			elm.parentNode.appendChild(runbtn);
		});
	};

	return code;
});
