define("modules/tags",
["struct"],
function(struct){
	'use strict';

	var _slice = struct.slice(),
			_each = struct.op("array");

	var tagview = {},
			mounter = document.getElementById("tags");

	var createTag = function(targetElm,ischild){
		var tag = document.createElement("a");
		tag.href = "javascript:;";
		tag.innerHTML = targetElm.innerText || targetElm.textContent;

		tag.setAttribute("class",ischild ? "t-child" : "t-out");
		tag.onclick = function(){
			targetElm.scrollIntoView(true);
		};

		return tag;
	};
	
	tagview.make = function(){
		mounter.innerHTML = "";
		_each(_slice(document.querySelectorAll("[t]")),function(elm){
			mounter.appendChild(createTag(elm));
			_each(_slice(document.querySelectorAll("[tc='"+(+elm.getAttribute("t"))+"']")),
			function(celm){
				mounter.appendChild(createTag(celm,true));
			});
		});
	};

	return tagview;
});
