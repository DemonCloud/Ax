// import ax from "ax-js"
// import ax from "ax" #or from alias for webpack

ax.module("Loader",function(ax,struct){
'use strict';

// Default Option 
// @param Array
// @param [element] - DOMElement (it must be true DOMElement) (required)
// @param [data] - embed to [event] object data
// @param [use] - use about [Ax module] defined module
// @param [do] - loader trigger function (once time) (required)

var DEFAULT_LOADER_OPTION = [
	{
		element: document.getElementById("app"),
		data : { /* a : 1, b: 2 */ },
		use : ["LazyLoaderPlugin","FastBannerPlugin"],
		do : function(event,LazyLoaderPlugin,FastBannerPlugin){
			// [Do Function] only trigger once 
			// when the [element] scroll in { user browser view }

			// the event is current dom info
			// event.target 
			// event.timeStamp trigger time
			// event.data ( Loader reg of data )
			// event.offset ( current offset when trigger popup action )

			// the other arguments is define [use] prop
			// it means another [Ax module] for callback
		}
	}
];

var extend = struct.extend(),
		clone = struct.clone(),
		depclone = struct.cloneDeep(),
		is    = struct.type('def');

var Loader = function(option){

	// merge the user options to source
	var source = extend(
		clone(DEFAULT_LOADER_OPTION),
		is(option,"Array") ?  option : []
	);

};


Loader.prototype = {

};

return Loader;

});
