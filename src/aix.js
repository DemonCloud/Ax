/* 
 * aix.js
 *
 * pure Javascript MVC framwork
 *
 * Include:
 * [ model ]
 * [ view ]
 * [ route ]
 *
 * *IE 9-Edge support
 *
 * @Author  : YIJUN
 * @Date    : 2016.6.22 - now
 * @Version : 0.1
 *
 * @License : FAL
 *
 * require Utils Lib [ struct ]
 */

(function(root,aix,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define(['struct'],function(struct){ return factory(aix,struct); });
	else if(typeof exports === "object" && typeof module !== "undefined")
		// support CommonJS exports
		module.exports = factory(aix,struct);
	else
		// build on browser global object
		root.aix = factory(aix,struct);

})(this, {}, function(aix,struct){
	"use strict";

	// Define DOM frame
	var z,Z,
	// Define Setting
		VIEW_DEFAULT = { root:"[__aix__]", events:{} },
		MODEL_DEFAULT = { data:{}, events:{}, validate:{} },
		ROUTE_DEFAULT = { char:"@", routes:{}, actions:{} },

	// resetful list 
	// use for aix ajax-api
	RESTFUL = {
		get    : "GET",
		put    : "POST",
		save   : "POST",
		post   : "POST",
		pull   : "POST",
		fetch  : "GET",
		update : "POST",
		delete : "POST"
	};

	// *use struct utils list
	var root    = struct.root,
		v8        = struct.v8(),
		_keys     = struct.keys(),
		_noop     = struct.noop(),
		_define   = struct.define(),
		_slice    = struct.slice(),
		_clone    = struct.clone(),
		_dpclone  = struct.depclone(),
		_extend   = struct.extend(),
		_eq       = struct.eq(),
		_toString = struct.convert('string'),
		_type     = struct.type(),
		_isObj    = struct.type('object'),
		_isFn     = struct.type('function'),
		_isInt    = struct.type('int'),
		_isAry    = struct.type('array'),
		_isPrim   = struct.type('primitive'),
		_loop     = struct.op(),
		_fol      = struct.op('object'),
		_fal      = struct.op('array'),
		_on       = struct.event('on'),
		_unbind   = struct.event('unbind'),
		_emit     = struct.event('emit'),
		_prop     = struct.prop(),
		_setProp  = struct.prop("set"),
		_watch    = struct.prop('watch'),
		_unwatch  = struct.prop('unwatch'),
		_param    = struct.param(),
		_trim     = struct.string('trim'),
		_one      = struct.index('one'),
		_has      = struct.has(),
		_find     = struct.find(),
		_ajax     = struct.ajax(),
		_size     = struct.size(),
		_doom     = struct.doom();

	// aix genertor function
	function genertor_(api){
		return function(){
			var tmp = _dpclone(this.data);
			var args = [tmp].concat(_slice(arguments));
			tmp = (struct[api]()).apply(tmp,args);
			if(!_eq(tmp,this.data))
				this.emit((this.data = tmp,api),null,args);
			return this;
		};
	}

	// not change rebase data
	function genertor_$(api){
		return function(){
			var tmp = _dpclone(this.data);
			var args = [tmp].concat(_slice(arguments));
			return struct[api]().apply(tmp,args);
		};
	}

	function hackaix(origin,extend){
		var fnstr = _toString(origin); 

		var oargs = _toString(origin);
		var eargs = _toString(extend);
		var body = fnstr.slice(
							 fnstr.indexOf("{") + 1, 
							 fnstr.lastIndexOf("}"));

		oargs = oargs.slice(oargs.indexOf('(')+1, oargs.indexOf(')'))
								 .match(/([^\s,]+)/g)[0];
		eargs = eargs.slice(eargs.indexOf('(')+1, eargs.indexOf(')'))
								 .match(/([^\s,]+)/g)[0];
  	
  	return [_toString(oargs),_toString(eargs),body];
	}

	function createExtend(origin){
		return function(def){
			var x = hackaix(aix[origin],aix[origin].extend);
			var extend = eval(
				"(function(ops){ " +
				"var " + x[0] + "=_extend(_extend({},"+x[1]+"),ops||{}); " +
				x[2] +
				"})"
			);

			_extend(extend.prototype,aix[origin].prototype);
			extend.prototype.constructor = extend;
			_define(extend,"base",{
				value: aix[origin],
  			writable: false,
  			enumerable: false,
  			configurable: false
			});
			return extend;
		};
	}
	// get childNodes and filter by selector
	// cant use Global matcher
	var isId     = /^#[^\s\=\+\.\#\[\]]+/i,												// "#idname"
			isClass  = /^\.[^\s\=\+\.\#\[\]]+$/i,											// ".className"
			isTag    = /^[^\[\]\+\-\.#\s\=]+$/i,												// "p" "div" "DIV"
			isAttr   = /([^\s]+)?\[([^\s]+)=["']?([^\s'"]+)["']?\]$/i,		// div[id="nami"]
			mreSl    = /^[^\s]+,[^\s]+/gi,
			cidSl    = /[\s|\r]+/im,
			pitSl    = /[>|\+|\~]+/im,
			isHTML   = /<[a-zA-Z][\s\S]*>/;

	// Performance JavaScript selector
	// Just Optimzer this function for sl pref
	// @ much more need its better
	function dsizzle(elm){
		elm = _trim(elm);

		var $el=[] ,$1 = !cidSl.test(elm) ,$2 = !pitSl.test(elm);
		if($1&&$2){
			if(elm.search(",")>-1)
				_fal(elm.split(","),function(sl){
					$el = $el.concat(dsizzle(sl));
				});

			else if(isId.test(elm))
				return [document.getElementById(elm.substr(1))];

			else if(isClass.test(elm))
				$el = document.getElementsByClassName(elm.substr(1));

			else if(isTag.test(elm))
				$el = document.getElementsByTagName(elm);

			else if(isAttr.test(elm)){
				var matcher = isAttr.exec(elm);
				var parent = matcher[1],
						attr   = matcher[2],
						value  = matcher[3];
				if(parent == null){
					return _clone(document.getElementsByTagName("*")).filter(function(e){
						return e.getAttribute(attr) === value;
					});
				} else {
					return dsizzle(parent).filter(function(e){
						return e.getAttribute(attr) === value;
					});			
				}

			}else{
				$el = document.querySelectorAll(elm);
			}
		}else{ 
			$el = document.querySelectorAll(elm);
		}

		return _clone($el);
	};

	function pushcache(sl){
		if(zCache.length >= 4)
			zCache.shift();
		zCache.push(sl);
	}

	function inpage(sl){
		return sl.$el.every(function(e){ 
			return e === document.body ? false : 
				(document.body.contains(e) || document.contains(e)); 
		});
	}

	var zCache = [];

	var zInit = function(x){
		return new Z(x);
	};

	Z = function(str){
		this.$el = [];
		
		if(str!=null){
			if(typeof str === "string"){
				this.$el = dsizzle(str);
				this.$indicator = str;
			}else if( str===document || str===root || str.nodeType ===1){
				this.$el.push(str);
				this.$indicator = str;
			}else if(_isAry(str)){
				this.$el = _find(str,function(node){ return node.nodeType===1; });
				this.$indicator = Math.random();
			}
		}

		_define(this,"length",{
			get:function(){
				return this.$el.length;
			},
			set:function(){
				return this.$el.length;
			},
			configurable : false,
			enumerable : false
		});
	};

	z = function(x){
		return zInit.call(root,x);
	};

	var _zid = 1,
		handlers = {},
		focusinSupported = 'onfocusin' in window,
		focus = { focus: 'focusin', blur: 'focusout' },
		hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' };
	
	var ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
		eventMethods = {
			preventDefault: 'isDefaultPrevented',
			stopImmediatePropagation: 'isImmediatePropagationStopped',
			stopPropagation: 'isPropagationStopped'
		};

	function zid(element) {
		return element._zid || (element._zid = _zid++);
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event);
	
		if (event.ns) 
			var matcher = matcherFor(event.ns);
	
		return (handlers[zid(element)] || []).filter(function(handler) {
			return handler &&
				(!event.e  || handler.e == event.e) &&
				(!event.ns || matcher.test(handler.ns)) &&
				(!fn       || zid(handler.fn) === zid(fn)) &&
				(!selector || handler.sel == selector);
		});
	}

	function parse(event) {
		var parts = ('' + event).split('.');
		return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
	}

	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}

	function eventCapture(handler, captureSetting) {
		return handler.del &&
			(!focusinSupported && (handler.e in focus)) ||
			!!captureSetting;
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type;
	}

	function zaddEvent(element, events, fn, data, selector, delegator, capture){
		var id = zid(element), set = (handlers[id] || (handlers[id] = []));
	
		_loop(events.split(/\s/),function(event){
			if (event == 'ready') 
				return z(fn);
	
			var handler   = parse(event);
			handler.fn    = fn;
			handler.sel   = selector;
			// emulate mouseenter, mouseleave
			if (handler.e in hover) 
				fn = function(e){
					var related = e.relatedTarget;
					if (!related || (related !== this && ! this.contains(related)))
						return handler.fn.apply(this, arguments);
				};
	
			handler.del   = delegator;
			var callback  = delegator || fn;
			handler.proxy = function(e){
				e = compatible(e);
	
				if (e.isImmediatePropagationStopped()) 
					return false;
	
				e.data = data;
				var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
	
				if (result === false) 
					e.preventDefault(), e.stopPropagation();
	
				return result;
			};
	
			handler.i = set.length;
			set.push(handler);
	
			element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
		});
	}

	function zremoveEvent(element, events, fn, selector, capture){
		var id = zid(element);
		_loop((events || '').split(/\s/),function(event){
			_loop(findHandlers(element, event, fn, selector),function(handler){
				delete handlers[id][handler.i];
	
				element.removeEventListener(
					realEvent(handler.e), 
					handler.proxy, 
					eventCapture(handler, capture)
				);
			});
		});
	}

	function returnTrue(){
		return true;
	}

	function returnFalse(){
		return false;
	}

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
	
			source || (source = event)
	
			_loop(eventMethods, function(predicate, name) {
				var sourceMethod = source[name];
	
				event[name] = function(){
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};
	
				event[predicate] = returnFalse;
			});
	
			try {
				event.timeStamp || (event.timeStamp = Date.now());
			} catch (ignored) { }
	
			if (source.defaultPrevented !== undefined ? source.defaultPrevented :
				'returnValue' in source ? source.returnValue === false :
				source.getPreventDefault && source.getPreventDefault())
				event.isDefaultPrevented = returnTrue;
		}
		return event;
	}

	function createProxy(event) {
		var key, proxy = { originalEvent: event };
		for (key in event)
			if (!ignoreProperties.test(key) && event[key] !== undefined) 
				proxy[key] = event[key];
	
		return compatible(proxy, event);
	}

	var matchzx = Element.prototype.matches ||
								Element.prototype.webkitMatchesSelector ||
								Element.prototype.mozMatchesSelector ||
								Element.prototype.msMatchesSelector ||
								function(selector){
									return (this.parentNode != null && this !== document) &&
											 _has(this.parentNode.querySelectorAll(selector),this);
								};

	z.matchz = function(elm,selector){
		if(elm==null||elm===document||typeof selector !== "string") 
			return false;
		return matchzx.call(elm, selector);
	};

	z.event = { 
		add: zaddEvent, 
		remove: zremoveEvent 
	};
	
	z.proxy = function(fn, context) {
		var args = (2 in arguments) && _slice(arguments, 2);
	
		if (_isFn(fn)) {
			var proxyFn = function(){ 
				return fn.apply(
					context, args ? 
					args.concat(_slice(arguments)) : arguments
				);
			};
	
			proxyFn._zid = zid(fn);
			return proxyFn;
	
		} else if (typeof context === "string") {
			if (args) {
				args.unshift(fn[context], fn);
				return z.proxy.apply(null, args);
			} else {
				return z.proxy(fn[context], fn);
			}
		} else {
			throw new TypeError("expected function");
		}
	};

	// z Custom Events
	z.Event = function(type, props) {
		if (typeof type !== "string") 
			props = type, type = props.type;
	
		var event = document.createEvent(
			_has(capTypes['MouseEvent'],type) ? 'MouseEvent' : 'Events'), bubbles = true;
	
		if (props) 
			for (var name in props) 
				(name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
	
		event.initEvent(type, bubbles, true);
		return compatible(event);
	};

	var diffcount;

	var Diff = function(options) {
		var diff = this;
		if (options) {
			_fal(_keys(options),function(option) {
				diff[option] = options[option];
			});
		}
	};

	Diff.prototype = {
		toString: function() {
			return JSON.stringify(this);
		},
		setValue: function(aKey, aValue) {
			this[aKey] = aValue;
			return this;
		}
	};

	var SubsetMapping = function SubsetMapping(a, b) {
		this.oldValue = a;
		this.newValue = b;
	};

	SubsetMapping.prototype = {
		contains: function contains(subset) {
			if (subset.length < this.length) {
				return subset.newValue >= this.newValue && subset.newValue < this.newValue + this.length;
			}
			return false;
		},
		toString: function toString() {
			return this.length + " element subset, first mapping: old " + this.oldValue + " → new " + this.newValue;
		}
	};

	var elementDescriptors = function(el) {
		var output = [];
		if (el.nodeName !== '#text' && el.nodeName !== '#comment') {
			output.push(el.nodeName);
			if (el.attributes) {
				if (el.attributes['class'])
					output.push(el.nodeName + '.' + el.attributes['class'].replace(/ /g, '.'));
				if (el.attributes.id)
					output.push(el.nodeName + '#' + el.attributes.id);
			}
		}
		return output;
	};

	var findUniqueDescriptors = function(li) {
		var uniqueDescriptors = {},
			duplicateDescriptors = {};

		_fal(li,function(node) {
			_fal(elementDescriptors(node),function(descriptor) {
				var inUnique = descriptor in uniqueDescriptors,
					inDupes = descriptor in duplicateDescriptors;
				if (!inUnique && !inDupes) {
					uniqueDescriptors[descriptor] = true;
				} else if (inUnique) {
					delete uniqueDescriptors[descriptor];
					duplicateDescriptors[descriptor] = true;
				}
			});

		});

		return uniqueDescriptors;
	};

	var uniqueInBoth = function(l1, l2) {
		var l1Unique = findUniqueDescriptors(l1),
			l2Unique = findUniqueDescriptors(l2),
			inBoth = {};

		_fal(_keys(l1Unique),function(key) {
			if (l2Unique[key])
				inBoth[key] = true;
		});

		return inBoth;
	};

	var removeDone = function(tree) {
		delete tree.outerDone;
		delete tree.innerDone;
		delete tree.valueDone;
		if (tree.childNodes)
			return tree.childNodes.every(removeDone);
		else
			return true;
	};

	var isEqual = function(e1, e2) {

		var e1Attributes, e2Attributes;

		if (!['nodeName', 'value', 'checked', 'selected', 'data'].every(function(element) {
			if (e1[element] !== e2[element])
				return false;
			return true;
		})) {
			return false;
		}

		if (Boolean(e1.attributes) !== Boolean(e2.attributes))
			return false;

		if (Boolean(e1.childNodes) !== Boolean(e2.childNodes))
			return false;

		if (e1.attributes) {
			e1Attributes = _keys(e1.attributes);
			e2Attributes = _keys(e2.attributes);

			if (e1Attributes.length !== e2Attributes.length) {
				return false;
			}
			if (!e1Attributes.every(function(attribute) {
				if (e1.attributes[attribute] !== e2.attributes[attribute]) {
					return false;
				}
			})) {
				return false;
			}
		}

		if (e1.childNodes) {
			if (e1.childNodes.length !== e2.childNodes.length)
				return false;
			if (!e1.childNodes.every(function(childNode, index) {
				return isEqual(childNode, e2.childNodes[index]);
			})) 
				return false;
		}

		return true;
	};


	var roughlyEqual = function(e1, e2, uniqueDescriptors, sameSiblings, preventRecursion) {
		var childUniqueDescriptors, nodeList1, nodeList2;

		if (!e1 || !e2)
			return false;

		if (e1.nodeName !== e2.nodeName)
			return false;

		if (e1.nodeName === '#text')
			// Note that we initially don't care what the text content of a node is,
			// the mere fact that it's the same tag and "has text" means it's roughly
			// equal, and then we can find out the true text difference later.
			return preventRecursion ? true : e1.data === e2.data;


		if (e1.nodeName in uniqueDescriptors)
			return true;

		if (e1.attributes && e2.attributes) {

			if (e1.attributes.id && e1.attributes.id === e2.attributes.id) {
				var idDescriptor = e1.nodeName + '#' + e1.attributes.id;
				if (idDescriptor in uniqueDescriptors) {
					return true;
				}
			}
			if (e1.attributes['class'] && e1.attributes['class'] === e2.attributes['class']) {
				var classDescriptor = e1.nodeName + '.' + e1.attributes['class'].replace(/ /g, '.');
				if (classDescriptor in uniqueDescriptors)
					return true;
			}
		}

		if (sameSiblings)
			return true;

		nodeList1 = e1.childNodes ? e1.childNodes.slice().reverse() : [];
		nodeList2 = e2.childNodes ? e2.childNodes.slice().reverse() : [];

		if (nodeList1.length !== nodeList2.length)
			return false;

		if (preventRecursion) {
			return nodeList1.every(function(element, index) {
				return element.nodeName === nodeList2[index].nodeName;
			});
		} else {
			// note: we only allow one level of recursion at any depth. If 'preventRecursion'
			// was not set, we must explicitly force it to true for child iterations.
			childUniqueDescriptors = uniqueInBoth(nodeList1, nodeList2);
			return nodeList1.every(function(element, index) {
				return roughlyEqual(element, nodeList2[index], childUniqueDescriptors, true, true);
			});
		}
	};

	/**
	 * based on https://en.wikibooks.org/wiki/Algorithm_implementation/Strings/Longest_common_substring#JavaScript
	 */
	var findCommonSubsets = function(c1, c2, marked1, marked2) {
		var lcsSize = 0,
			index = [],
			matches = Array.apply(null, new Array(c1.length + 1)).map(function() {
				return [];
			}), // set up the matching table
			uniqueDescriptors = uniqueInBoth(c1, c2),
			// If all of the elements are the same tag, id and class, then we can
			// consider them roughly the same even if they have a different number of
			// children. This will reduce removing and re-adding similar elements.
			subsetsSame = c1.length === c2.length,
			origin, ret;

		if (subsetsSame) {

			c1.some(function(element, i) {
				var c1Desc = elementDescriptors(element),
					c2Desc = elementDescriptors(c2[i]);
				if (c1Desc.length !== c2Desc.length) {
					subsetsSame = false;
					return true;
				}
				c1Desc.some(function(description, i) {
					if (description !== c2Desc[i]) {
						subsetsSame = false;
						return true;
					}
				});
				if (!subsetsSame) {
					return true;
				}

			});
		}

		// fill the matches with distance values
		_fal(c1,function(c1Element, c1Index) {
			_fal(c2,function(c2Element, c2Index) {
				if (!marked1[c1Index] && !marked2[c2Index] && roughlyEqual(c1Element, c2Element, uniqueDescriptors, subsetsSame)) {
					matches[c1Index + 1][c2Index + 1] = (matches[c1Index][c2Index] ? matches[c1Index][c2Index] + 1 : 1);
					if (matches[c1Index + 1][c2Index + 1] >= lcsSize) {
						lcsSize = matches[c1Index + 1][c2Index + 1];
						index = [c1Index + 1, c2Index + 1];
					}
				} else {
					matches[c1Index + 1][c2Index + 1] = 0;
				}
			});
		});
		if (lcsSize === 0) {
			return false;
		}
		origin = [index[0] - lcsSize, index[1] - lcsSize];
		ret = new SubsetMapping(origin[0], origin[1]);
		ret.length = lcsSize;

		return ret;
	};

	/**
	 * This should really be a predefined function in Array...
	 */
	var makeArray = function(n, v) {
		return Array.apply(null, new Array(n)).map(function() {
			return v;
		});
	};

	/**
	 * Generate arrays that indicate which node belongs to which subset,
	 * or whether it's actually an orphan node, existing in only one
	 * of the two trees, rather than somewhere in both.
	 *
	 * So if t1 = <img><canvas><br>, t2 = <canvas><br><img>.
	 * The longest subset is "<canvas><br>" (length 2), so it will group 0.
	 * The second longest is "<img>" (length 1), so it will be group 1.
	 * gaps1 will therefore be [1,0,0] and gaps2 [0,0,1].
	 *
	 * If an element is not part of any group, it will stay being 'true', which
	 * is the initial value. For example:
	 * t1 = <img><p></p><br><canvas>, t2 = <b></b><br><canvas><img>
	 *
	 * The "<p></p>" and "<b></b>" do only show up in one of the two and will
	 * therefore be marked by "true". The remaining parts are parts of the
	 * groups 0 and 1:
	 * gaps1 = [1, true, 0, 0], gaps2 = [true, 0, 0, 1]
	 *
	 */
	var getGapInformation = function(t1, t2, stable) {

		var gaps1 = t1.childNodes ? makeArray(t1.childNodes.length, true) : [],
			gaps2 = t2.childNodes ? makeArray(t2.childNodes.length, true) : [],
			group = 0;

		// give elements from the same subset the same group number
		_fal(stable,function(subset) {
			var i, endOld = subset.oldValue + subset.length,
				endNew = subset.newValue + subset.length;
			for (i = subset.oldValue; i < endOld; i += 1)
				gaps1[i] = group;
			for (i = subset.newValue; i < endNew; i += 1)
				gaps2[i] = group;
			group += 1;
		});

		return {
			gaps1: gaps1,
			gaps2: gaps2
		};
	};

	/**
	 * Find all matching subsets, based on immediate child differences only.
	 */
	var markSubTrees = function(oldTree, newTree) {
		// note: the child lists are views, and so update as we update old/newTree
		var oldChildren = oldTree.childNodes ? oldTree.childNodes : [],
			newChildren = newTree.childNodes ? newTree.childNodes : [],
			marked1 = makeArray(oldChildren.length, false),
			marked2 = makeArray(newChildren.length, false),
			subsets = [],
			subset = true,
			returnIndex = function() {
				return arguments[1];
			},
			markBoth = function(i) {
				marked1[subset.oldValue + i] = true;
				marked2[subset.newValue + i] = true;
			};

		while (subset) {
			subset = findCommonSubsets(oldChildren, newChildren, marked1, marked2);
			if (subset) {
				subsets.push(subset);

				_fal(Array.apply(null, new Array(subset.length)).map(returnIndex),markBoth);

			}
		}
		return subsets;
	};


	function swap(obj, p1, p2) {
		// (function(_) {
		// 	obj[p1] = obj[p2];
		// 	obj[p2] = _;
		// }(obj[p1]));
		obj[p1] ^= obj[p2];
		obj[p2] ^= obj[p1];
		obj[p1] ^= obj[p2];
	}


	var DiffTracker = function() {
		this.list = [];
	};

	DiffTracker.prototype = {
		list: false,
		add: function(diffs) {
			var list = this.list;
			_fal(diffs,function(diff) {
				list.push(diff);
			});
		},
		forEach: function(fn) {
			_fal(this.list,fn);
		}
	};

	var diffDOM = function(options) {

		var defaults = {
			debug: false,
			diffcap: 10, // Limit for how many diffs are accepting when debugging. Inactive when debug is false.
			maxDepth: false, // False or a numeral. If set to a numeral, limits the level of depth that the the diff mechanism looks for differences. If false, goes through the entire tree.
			valueDiffing: true, // Whether to take into consideration the values of forms that differ from auto assigned values (when a user fills out a form).
			// syntax: textDiff: function (node, currentValue, expectedValue, newValue)
			textDiff: function() {
				arguments[0].data = arguments[3];
				return;
			},
			// empty functions were benchmarked as running faster than both
			// `f && f()` and `if (f) { f(); }`
			preVirtualDiffApply: function() {},
			postVirtualDiffApply: function() {},
			preDiffApply: function() {},
			postDiffApply: function() {},
			filterOuterDiff: null
		},
			i;

		if (typeof options === "undefined") {
			options = {};
		}

		for (i in defaults) {
			if (typeof options[i] === "undefined")
				this[i] = defaults[i];
			else
				this[i] = options[i];
		}

		this._const = {
			addAttribute: 0,
			modifyAttribute: 1,
			removeAttribute: 2,
			modifyTextElement: 3,
			relocateGroup: 4,
			removeElement: 5,
			addElement: 6,
			removeTextElement: 7,
			addTextElement: 8,
			replaceElement: 9,
			modifyValue: 10,
			modifyChecked: 11,
			modifySelected: 12,
			modifyComment: 13,
			action: 'a',
			route: 'r',
			oldValue: 'o',
			newValue: 'n',
			element: 'e',
			'group': 'g',
			from: 'f',
			to: 't',
			name: 'na',
			value: 'v',
			'data': 'd',
			'attributes': 'at',
			'nodeName': 'nn',
			'childNodes': 'c',
			'checked': 'ch',
			'selected': 's'
		};
	};

	diffDOM.Diff = Diff;

	diffDOM.prototype = {

		// ===== Create a diff =====

		diff: function(t1Node, t2Node) {

			var t1 = this.nodeToObj(t1Node),
				t2 = this.nodeToObj(t2Node);

			diffcount = 0;

			if (this.debug) {
				this.t1Orig = this.nodeToObj(t1Node);
				this.t2Orig = this.nodeToObj(t2Node);
			}

			this.tracker = new DiffTracker();
			return this.findDiffs(t1, t2);
		},
		findDiffs: function(t1, t2) {
			var diffs;
			do {
				if (this.debug) {
					diffcount += 1;
					if (diffcount > this.diffcap) {
						window.diffError = [this.t1Orig, this.t2Orig];
						throw new Error("surpassed diffcap:" + JSON.stringify(this.t1Orig) + " -> " + JSON.stringify(this.t2Orig));
					}
				}
				diffs = this.findNextDiff(t1, t2, []);
				if (diffs.length === 0) {
					// Last check if the elements really are the same now.
					// If not, remove all info about being done and start over.
					// Somtimes a node can be marked as done, but the creation of subsequent diffs means that it has to be changed anyway.
					if (!isEqual(t1, t2)) {
						removeDone(t1);
						diffs = this.findNextDiff(t1, t2, []);
					}
				}

				if (diffs.length > 0) {
					this.tracker.add(diffs);
					this.applyVirtual(t1, diffs);
				}
			} while (diffs.length > 0);
			return this.tracker.list;
		},
		findNextDiff: function(t1, t2, route) {
			var diffs, fdiffs;

			if (this.maxDepth && route.length > this.maxDepth) {
				return [];
			}
			// outer differences?
			if (!t1.outerDone) {
				diffs = this.findOuterDiff(t1, t2, route);
				if (this.filterOuterDiff) {
					fdiffs = this.filterOuterDiff(t1, t2, diffs);
					if (fdiffs) diffs = fdiffs;
				}
				if (diffs.length > 0) {
					t1.outerDone = true;
					return diffs;
				} else {
					t1.outerDone = true;
				}
			}
			// inner differences?
			if (!t1.innerDone) {
				diffs = this.findInnerDiff(t1, t2, route);
				if (diffs.length > 0)
					return diffs;
				else
					t1.innerDone = true;
			}

			if (this.valueDiffing && !t1.valueDone) {
				// value differences?
				diffs = this.findValueDiff(t1, t2, route);

				if (diffs.length > 0) {
					t1.valueDone = true;
					return diffs;
				} else {
					t1.valueDone = true;
				}
			}

			// no differences
			return [];
		},
		findOuterDiff: function(t1, t2, route) {
			var t = this;
			var diffs = [],
				attr1, attr2;

			if (t1.nodeName !== t2.nodeName) {
				return [new Diff()
					.setValue(t._const.action, t._const.replaceElement)
					.setValue(t._const.oldValue, _clone(t1))
					.setValue(t._const.newValue, _clone(t2))
					.setValue(t._const.route, route)
				];
			}

			if (t1.data !== t2.data) {
				// Comment or text node.
				if (t1.nodeName === '#text') {
					return [new Diff()
						.setValue(t._const.action, t._const.modifyTextElement)
						.setValue(t._const.route, route)
						.setValue(t._const.oldValue, t1.data)
						.setValue(t._const.newValue, t2.data)
					];
				} else {
					return [new Diff()
						.setValue(t._const.action, t._const.modifyComment)
						.setValue(t._const.route, route)
						.setValue(t._const.oldValue, t1.data)
						.setValue(t._const.newValue, t2.data)
					];
				}

			}


			attr1 = t1.attributes ? _keys(t1.attributes).sort() : [];
			attr2 = t2.attributes ? _keys(t2.attributes).sort() : [];

			_fal(attr1,function(attr) {
				var pos = attr2.indexOf(attr);
				if (pos === -1) {
					diffs.push(new Diff()
						.setValue(t._const.action, t._const.removeAttribute)
						.setValue(t._const.route, route)
						.setValue(t._const.name, attr)
						.setValue(t._const.value, t1.attributes[attr])
					);
				} else {
					attr2.splice(pos, 1);
					if (t1.attributes[attr] !== t2.attributes[attr]) {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.modifyAttribute)
							.setValue(t._const.route, route)
							.setValue(t._const.name, attr)
							.setValue(t._const.oldValue, t1.attributes[attr])
							.setValue(t._const.newValue, t2.attributes[attr])
						);
					}
				}

			});


			_fal(attr2,function(attr) {
				diffs.push(new Diff()
					.setValue(t._const.action, t._const.addAttribute)
					.setValue(t._const.route, route)
					.setValue(t._const.name, attr)
					.setValue(t._const.value, t2.attributes[attr])
				);

			});

			return diffs;
		},
		nodeToObj: function(aNode) {
			var objNode = {},
				dobj = this;
			objNode.nodeName = aNode.nodeName;
			if (objNode.nodeName === '#text' || objNode.nodeName === '#comment') {
				objNode.data = aNode.data;
			} else {
				if (aNode.attributes && aNode.attributes.length > 0) {
					objNode.attributes = {};
					_fal(_slice(aNode.attributes),
						function(attribute) {
							objNode.attributes[attribute.name] = attribute.value;
						}
					);
				}
				if (aNode.childNodes && aNode.childNodes.length > 0) {
					objNode.childNodes = [];
					_fal(_slice(aNode.childNodes),
						function(childNode) {
							objNode.childNodes.push(dobj.nodeToObj(childNode));
						}
					);
				}
				if (this.valueDiffing) {
					if (aNode.value !== undefined) {
						objNode.value = aNode.value;
					}
					if (aNode.checked !== undefined) {
						objNode.checked = aNode.checked;
					}
					if (aNode.selected !== undefined) {
						objNode.selected = aNode.selected;
					}
				}
			}

			return objNode;
		},
		objToNode: function(objNode, insideSvg) {
			var node, dobj = this;
			if (objNode.nodeName === '#text') {
				node = document.createTextNode(objNode.data);

			} else if (objNode.nodeName === '#comment') {
				node = document.createComment(objNode.data);
			} else {
				if (objNode.nodeName === 'svg' || insideSvg) {
					node = document.createElementNS('http://www.w3.org/2000/svg', objNode.nodeName);
					insideSvg = true;
				} else {
					node = document.createElement(objNode.nodeName);
				}
				if (objNode.attributes) {
					_fal(_keys(objNode.attributes),function(attribute) {
						node.setAttribute(attribute, objNode.attributes[attribute]);
					});
				}
				if (objNode.childNodes) {
					_fal(objNode.childNodes,function(childNode) {
						node.appendChild(dobj.objToNode(childNode, insideSvg));
					});
				}
				if (this.valueDiffing) {
					if (objNode.value)
						node.value = objNode.value;
					if (objNode.checked)
						node.checked = objNode.checked;
					if (objNode.selected)
						node.selected = objNode.selected;
				}
			}
			return node;
		},
		findInnerDiff: function(t1, t2, route) {
			var t = this;
			var subtrees = (t1.childNodes && t2.childNodes) ? markSubTrees(t1, t2) : [],
				t1ChildNodes = t1.childNodes ? t1.childNodes : [],
				t2ChildNodes = t2.childNodes ? t2.childNodes : [],
				childNodesLengthDifference, diffs = [],
				index = 0,
				last, e1, e2, i;

			if (subtrees.length > 0) {
				/* One or more groups have been identified among the childnodes of t1
				 * and t2.
				 */
				diffs = this.attemptGroupRelocation(t1, t2, subtrees, route);
				if (diffs.length > 0)
					return diffs;
			}

			/* 0 or 1 groups of similar child nodes have been found
			 * for t1 and t2. 1 If there is 1, it could be a sign that the
			 * contents are the same. When the number of groups is below 2,
			 * t1 and t2 are made to have the same length and each of the
			 * pairs of child nodes are diffed.
			 */


			last = Math.max(t1ChildNodes.length, t2ChildNodes.length);
			if (t1ChildNodes.length !== t2ChildNodes.length)
				childNodesLengthDifference = true;

			for (i = 0; i < last; i += 1) {
				e1 = t1ChildNodes[i];
				e2 = t2ChildNodes[i];

				if (childNodesLengthDifference) {
					/* t1 and t2 have different amounts of childNodes. Add
					 * and remove as necessary to obtain the same length */
					if (e1 && !e2) {
						if (e1.nodeName === '#text') {
							diffs.push(new Diff()
								.setValue(t._const.action, t._const.removeTextElement)
								.setValue(t._const.route, route.concat(index))
								.setValue(t._const.value, e1.data)
							);
							index -= 1;
						} else {
							diffs.push(new Diff()
								.setValue(t._const.action, t._const.removeElement)
								.setValue(t._const.route, route.concat(index))
								.setValue(t._const.element, _clone(e1))
							);
							index -= 1;
						}

					} else if (e2 && !e1) {
						if (e2.nodeName === '#text') {
							diffs.push(new Diff()
								.setValue(t._const.action, t._const.addTextElement)
								.setValue(t._const.route, route.concat(index))
								.setValue(t._const.value, e2.data)
							);
						} else {
							diffs.push(new Diff()
								.setValue(t._const.action, t._const.addElement)
								.setValue(t._const.route, route.concat(index))
								.setValue(t._const.element, _clone(e2))
							);
						}
					}
				}
				/* We are now guaranteed that childNodes e1 and e2 exist,
				 * and that they can be diffed.
				 */
				/* Diffs in child nodes should not affect the parent node,
				 * so we let these diffs be submitted together with other
				 * diffs.
				 */

				if (e1 && e2) {
					diffs = diffs.concat(this.findNextDiff(e1, e2, route.concat(index)));
				}

				index += 1;

			}
			t1.innerDone = true;
			return diffs;

		},

		attemptGroupRelocation: function(t1, t2, subtrees, route) {
			/* Either t1.childNodes and t2.childNodes have the same length, or
			 * there are at least two groups of similar elements can be found.
			 * attempts are made at equalizing t1 with t2. First all initial
			 * elements with no group affiliation (gaps=true) are removed (if
			 * only in t1) or added (if only in t2). Then the creation of a group
			 * relocation diff is attempted.
			 */
			var t = this;
			var gapInformation = getGapInformation(t1, t2, subtrees),
				gaps1 = gapInformation.gaps1,
				gaps2 = gapInformation.gaps2,
				shortest = Math.min(gaps1.length, gaps2.length),
				destinationDifferent, toGroup,
				group, node, similarNode, testI, diffs = [],
				index1, index2, j;


			for (index2 = 0, index1 = 0; index2 < shortest; index1 += 1, index2 += 1) {
				if (gaps1[index2] === true) {
					node = t1.childNodes[index1];
					if (node.nodeName === '#text') {
						if (t2.childNodes[index2].nodeName === '#text' && node.data !== t2.childNodes[index2].data) {
							testI = index1;
							while (t1.childNodes.length > testI + 1 && t1.childNodes[testI + 1].nodeName === '#text') {
								testI += 1;
								if (t2.childNodes[index2].data === t1.childNodes[testI].data) {
									similarNode = true;
									break;
								}
							}
							if (!similarNode) {
								diffs.push(new Diff()
									.setValue(t._const.action, t._const.modifyTextElement)
									.setValue(t._const.route, route.concat(index2))
									.setValue(t._const.oldValue, node.data)
									.setValue(t._const.newValue, t2.childNodes[index2].data)
								);
								return diffs;
							}
						}
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.removeTextElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.value, node.data)
						);
						gaps1.splice(index2, 1);
						shortest = Math.min(gaps1.length, gaps2.length);
						index2 -= 1;
					} else {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.removeElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.element, _clone(node))
						);
						gaps1.splice(index2, 1);
						shortest = Math.min(gaps1.length, gaps2.length);
						index2 -= 1;
					}

				} else if (gaps2[index2] === true) {
					node = t2.childNodes[index2];
					if (node.nodeName === '#text') {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.addTextElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.value, node.data)
						);
						gaps1.splice(index2, 0, true);
						shortest = Math.min(gaps1.length, gaps2.length);
						index1 -= 1;
					} else {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.addElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.element, _clone(node))
						);
						gaps1.splice(index2, 0, true);
						shortest = Math.min(gaps1.length, gaps2.length);
						index1 -= 1;
					}

				} else if (gaps1[index2] !== gaps2[index2]) {
					if (diffs.length > 0) {
						return diffs;
					}
					// group relocation
					group = subtrees[gaps1[index2]];
					toGroup = Math.min(group.newValue, (t1.childNodes.length - group.length));
					if (toGroup !== group.oldValue) {
						// Check whether destination nodes are different than originating ones.
						destinationDifferent = false;
						for (j = 0; j < group.length; j += 1) {
							if (!roughlyEqual(t1.childNodes[toGroup + j], t1.childNodes[group.oldValue + j], [], false, true)) {
								destinationDifferent = true;
							}
						}
						if (destinationDifferent) {
							return [new Diff()
								.setValue(t._const.action, t._const.relocateGroup)
								.setValue('groupLength', group.length)
								.setValue(t._const.from, group.oldValue)
								.setValue(t._const.to, toGroup)
								.setValue(t._const.route, route)
							];
						}
					}
				}
			}
			return diffs;
		},

		findValueDiff: function(t1, t2, route) {
			// Differences of value. Only useful if the value/selection/checked value
			// differs from what is represented in the DOM. For example in the case
			// of filled out forms, etc.
			var diffs = [];
			var t = this;

			if (t1.selected !== t2.selected) {
				diffs.push(new Diff()
					.setValue(t._const.action, t._const.modifySelected)
					.setValue(t._const.oldValue, t1.selected)
					.setValue(t._const.newValue, t2.selected)
					.setValue(t._const.route, route)
				);
			}

			if ((t1.value || t2.value) && t1.value !== t2.value && t1.nodeName !== 'OPTION') {
				diffs.push(new Diff()
					.setValue(t._const.action, t._const.modifyValue)
					.setValue(t._const.oldValue, t1.value)
					.setValue(t._const.newValue, t2.value)
					.setValue(t._const.route, route)
				);
			}
			if (t1.checked !== t2.checked) {
				diffs.push(new Diff()
					.setValue(t._const.action, t._const.modifyChecked)
					.setValue(t._const.oldValue, t1.checked)
					.setValue(t._const.newValue, t2.checked)
					.setValue(t._const.route, route)
				);
			}

			return diffs;
		},

		// ===== Apply a virtual diff =====

		applyVirtual: function(tree, diffs) {
			var dobj = this;
			if (diffs.length === 0)
				return true;
			_fal(diffs,function(diff) {
				dobj.applyVirtualDiff(tree, diff);
			});
			return true;
		},
		getFromVirtualRoute: function(tree, route) {
			var node = tree,
				parentNode, nodeIndex;

			route = route.slice();
			while (route.length > 0) {
				if (!node.childNodes) {
					return false;
				}
				nodeIndex = route.splice(0, 1)[0];
				parentNode = node;
				node = node.childNodes[nodeIndex];
			}
			return {
				node: node,
				parentNode: parentNode,
				nodeIndex: nodeIndex
			};
		},
		applyVirtualDiff: function(tree, diff) {
			var routeInfo = this.getFromVirtualRoute(tree, diff[this._const.route]),
				node = routeInfo.node,
				parentNode = routeInfo.parentNode,
				nodeIndex = routeInfo.nodeIndex,
				newNode, route, c;

			var t = this;
			// pre-diff hook
			var info = {
				diff: diff,
				node: node
			};

			if (this.preVirtualDiffApply(info))
				return true;

			switch (diff[this._const.action]) {
				case this._const.addAttribute:
					if (!node.attributes) {
						node.attributes = {};
					}

					node.attributes[diff[this._const.name]] = diff[this._const.value];

					if (diff[this._const.name] === 'checked') {
						node.checked = true;
					} else if (diff[this._const.name] === 'selected') {
						node.selected = true;
					} else if (node.nodeName === 'INPUT' && diff[this._const.name] === 'value') {
						node.value = diff[this._const.value];
					}

					break;
				case this._const.modifyAttribute:
					node.attributes[diff[this._const.name]] = diff[this._const.newValue];
					if (node.nodeName === 'INPUT' && diff[this._const.name] === 'value') {
						node.value = diff[this._const.value];
					}
					break;
				case this._const.removeAttribute:

					delete node.attributes[diff[this._const.name]];

					if (_keys(node.attributes).length === 0) {
						delete node.attributes;
					}

					if (diff[this._const.name] === 'checked') {
						node.checked = false;
					} else if (diff[this._const.name] === 'selected') {
						delete node.selected;
					} else if (node.nodeName === 'INPUT' && diff[this._const.name] === 'value') {
						delete node.value;
					}

					break;
				case this._const.modifyTextElement:
					node.data = diff[this._const.newValue];

					if (parentNode.nodeName === 'TEXTAREA') {
						parentNode.value = diff[this._const.newValue];
					}
					break;
				case this._const.modifyValue:
					node.value = diff[this._const.newValue];
					break;
				case this._const.modifyComment:
					node.data = diff[this._const.newValue];
					break;
				case this._const.modifyChecked:
					node.checked = diff[this._const.newValue];
					break;
				case this._const.modifySelected:
					node.selected = diff[this._const.newValue];
					break;
				case this._const.replaceElement:
					newNode = _clone(diff[this._const.newValue]);
					newNode.outerDone = true;
					newNode.innerDone = true;
					newNode.valueDone = true;
					parentNode.childNodes[nodeIndex] = newNode;
					break;
				case this._const.relocateGroup:
					_fal(node.childNodes.splice(diff[this._const.from], diff.groupLength).reverse(),
					function(movedNode) {
							node.childNodes.splice(diff[t._const.to], 0, movedNode);
					});
					break;
				case this._const.removeElement:
					parentNode.childNodes.splice(nodeIndex, 1);
					break;
				case this._const.addElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					node = this.getFromVirtualRoute(tree, route).node;
					newNode = _clone(diff[this._const.element]);
					newNode.outerDone = true;
					newNode.innerDone = true;
					newNode.valueDone = true;

					if (!node.childNodes) {
						node.childNodes = [];
					}

					if (c >= node.childNodes.length) {
						node.childNodes.push(newNode);
					} else {
						node.childNodes.splice(c, 0, newNode);
					}
					break;
				case this._const.removeTextElement:
					parentNode.childNodes.splice(nodeIndex, 1);
					if (parentNode.nodeName === 'TEXTAREA') {
						delete parentNode.value;
					}
					break;
				case this._const.addTextElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					newNode = {};
					newNode.nodeName = '#text';
					newNode.data = diff[this._const.value];
					node = this.getFromVirtualRoute(tree, route).node;
					if (!node.childNodes) {
						node.childNodes = [];
					}

					if (c >= node.childNodes.length) {
						node.childNodes.push(newNode);
					} else {
						node.childNodes.splice(c, 0, newNode);
					}
					if (node.nodeName === 'TEXTAREA') {
						node.value = diff[this._const.newValue];
					}
					break;
				default:
					console.log('unknown action');
			}

			// capture newNode for the callback
			info.newNode = newNode;
			this.postVirtualDiffApply(info);

			return;
		},

		// ===== Apply a diff =====
		apply: function(tree, diffs) {
			var dobj = this;

			if (diffs.length === 0) {
				return true;
			}
			_fal(diffs,function(diff) {
				if (!dobj.applyDiff(tree, diff))
					return false;
			});
			return true;
		},
		getFromRoute: function(tree, route) {
			route = route.slice();
			var c, node = tree;
			while (route.length > 0) {
				if (!node.childNodes)
					return false;
				c = route.splice(0, 1)[0];
				node = node.childNodes[c];
			}
			return node;
		},
		applyDiff: function(tree, diff) {
			var node = this.getFromRoute(tree, diff[this._const.route]),
				newNode, reference, route, c;

			var t = this;
			// pre-diff hook
			var info = {
				diff: diff,
				node: node
			};

			if (this.preDiffApply(info)) {
				return true;
			}

			switch (diff[this._const.action]) {
				case this._const.addAttribute:
					if (!node || !node.setAttribute) {
						return false;
					}
					node.setAttribute(diff[this._const.name], diff[this._const.value]);
					break;
				case this._const.modifyAttribute:
					if (!node || !node.setAttribute) {
						return false;
					}
					node.setAttribute(diff[this._const.name], diff[this._const.newValue]);
					break;
				case this._const.removeAttribute:
					if (!node || !node.removeAttribute) {
						return false;
					}
					node.removeAttribute(diff[this._const.name]);
					break;
				case this._const.modifyTextElement:
					if (!node || node.nodeType !== 3) {
						return false;
					}
					this.textDiff(node, node.data, diff[this._const.oldValue], diff[this._const.newValue]);
					break;
				case this._const.modifyValue:
					if (!node || node.value === void 0) {
						return false;
					}
					node.value = diff[this._const.newValue];
					break;
				case this._const.modifyComment:
					if (!node || node.data === void 0) {
						return false;
					}
					this.textDiff(node, node.data, diff[this._const.oldValue], diff[this._const.newValue]);
					break;
				case this._const.modifyChecked:
					if (!node || node.checked === void 0) {
						return false;
					}
					node.checked = diff[this._const.newValue];
					break;
				case this._const.modifySelected:
					if (!node || node.selected === void 0) {
						return false;
					}
					node.selected = diff[this._const.newValue];
					break;
				case this._const.replaceElement:
					node.parentNode.replaceChild(this.objToNode(diff[this._const.newValue], node.namespaceURI === 'http://www.w3.org/2000/svg'), node);
					break;
				case this._const.relocateGroup:
					_fal(Array.apply(null, new Array(diff.groupLength)).map(function() {
						return node.removeChild(node.childNodes[diff[t._const.from]]);
					}),function(childNode, index) {
						if (index === 0)
							reference = node.childNodes[diff[t._const.to]];
						node.insertBefore(childNode, reference);
					});
					break;
				case this._const.removeElement:
					node.parentNode.removeChild(node);
					break;
				case this._const.addElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					node = this.getFromRoute(tree, route);
					node.insertBefore(this.objToNode(diff[this._const.element], node.namespaceURI === 'http://www.w3.org/2000/svg'), node.childNodes[c]);
					break;
				case this._const.removeTextElement:
					if (!node || node.nodeType !== 3) {
						return false;
					}
					node.parentNode.removeChild(node);
					break;
				case this._const.addTextElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					newNode = document.createTextNode(diff[this._const.value]);
					node = this.getFromRoute(tree, route);
					if (!node || !node.childNodes) {
						return false;
					}
					node.insertBefore(newNode, node.childNodes[c]);
					break;
				default:
					console.log('unknown action');
			}

			// if a new node was created, we might be interested in it
			// post diff hook
			info.newNode = newNode;
			this.postDiffApply(info);

			return true;
		},

		// ===== Undo a diff =====

		undo: function(tree, diffs) {
			diffs = diffs.slice();
			var dobj = this;
			if (!diffs.length) {
				diffs = [diffs];
			}
			diffs.reverse();
			_fal(diffs,function(diff) {
				dobj.undoDiff(tree, diff);
			});
		},
		undoDiff: function(tree, diff) {
			switch (diff[this._const.action]) {
				case this._const.addAttribute:
					diff[this._const.action] = this._const.removeAttribute;
					this.applyDiff(tree, diff);
					break;
				case this._const.modifyAttribute:
					swap(diff, this._const.oldValue, this._const.newValue);
					this.applyDiff(tree, diff);
					break;
				case this._const.removeAttribute:
					diff[this._const.action] = this._const.addAttribute;
					this.applyDiff(tree, diff);
					break;
				case this._const.modifyTextElement:
					swap(diff, this._const.oldValue, this._const.newValue);
					this.applyDiff(tree, diff);
					break;
				case this._const.modifyValue:
					swap(diff, this._const.oldValue, this._const.newValue);
					this.applyDiff(tree, diff);
					break;
				case this._const.modifyComment:
					swap(diff, this._const.oldValue, this._const.newValue);
					this.applyDiff(tree, diff);
					break;
				case this._const.modifyChecked:
					swap(diff, this._const.oldValue, this._const.newValue);
					this.applyDiff(tree, diff);
					break;
				case this._const.modifySelected:
					swap(diff, this._const.oldValue, this._const.newValue);
					this.applyDiff(tree, diff);
					break;
				case this._const.replaceElement:
					swap(diff, this._const.oldValue, this._const.newValue);
					this.applyDiff(tree, diff);
					break;
				case this._const.relocateGroup:
					swap(diff, this._const.from, this._const.to);
					this.applyDiff(tree, diff);
					break;
				case this._const.removeElement:
					diff[this._const.action] = this._const.addElement;
					this.applyDiff(tree, diff);
					break;
				case this._const.addElement:
					diff[this._const.action] = this._const.removeElement;
					this.applyDiff(tree, diff);
					break;
				case this._const.removeTextElement:
					diff[this._const.action] = this._const.addTextElement;
					this.applyDiff(tree, diff);
					break;
				case this._const.addTextElement:
					diff[this._const.action] = this._const.removeTextElement;
					this.applyDiff(tree, diff);
					break;
				default:
					console.log('unknown action');
			}

		}
	};

	var _DIFF = new diffDOM({
		diffcap: 999999
	});
	// end off domdiff

	var supportTemplate = "content" in document.createElement("template");
	function createDOM(rootElm,html){
		var r = rootElm.cloneNode();
		if(supportTemplate){
			var t = document.createElement("template");
			t.innerHTML = html;
			r.appendChild(t.content);
		}else{
			r.innerHTML = html;
		}
		return r;
	}
	// Doom Events
	// Dom fired api
	var capEvents = [
		"blur"       , "invalid"     ,
		"focusin"    , "focusout"    , "focus",
		"abort"      , "afterprint"  , "beforeprint" ,
		"checking"   , "downloading" ,
		"load"       , "unload"      ,
		"loadend"    , "loadstart"   ,
		"mouseenter" , "mouseleave"  ,
		"resize"     , "show"        , "select"
	];

	var capTypes = {
		"UIEvent"       : [
			"focus",
			"blur",
			"focusin",
			"focusout"
		],
		"MouseEvent"    : [
			"click",
			"dbclick",
			"mouseup",
			"mousedown",
			"mouseout",
			"mouseover",
			"mouseenter",
			"mouseleave"
		],
		"KeyboardEvent" : [
			"keydown",
			"keypress",
			"keyup"
		]
	};

	Z.prototype = {
		get : function(index){
			return 0 in arguments ? 
						 this.$el[( +index + ( index < 0 ? this.length : 0 ) )] : 
						 _slice(this.$el);
		},

		each : function(fn,context){
			_fal(this.$el,fn,context||this);
			return this;
		},

		find : function(sl){
			var res = []; 
			_fal(this.$el,function(e){
				res = _slice(e.querySelectorAll(sl)).concat(res);
			});
			return z(res);
		},

		closest : function(selector,element){
			var el = this.$el ,find ,tmp;

			for(var i=0,l=el.length;i<l;i++){
				tmp = el[i];

				while(tmp&&!find&&tmp!==element){
					tmp = tmp.parentNode;
					if(z.matchz(tmp,selector)) find=tmp;
				}

				if(find) break;
			}

			return z(find ? [find] : []);
		},

		on : function(event, selector, data, callback, one){
			var autoRemove, delegator, $this = this;
	
			if (event && typeof event !== "string") {
				_loop(event, function(fn, type){
					$this.on(type, selector, data, fn, one);
				});
	
				return $this;
			}
	
			if ((typeof selector !== "string") && 
				!_isFn(callback) && 
				callback !== false)
				callback = data, data = selector, selector = undefined;
			if (callback === undefined || data === false)
				callback = data, data = undefined;
	
			if (callback === false) 
				callback = returnFalse;
	
			return $this.each(function(element){
				if (one) 
					autoRemove = function(e){
						zremoveEvent(element, e.type, callback);
						return callback.apply(this, arguments);
					};
	
				if (selector) 
					delegator = function(e){
						var evt, 
							match = !z.matchz(e.target,selector) ? 
											z(e.target).closest(selector, element).get(0) :
											e.target;

						if (match && match !== element){
							evt = _extend(createProxy(e), {currentTarget: match, liveFired: element});
							return (autoRemove || callback).apply(match, [evt].concat(_slice(arguments,1)));
						}
					};
	
				zaddEvent(element, event, callback, data, selector, delegator || autoRemove);
			});
		},

		off : function(event, selector, callback){
			var $this = this;

			if (event && typeof event !== "string") {
				_loop(event, function(fn, type){
					this.off(type, selector, fn);
				},this);
				return this;
			}
	
			if (typeof selector !== "string" && 
				!_isFn(callback) && 
				callback !== false)
				callback = selector, selector = undefined;
	
			if (callback === false) 
				callback = returnFalse;
	
			return this.each(function(element){
				zremoveEvent(element, event, callback, selector);
			});
		},

		trigger : function(event, args){
			event = typeof event === "string" ? z.Event(event) : compatible(event);
			event._args = args;
	
			return this.each(function(element){
				// handle focus(), blur() by calling them directly
				if (event.type in focus && _isFn(element[event.type])) 
					element[event.type]();
				// items in the collection might not be DOM elements
				else if ('dispatchEvent' in element) 
					element.dispatchEvent(event);
				else 
					z(element).triggerHandler(event, args);
			});
		},
	
		triggerHandler : function(event, args){
			var e, result;
			this.each(function(element){
				e = createProxy( typeof event === "string" ? z.Event(event) : event);
	
				e._args = args;
				e.target = element;
				_loop(findHandlers(element, event.type || event), function(handler){
					result = handler.proxy(e);
					if (e.isImmediatePropagationStopped()) return false;
				});
			});
	
			return result;
		},
	
		emit : function(){
			return this.trigger.apply(this,arguments);
		},

		// virtual render
		render : function(newhtml){
			return this.each(function(elm){
				this.apply(elm,this.diff(elm,
					createDOM(elm,newhtml.nodeType === 1 ? 
						newhtml.outerHTML : _toString(newhtml))
					)
				);
			},_DIFF);
		}
	};

	function checkValidate(olddata,newdata,validate){
		var res = false,key,s=_size(validate);
		if(!s) return true;
		if(!_eq(olddata,newdata)){
			key = _keys(validate); res = true;
			for(var i=0,isRequired; i<s; i++){
				// get validate funtion
				isRequired = validate[key[i]];
				if(!isRequired(_prop(newdata,key[i]))){
					res = false; break;
				}
			}
		}
		return res;
	}

	// Aix Model
	aix.model = function(obj){
		var config = _extend(_clone(MODEL_DEFAULT),obj||{}),
			data = config.data,
			events = config.events,
			validate = config.validate;

		delete config.data;
		delete config.change;
		delete config.events;
		delete config.validate;

		_extend(this,config);
		// if userobj has more events
		_fol(events,this.uon,this);

		// define data
		_define(this,"data",{
			get : function(){
				return _clone(data);
			},
			set : function(newdata){
				if(_eq(data,newdata))
					return data;
				var args = [_clone(newdata)];
				if((this.emit("validate",args),
					_isPrim(newdata)?
					validate(newdata):
					checkValidate(data,newdata,validate)))
					return data=newdata,
					this.emit("validate:success,change",args),
					this.change=true,
					newdata;
				return this.emit("validate:fail",args),data;
			},
			enumerable:true,
			configurable:false
		});

		this.emit("init",[this.parse()]);
	};

	// Extend aix model method 
	// Model Prototype extend
	// model data usually define as pure data, not javascript event or function
	// because it much as MVC-M logs 
	aix.model.prototype = {
		get : function(key){
			if(key!=null)
				return _prop(this.data,key);
			return this.data;
		},

		set : function(){
			var param;
			this.data = arguments.length > 1 ?
				(param = arguments[0],
				_setProp(this.parse(),arguments[0],arguments[1])) : 
				arguments[0];
			return param ? this.emit("change:"+param,[arguments[1]]) : this;
		},

		// API event
		on: function(type,fn){
			if(_isFn(fn)) _on(this,type,fn);
			return this;
		},

		uon: function(fn,type){
			return this.on(type,fn);
		},

		unbind : function(type,fn){
			return _unbind(this,type,fn);
		},

		emit : function(type,fn,args){
			return _fal((type||"").split(","),function(t){
				_emit(this,t,fn,args);
			},this),this;
		},

		// Aix Restful API design for
		// [Aix Model] data format serialize
		toJSON : function(){
			return _isPrim(this.data) ? 
				this.data : 
				JSON.stringify(this.data);
		},

		parse : function(deep){
			return _clone(this.data,deep);
		},

		// Fetch mean Restful "GET"
		// fetch data form url with param
		pipe : function(type,url,param,fns,fnf,header){
			//param must be object typeof
			var st = {
				type  : RESTFUL[toString(type).toLowerCase()],
				aysnc : true
			},
			_fns,
			_fnf,
			isFn= _isFn(param);

			// deel with arguments 
			if(typeof url === 'string'){
				st.url = url;
				st.param = isFn ? {} : (param || {});
				_fns = isFn ?  param : (fns || _noop);
				_fnf = isFn ? (fns || _noop) : (fnf || _noop);
			}else if(_isObj(url)){
				st.url = this.url || "/";
				st.param = isFn ? url : (param || {});
				_fns = isFn ?  param : (fns || _noop);
				_fnf = isFn ? (fns || _noop) : (fnf || _noop);
			}else{
				// no param
				st.url = this.url || "/";
				_fns = _noop;
				_fnf = _noop;
			}

			// set http header param
			st.header = header;
			st.success  = function(responseText,xhr,event){
				// change the data before dispatch event;
				_fns.call(this,responseText,xhr,event);
				this.emit(type+":success",[responseText,xhr,event]);
			}.bind(this);
			st.fail = function(xhr,event){
				_fnf.call(this,xhr,event);
				_this.emit(type+":fail",[xhr,event]);
			}.bind(this);

			// trigger ajax events
			var get_xhr = _ajax(st);
			return this.emit(type,[get_xhr,st]);
		},

		aget: function(url,param,fns,fnf,header){
			return this.pipe.apply(this,["get"].concat(_clone(arguments)));
		},

		fetch: function(param,fns,fnf,header){
			return this.pipe.apply(this,[
				"fetch",
				this.url,
				param,
				function(responseText,xhr,event){
					this.data = JSON.parse(responseText);
					(fns||_noop).call(this,responseText,xhr,event);
				},
				fnf,
				header
			]);
		},

		post: function(url,param,fns,fnf,header){
		  return this.pipe.apply(this,[
		  		"post",
		  		url,
		  		param || this.parse(),
		  		fns,
		  		fnf,
		  		header
			]);
		},

		save: function(url,param,fns,fnf,header){
		  return this.pipe.apply(this,[
		  		"save",
		  		url,
		  		param || this.parse(),
		  		fns,
		  		fnf,
		  		header
			]);
		},

		toString: function(){
			return this.data;
		}
	};

	// bind selector
	aix.view = function(obj){
		var config = _extend(_clone(VIEW_DEFAULT),obj||{}),
			events = config.events;

		delete config.events;
		// parse template
		// building the render function
		if(!_isFn(config.render)){
			var template = typeof config.template === "string" ? 
				_doom(config.template) :
				(config.template || _noop);

			config.render = function(){ 
				return (template !== _noop && 
					z(config.root).render(
						template.apply(this,arguments))),this;
			};

			delete config.template;
		}

		_extend(this,config);
		// if userobj has more events
		_fol(events,this.uon,this);

		// first trgger "init" event
		this.emit("init");
	};

	aix.view.prototype = {
		on : function(type,fn){
			return _fal((type||"").split(","),function(mk){
				var param = mk.split(":");
				// DOM Element events
				if(param.length > 1)
					z(this.root).on(param[0],param[1],{self:this},fn);
				else
					_on(this,mk,fn);
			},this),this;
		},

		uon : function(fn,type){
			return this.on(type,fn);
		},

		unbind : function(type,fn){
			return _fal((type||"").split(","),function(mk){
				var param = mk.split(":");
				// DOM Element events
				if(param.length > 1)
					z(this.root).off(param[0],param[1],fn);
				else
					_unbind(this,mk,fn);
			},this),this;
		},

		emit : function(type,fn,args){
			if(_isAry(fn))
				args = fn,fn = null;

			var k = (type||"").split(":");

			if(k.length>2){
				return _fal((type||"").split(","),function(mk){
					var mkf = mk.split(":");
					z(this.root).find(mkf[1]).trigger(mkf[0],args);
				},this),this;
			}

			if(k.length>1)
				return z(this.root).find(k[1]).trigger(k[0],args),this;

			return _emit(this,type,fn,args);
		}
	};

	//get Hash param form URL
	function hashGet(url,char){
		var index = url.search("#"),
			charindex = url.search(char);
		return index>0 ? url.slice(index+1,!~charindex?void 0:charindex) : "";
	}

	function hashParam(url,char){
		var charindex = url.search(char);
		return _param(!~charindex ? void 0 : url.slice(charindex+1));
	}

	//if HashChange callee
	function changeHash(url,char,event){
		var hash = hashGet(url,char), param = hashParam(url,char); 
		_fol(this.routes,function(fn,key){
			if(RegExp(key,"i").test(hash))
				changeHashReg.call(this,fn,
					[hash,param,event]);
		},this);
	}

	// detect args callback
	function changeHashReg(fn,args){
		if(_isFn(fn))
			fn.apply(this,args);
		else
			// array or string
			_fal(typeof fn === "string" ? fn.split(",") : fn,
				function(reg){ this.actions[reg].apply(this,args); },this);
	}

	// define route for SPA
	aix.route = function(obj){
		var _this = this,
			history = { old: "", now: root.location.href },
			config = _extend(_clone(ROUTE_DEFAULT),obj||{}),
			events = config.events;

		delete config.events;
		// if userobj has more events
		_fol(events, this.uon, this);

		// addEvent for this route object
		// use dispatch event to trigger
		// cant change regular hash title
		_define(this, "event" ,{
			value : function(event){
				if(root.location.href === history.now)
					return event.preventDefault();
				// change the save hash url
				history.old = history.now; 
				return _this.emit("hashchange",
					[history.now = root.location.href,config.char,event]);
			},
			writable : false,
			enumerable : false,
			configurable: false
		});

		_extend(this,config);
		this.on("hashchange",changeHash);
		this.emit("init");
	};

	// Aix-Route for SPA Architecture
	// auto trigger regex event when route change
	aix.route.prototype = {
		on : function(type,fn){
			if(_isFn(fn)) _on(this,type,fn);
			return this;
		},

		uon : function(fn,type){
			return this.on(type,fn);
		},

		unbind : function(type,fn){
			return _unbind(this,type,fn);
		},

		emit : function(type,fn,args){
			return _emit(this,type,fn,args);
		},

		listen: function(hash){
			if(!this._listen){
				_define(this,"_listen",{
					value:true,
					writable : false,
					enumerable : false,
					configurable: true,
				});

				root.addEventListener("hashchange",this.event);
				return hash ? 
					this.go(hash) : 
					this.emit("hashchange",[root.location.href,this.char]);
			}
			return this;
		},

		stop: function(){
			if(delete this._listen)
				root.removeEventListener("hashchange",this.event);
			return this;
		},

		go : function(hash){
			if(this._listen){			
				var url = root.location.href; 
				var hashindex = url.search("#");
				if(hashindex > 0)
					url = url.slice(0,hashindex);

				root.location.href = url + (hash.toString().slice(0,1)==="#"?"":"#") + hash;
			}
			return this;
		}

	};

	// #genertor api
	_fal([
		"extend",
		"not",
		"cat",
		"find",
		"filter",
		"reject",
		"hook",
		"chunk",
		"compact",
		"pluck",
		"groupBy",
		"countBy",
		"pairs",
		"shuffle",
		"flat",
		"merge",
		"map",
		"unique"
	],function(api){
		aix.model.prototype[api]= genertor_(api);
	});

	_fal([
		"keys",
		"diff",
		"intsec",
		"first",
		"last",
		"auto",
		"eq",
		"values",
		"size",
		"each",
		"has",
		"type",
		"index"
	],function(api){
		aix.model.prototype[api]=genertor_$(api);
	});

	// Extend method
	// Create Aix Pack extends
	// Prepare for component
	aix.VERSION = struct.VERSION;

	aix.view.extend  = createExtend("view");
	aix.model.extend = createExtend("model");
	aix.route.extend = createExtend("route");

	Object.freeze(aix.model);
	Object.freeze(aix.view);
	Object.freeze(aix.route);

	return Object.freeze(v8(aix));
});
