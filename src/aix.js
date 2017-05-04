/* 
 * Aix
 *
 * @Author  : YiJun
 * @Date    : 2017.4.1 - now
 *
 * require Utils Lib [ struct ]
 */

(function(root,aix,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define('aix',['struct'],function(struct){ return factory(aix,struct); });
	else if(typeof exports === "object" && typeof module !== "undefined")
		// support CommonJS exports
		module.exports = factory(aix,struct);
	else
		// build on browser global object
		root.aix = factory(aix,struct);

})(this, {}, function(aix,struct){
	"use strict";

	// Define DOM frame
	var z,Z,aM,aV,aR,
	// Define Setting
		VIEW_DEFAULT  = { },
		MODEL_DEFAULT = { data:{}, validate:{} },
		ROUTE_DEFAULT = { char:"@", routes:{}, actions:{} },

	// resetful list 
	// use for aix ajax-api
	RESTFUL = {
		get    : "GET",
		put    : "POST",
		send   : "GET",
		sync   : "POST",
		post   : "POST",
		fetch  : "GET",
		update : "POST"
	},

	// *use struct utils list
		root      = struct.root,
		v8        = struct.v8(),
		_lock     = struct.lock(),
		_keys     = struct.keys(),
		_noop     = struct.noop(),
		_define   = struct.define(),
		_slice    = struct.slice(),
		_clone    = struct.clone(),
		_dpclone  = struct.depclone(),
		_extend   = struct.extend(),
		_dpextend = struct.depextend(),
		_eq       = struct.eq(),
		_toString = struct.convert('string'),
		_type     = struct.type(),
		_isObj    = struct.type('object'),
		_isFn     = struct.type('function'),
		_isInt    = struct.type('int'),
		_isAry    = struct.type('array'),
		_isAryL   = struct.type('arraylike'),
		_isPrim   = struct.type('primitive'),
		_loop     = struct.op(),
		_fol      = struct.op('object'),
		_fal      = struct.op('array'),
		_ey       = struct.every(),
		_on       = struct.event('on'),
		_unbind   = struct.event('unbind'),
		_emit     = struct.event('emit'),
		_prop     = struct.prop('get'),
		_setProp  = struct.prop('set'),
		_rmProp   = struct.prop('not'),
		_param    = struct.param(),
		_paramStr = struct.param("string"),
		_trim     = struct.string('trim'),
		_one      = struct.index('one'),
		_has      = struct.has(),
		_find     = struct.find(),
		_ajax     = struct.ajax(),
		_size     = struct.size(),
		_first    = struct.first(),
		_last     = struct.last(),
		_link     = struct.link(),
		_utob     = struct.assembly("u2b"),
		_btou     = struct.assembly("b2u"),
		_doom     = struct.doom();

	// aix genertor function
	function genertor_(api){
		aM.prototype[api] = function(){
			var tmp = this.data,
					args = [tmp].concat(_slice(arguments));
			if(!_eq(tmp = struct[api]().apply(tmp,args),this.data))
				this.emit((this.data = tmp,api),args);
			return this;
		};
	}

	// not change rebase data
	function genertor_$(api){
		aM.prototype[api] = function(){
			var args = [this.data].concat(_slice(arguments));
			return struct[api]().apply(this,args);
		};
	}

	function hackAix(origin,extend){
		var fnstr = _toString(origin),
			oargs = _toString(origin),
			eargs = _toString(extend),

		body = fnstr.slice(
					 fnstr.indexOf("{")+1, 
					 fnstr.lastIndexOf("}"));

		oargs = oargs.slice(oargs.indexOf('(')+1, oargs.indexOf(')'))
								 .match(/([^\s,]+)/g)[0];
		eargs = eargs.slice(eargs.indexOf('(')+1, eargs.indexOf(')'))
								 .match(/([^\s,]+)/g)[0];
  	
  	return [_toString(oargs),_toString(eargs),body];
	}

	function createExtend(origin){
		return function(def){
			var x = hackAix(aix[origin],aix[origin].extend);
			var extend = eval("(function(ops){ "+
				"var "+x[0]+"=_dpextend("+x[1]+",ops||{}); "+x[2]+
			"})");

			_extend(extend.prototype,aix[origin].prototype);
			return extend;
		};
	}

	// get childNodes and filter by selector
	// cant use Global matcher
	var isId    = /^#[^\s\=\+\.\#\[\]]+/i,												// "#idname"
			isClass = /^\.[^\s\=\+\.\#\[\]]+$/i,											// ".className"
			isTag   = /^[^\[\]\+\-\.#\s\=]+$/i,												// "p" "div" "DIV"
			isAttr  = /([^\s]+)?\[([^\s]+)=["']?([^\s'"]+)["']?\]$/i,		// div[id="nami"]
			mreSl   = /^[^\s]+,[^\s]+/gi,
			cidSl   = /[\s|\r]+/im,
			pitSl   = /[>|\+|\~]+/im,
			isHTML  = /<[a-zA-Z][\s\S]*>/;

	// Performance JavaScript selector
	// Just Optimzer this function for sl pref
	// @ much more need its better
	Z = function(elm){
		this.el = _isAryL(elm) ? 
							_slice(elm) : 
							(elm instanceof Element ? [elm] : []);
	};

	z = function(x){
		return z.init.call(root,x);
	};

	var _zid = 1,
		handlers = {},
		focusinSupported = 'onfocusin' in window,
		focus = { focus: 'focusin', blur: 'focusout' },
		hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' },
		change = { change: 'input', input: 'input' };
	
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

	function capCursor(elm){
	  var pos = 0;
  	if (elm.selectionStart != null)
    	pos = elm.selectionStart;
  	// IE Support
  	else if (document.selection) {
    	elm.focus();

    	var sel = document.selection.createRange();
    	sel.moveStart('character', -elm.value.length);
    	// The caret position is selection length
    	pos = sel.text.length;
  	}
  	return pos;
	}

	function setCursor(elm,pos){
    if(elm.createTextRange) {
      var range = elm.createTextRange();
      range.move('character', pos);
      range.select();
    } else {
      if(elm.selectionStart)
        elm.setSelectionRange(pos, pos, elm.focus());
      else
        elm.focus();
    }
	}

	function realEvent(type) {
		return hover[type] || 
					 change[type] || 
					 (focusinSupported && focus[type]) || 
					 type;
	}

	function zaddEvent(element, events, fn, data, selector, delegator, capture){
		var id = zid(element), 
			set = (handlers[id] || (handlers[id] = []));
	
		_loop(events.split(/\s/),function(event){
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
				var pos,
					type = e.type,
					tname = e.target.nodeName, 
					editable = e.target.contentEditable === "true";
				e = compatible(e);
	
				if (e.isImmediatePropagationStopped()) 
					return false;
	
				e.data = data;
				if((type==="input" || type==="keypress" || type==="keyup")&&
					 (tname === "INPUT" || tname === "TEXTAREA" || editable ))
					pos = capCursor(e.target);
				var result = callback.apply(element, 
					e._args === undefined ? [e] : [e].concat(e._args));

				if(result === false)
					e.preventDefault(), e.stopPropagation();
				if(pos)
					setCursor(e.target,pos);
				return result;
			};
	
			handler.i = set.length;
			set.push(handler);
	
			element.addEventListener(
				realEvent(handler.e), 
				handler.proxy, 
				eventCapture(handler, capture)
			);
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
			source || (source = event);
	
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

	z.init = function(x){
		return new Z(x);
	};

	z.matchz = function(elm,selector){
		return !(elm===null||elm===document||typeof selector !== "string") && matchzx.call(elm, selector);
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
			if (args)
				return z.proxy.apply(null,(args.unshift(fn[context],fn),args));
			else
				return z.proxy(fn[context], fn);
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
				(name === 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
	
		event.initEvent(type, bubbles, true);
		return compatible(event);
	};

	function SubsetMapping(a, b) {
		this.oldValue = a;
		this.newValue = b;
	}

	/**
	 * This should really be a predefined function in Array...
	 */
	function makeArray(n, v) {
		return Array.apply(null, new Array(n)).map(function() {
			return v;
		});
	}

	var diffcount,
		diffconst = {
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

	var Diff = function(options) {
		_extend(this,options||{});
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

	SubsetMapping.prototype = {
		contains: function contains(subset) {
			if (subset.length < this.length)
				return subset.newValue >= this.newValue && 
							 subset.newValue < this.newValue + this.length;
			return false;
		},
		toString: function toString() {
			return this.length + 
						" element subset, first mapping: old " + 
						this.oldValue + " → new " + this.newValue;
		}
	};

	var elementDescriptors = function(el) {
		var output = [];
		if(el.nodeName !== '#text' && el.nodeName !== '#comment'){
			output.push(el.nodeName);
			if (el.attributes) {
				if(el.attributes['class'])
					output.push(el.nodeName + '.' + el.attributes['class'].replace(/ /g, '.'));
				if(el.attributes.id)
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
				if (!inUnique && !inDupes)
					uniqueDescriptors[descriptor] = true;
				else if (inUnique)
					duplicateDescriptors[descriptor] = (delete uniqueDescriptors[descriptor]);
			});
		});
		return uniqueDescriptors;
	};

	var uniqueInBoth = function(l1, l2) {
		var l1Unique = findUniqueDescriptors(l1),
			l2Unique = findUniqueDescriptors(l2),
			inBoth = {};

		_fal(_keys(l1Unique),function(key) {
			if(l2Unique[key])
				inBoth[key] = true;
		});

		return inBoth;
	};

	var removeDone = function(tree) {
		delete tree.outerDone;
		delete tree.innerDone;
		delete tree.valueDone;
		if (tree.childNodes)
			return _ey(tree.childNodes,removeDone);
		return true;
	};

	var isEqual = function(e1, e2) {
		if (!_ey(['nodeName', 'value', 'checked', 'selected', 'data'],function(element){
			return e1[element] === e2[element];
		}))
			return false;

		if (Boolean(e1.attributes) !== Boolean(e2.attributes) ||
				Boolean(e1.childNodes) !== Boolean(e2.childNodes))
			return false;

		if (e1.attributes) {
			var e1Attributes, e2Attributes;
			e1Attributes = _keys(e1.attributes);
			e2Attributes = _keys(e2.attributes);

			if (e1Attributes.length !== e2Attributes.length)
				return false;
			if (!_ey(e1Attributes,function(attribute){
				return e1.attributes[attribute] === e2.attributes[attribute];
			})) return false;
		}

		if (e1.childNodes) {
			if (e1.childNodes.length !== e2.childNodes.length)
				return false;
			if (!_ey(e1.childNodes,function(childNode, index){
				return isEqual(childNode, e2.childNodes[index]);
			})) return false;
		}

		return true;
	};

	var roughlyEqual = function(e1, e2, uniqueDescriptors, sameSiblings, preventRecursion) {
		var childUniqueDescriptors, nodeList1, nodeList2;

		if ((!e1 || !e2)||(e1.nodeName !== e2.nodeName))
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
				if (idDescriptor in uniqueDescriptors)
					return true;
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
			return _ey(nodeList1,function(element, index) {
				return element.nodeName === nodeList2[index].nodeName;
			});
		} else {
			// note: we only allow one level of recursion at any depth. If 'preventRecursion'
			// was not set, we must explicitly force it to true for child iterations.
			childUniqueDescriptors = uniqueInBoth(nodeList1, nodeList2);
			return _ey(nodeList1,function(element, index) {
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
				if (c1Desc.length !== c2Desc.length)
					return !(subsetsSame = false);
				c1Desc.some(function(description, i){
					if (description !== c2Desc[i])
						return !(subsetsSame = false);
				});
				return !subsetsSame;
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
		if (lcsSize === 0)
			return false;
		origin = [index[0] - lcsSize, index[1] - lcsSize];
		ret = new SubsetMapping(origin[0], origin[1]);
		ret.length = lcsSize;

		return ret;
	};

	var getGapInformation = function(t1, t2, stable) {

		var gaps1 = t1.childNodes ? makeArray(t1.childNodes.length, true) : [],
			gaps2 = t2.childNodes ? makeArray(t2.childNodes.length, true) : [],
			group = 0;

		// give elements from the same subset the same group number
		_fal(stable,function(subset) {
			var i, endOld = subset.oldValue + subset.length,
				endNew = subset.newValue + subset.length;
			for (i=subset.oldValue; i < endOld; i++)
				gaps1[i] = group;
			for (i=subset.newValue; i < endNew; i++)
				gaps2[i] = group;
			group++;
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
			returnIndex = function(x,index) { return index; },
			markBoth = function(i) {
				marked1[subset.oldValue + i] = true;
				marked2[subset.newValue + i] = true;
			};

		while (subset) {
			subset = findCommonSubsets(oldChildren, newChildren, marked1, marked2);
			if (subset)
				_fal((subsets.push(subset),
					Array.apply(null, new Array(subset.length)).map(returnIndex)),
					markBoth);
		}
		return subsets;
	};

	var DiffTracker = function() {
		this.list = [];
	};

	DiffTracker.prototype = {
		list: false,
		add: function(diffs) {
			return _fal(diffs,function(diff) {
				this.push(diff);
			},this.list);
		},
		forEach: function(fn) {
			_fal(this.list,fn);
		}
	};

	// dom diff options
	var diffDOM = function(options) {
		var defaults = {
			debug: false,
			diffcap: 10, // Limit for how many diffs are accepting when debugging. Inactive when debug is false.
			maxDepth: false, // False or a numeral. If set to a numeral, limits the level of depth that the the diff mechanism looks for differences. If false, goes through the entire tree.
			valueDiffing: true, // Whether to take into consideration the values of forms that differ from auto assigned values (when a user fills out a form).
			// syntax: textDiff: function (node, currentValue, expectedValue, newValue)
			textDiff: function() {
				arguments[0].data = arguments[3];
			},
			// empty functions were benchmarked as running faster than both
			// `f && f()` and `if (f) { f(); }`
			preVirtualDiffApply: function() {},
			postVirtualDiffApply: function() {},
			preDiffApply: function() {},
			postDiffApply: function() {},
			filterOuterDiff: null
		};
		_extend(this,_extend(defaults,options||{}));

		this._const = Object.freeze(_clone(diffconst));
	};

	diffDOM.Diff = Diff;

	diffDOM.prototype = {

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
				diffs = this.findNextDiff(t1, t2, []);
				// Last check if the elements really are the same now.
				// If not, remove all info about being done and start over.
				// Somtimes a node can be marked as done, but the creation of subsequent diffs means that it has to be changed anyway.
				if (diffs.length === 0)
					if (!isEqual(t1, t2))
						diffs = (removeDone(t1),this.findNextDiff(t1, t2, []));

				if (diffs.length>0)
					this.applyVirtual(t1,this.tracker.add(diffs));
			} while (diffs.length > 0);
			return this.tracker.list;
		},

		findNextDiff: function(t1, t2, route) {
			var diffs, fdiffs;

			if (this.maxDepth && route.length > this.maxDepth)
				return [];
			// outer differences?
			if (!t1.outerDone) {
				diffs = this.findOuterDiff(t1, t2, route);
				if (this.filterOuterDiff) {
					fdiffs = this.filterOuterDiff(t1, t2, diffs);
					if (fdiffs) diffs = fdiffs;
				}
				if (diffs.length > 0)
					return t1.outerDone = true,diffs;
				else
					t1.outerDone = true;
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
				if (diffs.length > 0)
					return t1.valueDone = true,diffs;
				else
					t1.valueDone = true;
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
					.setValue(t._const.oldValue, t1)
					.setValue(t._const.newValue, t2)
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
			var objNode = {}; objNode.nodeName = aNode.nodeName;
			if (objNode.nodeName === '#text' || 
					objNode.nodeName === '#comment') {
				objNode.data = aNode.data;
			} else {
				if (aNode.attributes && aNode.attributes.length > 0) {
					objNode.attributes = {};
					_fal(Array.prototype.slice.call(aNode.attributes),
						function(attribute) {
							objNode.attributes[attribute.name] = attribute.value;
						}
					);
				}
				if (aNode.childNodes && aNode.childNodes.length > 0) {
					objNode.childNodes = [];
					_fal(Array.prototype.slice.call(aNode.childNodes),function(childNode) {
							objNode.childNodes.push(this.nodeToObj(childNode));
					},this);
				}
				if (this.valueDiffing) {
					if (aNode.value !== void 0)
						objNode.value = aNode.value;
					if (aNode.checked !== void 0)
						objNode.checked = aNode.checked;
					if (aNode.selected !== void 0)
						objNode.selected = aNode.selected;
				}
			}

			return objNode;
		},

		objToNode: function(objNode, insideSvg) {
			var node;
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
						node.appendChild(this.objToNode(childNode, insideSvg));
					},this);
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

			/* One or more groups have been identified among the childnodes of t1
			 * and t2.
			 */
			if (subtrees.length > 0) {
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
								.setValue(t._const.element, e1)
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
								.setValue(t._const.element, e2)
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

				if (e1 && e2)
					diffs = diffs.concat(this.findNextDiff(e1, e2, route.concat(index)));

				index++;
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
							.setValue(t._const.element, node)
						);
						gaps1.splice(index2, 1);
						shortest = Math.min(gaps1.length, gaps2.length);
						index2--;
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
						index1--;
					} else {
						diffs.push(new Diff()
							.setValue(t._const.action, t._const.addElement)
							.setValue(t._const.route, route.concat(index2))
							.setValue(t._const.element, node)
						);
						gaps1.splice(index2, 0, true);
						shortest = Math.min(gaps1.length, gaps2.length);
						index1--;
					}

				} else if (gaps1[index2] !== gaps2[index2]) {
					if (diffs.length > 0)
						return diffs;
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
			_fal(diffs,function(diff) {
				this.applyVirtualDiff(tree, diff);
			},this);
			return true;
		},

		getFromVirtualRoute: function(tree, route) {
			var node = tree,
				parentNode, nodeIndex;

			route = route.slice();
			while (route.length > 0) {
				if (!node.childNodes)
					return false;
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
					if (node.nodeName === 'INPUT' && diff[this._const.name] === 'value')
						node.value = diff[this._const.value];
					break;
				case this._const.removeAttribute:
					delete node.attributes[diff[this._const.name]];

					if (_keys(node.attributes).length === 0)
						delete node.attributes;

					if (diff[this._const.name] === 'checked')
						node.checked = false;
					else if (diff[this._const.name] === 'selected')
						delete node.selected;
					else if (node.nodeName === 'INPUT' && diff[this._const.name] === 'value')
						delete node.value;
					break;
				case this._const.modifyTextElement:
					node.data = diff[this._const.newValue];

					if (parentNode.nodeName === 'TEXTAREA')
						parentNode.value = diff[this._const.newValue];
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
					newNode = diff[this._const.newValue];
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
					newNode = diff[this._const.element];
					newNode.outerDone = true;
					newNode.innerDone = true;
					newNode.valueDone = true;

					if (!node.childNodes)
						node.childNodes = [];

					if (c >= node.childNodes.length)
						node.childNodes.push(newNode);
					else
						node.childNodes.splice(c, 0, newNode);
					break;
				case this._const.removeTextElement:
					parentNode.childNodes.splice(nodeIndex, 1);
					if (parentNode.nodeName === 'TEXTAREA')
						delete parentNode.value;
					break;
				case this._const.addTextElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					newNode = {};
					newNode.nodeName = '#text';
					newNode.data = diff[this._const.value];
					node = this.getFromVirtualRoute(tree, route).node;
					if (!node.childNodes)
						node.childNodes = [];

					if (c >= node.childNodes.length)
						node.childNodes.push(newNode);
					else
						node.childNodes.splice(c, 0, newNode);

					if (node.nodeName === 'TEXTAREA')
						node.value = diff[this._const.newValue];
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
			_fal(diffs,function(diff){
				this.applyDiff(tree, diff)
			},this);
			return true;
		},

		getFromRoute: function(tree, route) {
			route = route.slice();
			var node = tree;
			while (route.length > 0) {
				if (!node.childNodes)
					return false;
				node = node.childNodes[route.splice(0, 1)[0]];
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

			if (this.preDiffApply(info))
				return true;

			switch (diff[this._const.action]) {
				case this._const.addAttribute:
					if (!node || !node.setAttribute)
						return false;
					node.setAttribute(diff[this._const.name], diff[this._const.value]);
					break;
				case this._const.modifyAttribute:
					if (!node || !node.setAttribute)
						return false;
					node.setAttribute(diff[this._const.name], diff[this._const.newValue]);
					break;
				case this._const.removeAttribute:
					if (!node || !node.removeAttribute)
						return false;
					node.removeAttribute(diff[this._const.name]);
					break;
				case this._const.modifyTextElement:
					if (!node || node.nodeType !== 3)
						return false;
					this.textDiff(node, node.data, diff[this._const.oldValue], diff[this._const.newValue]);
					break;
				case this._const.modifyValue:
					if (!node || node.value === void 0)
						return false;
					node.value = diff[this._const.newValue];
					break;
				case this._const.modifyComment:
					if (!node || node.data === void 0)
						return false;
					this.textDiff(node, node.data, diff[this._const.oldValue], diff[this._const.newValue]);
					break;
				case this._const.modifyChecked:
					if (!node || node.checked === void 0)
						return false;
					node.checked = diff[this._const.newValue];
					break;
				case this._const.modifySelected:
					if (!node || node.selected === void 0)
						return false;
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
					if (!node || node.nodeType !== 3)
						return false;
					node.parentNode.removeChild(node);
					break;
				case this._const.addTextElement:
					route = diff[this._const.route].slice();
					c = route.splice(route.length - 1, 1)[0];
					newNode = document.createTextNode(diff[this._const.value]);
					node = this.getFromRoute(tree, route);
					if (!node || !node.childNodes)
						return false;
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
		}
	};

	var _DIFF = new diffDOM({
		diffcap: 998
	});
	// end off domdiff

	var supportTemplate = "content" in document.createElement("template");
	function createDOM(rootElm,html){
		var r = rootElm.cloneNode(),t;
		if(supportTemplate)
			r.appendChild((
				t=document.createElement("template"),
				t.innerHTML=html,
				t.content)
			);
		else
			r.innerHTML = html;
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
				this.el[( +index + ( index < 0 ? this.length : 0 ) )] : 
				this.el;
		},

		each : function(fn,context){
			return _fal(this.el,fn,context||this),this;
		},

		find : function(sl){
			var res = []; 
			_fal(this.el,function(e){
				res = _slice(e.querySelectorAll(sl)).concat(res);
			});
			return z(res);
		},

		closest : function(selector,element){
			var el = this.el ,tmp=this.get(0) ,find;

			for(var i=0,l=el.length;i<l;i++,tmp=el[i]){
				while(tmp&&!find&&tmp!==element)
					if(z.matchz((tmp=tmp.parentNode),selector)) 
						find = tmp;
				if(find) break;
			}

			return z(find||[]);
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
						var evt, match = !z.matchz(e.target,selector) ? 
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
	
		html : function(html){
			return this.each(function(elm){
				elm.innerHTML = html;
			});
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
		var res = [],s=_size(validate);
		if(!s) return res;
		if(!_eq(olddata,newdata)){
			var key = _keys(validate);
			for(var i=0,isRequired,value; i<s; i++){
				// get validate funtion
				isRequired = validate[key[i]];
				value=_prop(newdata,key[i]);
				if(!isRequired(value)){
					res.push(key[i],value);
					break;
				}
			}
		}
		return res;
	}

	function on(type,fn){
		if(_isFn(fn)) _on(this,type,fn);
		return this;
	}

	function uon(fn,type){
		return this.on(type,fn);
	}

	function unbind(type,fn){
		return _unbind(this,type,fn);
	}

	function emit(type,args){
		return _emit(this,type,args||[]);
	}

	function moc(target,val){
		if(_isAry(target))
			target = target.concat(val);
		else if(_isObj(target))
			target = _extend(_clone(target),_isObj(val) ? val : {});
		else if(typeof target === "string" || +val === val)
			target += val;
		return target;
	}

	function setStore(url,data){
		localStorage.setItem(
			"Ax@"+_utob(url),
			_utob(JSON.stringify(data)+"\r")
		);
	}

	function getStore(url){
		if(toString(url)){
			var str = _btou(localStorage.getItem("Ax@"+_utob(url)));
			return _size(str) > 1 ? JSON.parse(str) : "";
		}
	}

	function pipe(type,url,param,fns,fnf,header){
		//param must be object typeof
		var st = {
			type  : RESTFUL[_toString(type).toLowerCase()]||"GET",
			aysnc : true
		}, _fns, _fnf, isFn= _isFn(param);

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
		st.success = function(responseText,xhr,event){
			// change the data before dispatch event;
			_fns.call(this,responseText,xhr,event);
			this.emit(type+":success",[responseText,xhr,event]);
		}.bind(this);
		st.fail = function(xhr,event){
			_fnf.call(this,xhr,event);
			this.emit(type+":fail",[xhr,event]);
		}.bind(this);

		// trigger ajax events
		return this.emit(type,[_ajax(st),st]);
	}

	// Aix Model
	aix.model = aM = function(obj){
		var config = _extend(_clone(MODEL_DEFAULT),obj||{}),
			events = config.events,
			validate = config.validate,
			store = (config.store === true && toString(config.url)),
			data = store ? (getStore(config.url)||config.data) : config.data; 

		delete config.data;
		delete config.store;
		delete config.change;
		delete config.events;
		delete config.validate;

		// define data
		_define(this,"data",{
			get : function(){
				return _clone(data);
			},
			set : function(newdata){
				if(_eq(data,newdata)) return data;

				var args = [_clone(newdata)], error;
				if((this.emit("validate",args),
					_isPrim(newdata) ?
					(_isFn(validate) ? validate(newdata) : true) :
					(error=checkValidate(data,newdata,validate),!_size(error))))
					return data=newdata,
						this.change=true,
						(store && setStore(this.url,newdata)),
						this.emit("validate:success,change",args),
						newdata;

				this.emit("validate:fail",args.concat(error));
				if(_isAry(error)&&_size(error)===2)
					this.emit("validate:fail:"+_first(error),[_last(error)]);
				return data;
			},
			enumerable:true,
			configurable:false
		});

		// if userobj has more events
		_fol(events,uon,this);

		// init event
		_extend(this,config)
			.emit("init",[this.data])
			.unbind("init");
	};

	// Extend aix model method 
	// Model Prototype extend
	// model data usually define as pure data, not javascript event or function
	// because it much as MVC-M logs 
	aM.prototype = {
		get : function(key){
			if(key != null && key !== "")
				return _prop.apply(this,
					[this.data].concat(_slice(arguments)));
			return key === true ? _dpclone(this.data) : this.data;
		},

		set : function(){
			var param;
			this.data = arguments.length > 1 ?
				(param = arguments[0],
				_setProp(this.data,param,arguments[1])) : 
				arguments[0];
			return param ? this.emit(
				"change:"+param.split(".").shift() + "," +
				"change:"+param,[arguments[1]]
			) : this;
		},

		rm : function(prop){
			var tmp = null;
			if(prop){
				tmp = this.data;
				this.data = _isAry(tmp) ? 
					(tmp.splice(+prop,1),tmp) : 
					_rmProp(tmp,prop);
			}else{
				this.data = tmp;
			}

			return prop ? this.emit(
				"change:"+prop.split(".").shift() + "," +
				"change:"+prop
			) : this;
		},

		moc: function(key,val){
			return this.set(key,
				moc(_prop(this.data,key),val)
			);
		},

		// API event
		on : on,
		emit : emit,
		unbind : unbind,

		// Aix Restful API design for
		// [Aix Model] data format serialize
		toJSON : function(){
			return _isPrim(this.data) ? 
				this.data : 
				JSON.stringify(this.data);
		},

		// Fetch mean Restful "GET"
		// fetch data form url with param
		send: function(url,header){
			if(_isObj(url)){
				header = url;
				url = null;
			}

			return pipe.apply(this,[
				"send",
				url || this.url,
				this.data,
				_noop,
				_noop,
				header
			]);
		},

		fetch: function(param,byfilter,header){
			if(_isFn(param)){
				header = byfilter;
				byfilter = param;
				param = {};
			}

			return pipe.apply(this,[
				"fetch",
				this.url,
				param,
				_link(
					(_isFn(byfilter) ? byfilter : JSON.parse),
					this.set.bind(this)),
				_noop,
				header
			]);
		},

		sync: function(url,header){
			if(_isObj(url)){
				header = url;
				url = null;
			}

		  return pipe.apply(this,[
		  	"sync",
		  	url || this.url,
		  	this.data,
		  	_noop,
		  	_noop,
		  	header
			]);
		},

		toString: function(){
			return this.data;
		}
	};

	function packRender(view,render,pack){
		pack = _link(
			packBefore(view),
			packMain(view,render),
			packComplete(view)
		);
		return function(){
			return pack(arguments);
		};
	}

	function packBefore(view){
		return function(args){
			return view.emit("beforeRender",args),args;
		};
	}

	function packMain(view,renderFunc){
		return function(args){
			return renderFunc.apply(view,args),args;
		};
	}

	function packComplete(view){
		return function(args){
			return view.emit("completed",args),view;
		};
	}

	function setRender(view,render){
		var that = packRender(view,render);
		_define(view,"render",{
			get : function(){
				return that;
			},
			set : function(fn){
				if(_isFn(fn))
					that = packRender(view,fn);
				return that;
			},
			enumerable:true,
			configurable:false
		});
		return view;
	}

	function checkElm(el){
		if(!(el instanceof Element || _isAryL(el)))
				throw new TypeError("el must be typeof DOMElement or NodeList collections -> not " + el);
		return true;
	}

	// bind selector
	aix.view = aV = function(obj){
		var config = _extend(_clone(VIEW_DEFAULT),obj||{}),
			vroot = config.root,
			render = config.render,
			events = config.events,
			stencil = config.template,
			props = config.props;

		delete config.root;
		delete config.mount;
		delete config.props;
		delete config.events;
		delete config.render;
		delete config.template;

		// parse template
		// building the render function
		if(!_isFn(render)){
			stencil = (typeof stencil === "string") ? 
				_doom(stencil, _isObj(props) ? props : {}) : 
				(_isFn(stencil) ? stencil : _noop);

			render = function(){ 
				var t = z(vroot), args = _slice(arguments);
				return (stencil !== _noop && (
						(_trim(t.get(0).innerHTML) === "" ? 
							t.html(stencil.apply(this,args)) : 
							t.render(stencil.apply(this,args))
						))
				);
			};
		}

		// if userobj has more events
		if(vroot&&checkElm(vroot)){
			// bind events
			this.root = vroot;
			_fol(events,uon,setRender(this,render));
		}else{
			this.mount = function(el){
				if(checkElm(el)){
					// bind events
					this.root = vroot = el; 
					_fol(events,uon,setRender(this,render));

					// trigger render 
					if(1 in arguments)
						this.render.apply(this,_slice(arguments,1));
					// delete mount
					return delete this.mount, this;
				}
			};
		}

		// first trigger "init" event
		_extend(this,config)
			.emit("init")
			.unbind("init");
	};

	aV.prototype = {
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

		emit : function(type,args){
			var k = (type||"").split(":");

			if(k.length>2){
				return _fal((type||"").split(","),function(mk){
					var mkf = mk.split(":");
					z(this.root).find(mkf[1]).trigger(mkf[0],args);
				},this),this;
			}

			if(k.length>1)
				return z(this.root).find(k[1]).trigger(k[0],args),this;

			return _emit(this,type,args);
		},

		toString : function(){
			return this.root;
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

	//if hashChange call
	function hashChange(url,char,event){
		var hash = hashGet(url,char), param = hashParam(url,char); 
		_fol(this.routes,function(fn,key){
			if((new RegExp(key,"i")).test(hash))
				hashChangeReg.call(this,fn,[param,hash,event]);
		},this);
	}

	// detect args callback
	function hashChangeReg(fn,args){
		if(_isFn(fn))
			fn.apply(this,args);
		else
			// array or string
			_fal(typeof fn === "string" ? fn.split(",") : fn,
				function(reg){ this.actions[reg].apply(this,args); },this);
	}

	// define route for SPA
	aix.route = aR = function(obj){
		var _this = this,
			history = { old: "", now: root.location.href },
			config = _extend(_clone(ROUTE_DEFAULT),obj||{}),
			events = config.events;

		delete config.history;
		delete config.events;
		// if userobj has more events
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

		_fol(events,uon,this);

		_extend(this,config)
			.on("hashchange",hashChange)
			.emit("init")
			.unbind("init");
	};

	// Aix-Route for SPA Architecture
	// auto trigger regex event when route change
	aR.prototype = {
		on : on,
		emit : emit,
		unbind : unbind,

		listen: function(hash,param){
			if(!this._listen){
				_define(this,"_listen",{
					value:!root.addEventListener("hashchange",this.event),
					writable : false,
					enumerable : false,
					configurable: true,
				});
				
				return hash ? 
					this.assign(hash,param) : 
					this.emit("hashchange",[root.location.href,this.char]);
			}
			return this;
		},

		stop: function(){
			if(delete this._listen)
				root.removeEventListener("hashchange",this.event);
			return this;
		},

		assign : function(hash,param){
			if(this._listen){
				var url = root.location.href; 
				var hashindex = url.search("#");
				if(hashindex > 0)
					url = url.slice(0,hashindex);

				root.location.href = url + 
					(hash.toString().slice(0,1)==="#"?"":"#") + hash + 
					(_isObj(param) ? ((this.char||"@")+_paramStr(param)) : "");
			}
			return this;
		},

		toString : function(){
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
		"sort",
		"unique",
		"concat"
	],genertor_);

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
	],genertor_$);

	// Extend method
	// Create Aix Pack extends
	// Prepare for component
	aix.VERSION = struct.VERSION;

	aV.extend = createExtend("view");
	aM.extend = createExtend("model");
	aR.extend = createExtend("route");

	_lock(aM,aV,aR,v8(aix));

	return aix;
});
