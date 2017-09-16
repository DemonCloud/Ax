/*
 * Ax
 *
 * @Author : YiJun
 * @Date   : 2017.4.1 - now
 *
 * require Utils Lib [ struct ]
 */

(function(root,ax,factory){

	if(typeof define === 'function' && define.amd)
		// support AMD require.js
		// ruler by UMD Javascript
		define('ax',['struct'],function(_){ return factory(ax,_); });
	else if(typeof exports !== "undefined")
		// support CommonJS exports
		// * fuck the npm package rubbish, where package name use [ struct ]
		// should defined webpack alias with [ "struct" : "ax-struct-js" ]
		factory(exports,require('struct'));
	else
		// build on browser global object
		root.ax = factory(ax,root.struct);

})(this, {}, function(ax,struct){
	"use strict";

	var aM,aV,aT,aS,vA,z,Z,
			aMP,aVP,aTP, _ = [], maker = {}, root = struct.root,
			RAM = [], LS = root.localStorage, SN = "Ax@",
			FCD = String.fromCharCode, vid = 0,
	
	// Define Setting
	AXMODULE_INJECT = [ax,struct],

	ATOM_KEYWORDS   = ["use","events","_assert"],
	VIEW_KEYWORDS   = ["root","mount","props","events","render","template","destroy","cache"],
	MODEL_KEYWORDS  = ["name","data","store","change","events","validate","filter"],

	VIEW_DEFAULT    = { },
	ATOM_DEFAULT    = { use:[] },
	MODEL_DEFAULT   = { data:{}, validate:{} },

	// resetful list
	// use for ax ajax-api
	RESTFUL = {
		get    : "GET",
		send   : "GET",
		sync   : "POST",
		fetch  : "GET"
	},

	// *use struct utils list
	// *minix with struct API
	v8        = struct.v8(),
	_ayc      = struct.ayc(),
	_lock     = struct.lock(),
	_keys     = struct.keys(),
	_noop     = struct.noop(),
	_define   = struct.define(),
	_slice    = struct.slice(),
	_clone    = struct.clone(),
	_extend   = struct.extend(),
	_eq       = struct.eq(),
	_toString = struct.convert('string'),
	_type     = struct.type(),
	_isObj    = struct.type('object'),
	_isFn     = struct.type('function'),
	_isNum    = struct.type('num'),
	_isBool   = struct.type("bool"),
	_isStr    = struct.type("str"),
	_isInt    = struct.type('int'),
	_isAry    = struct.type('array'),
	_isAryL   = struct.type('arraylike'),
	_isPrim   = struct.type('primitive'),
	_isFloat  = struct.type('float'),
	_isDOM    = struct.type('dom'),
	_isElm    = struct.type('elm'),
	_isNode   = struct.type('node'),
	_isNeed   = struct.type('required'),
	_loop     = struct.op(),
	_fol      = struct.op('object'),
	_fal      = struct.op('array'),
	_map      = struct.map(),
	_on       = struct.event('on'),
	_unbind   = struct.event('unbind'),
	_emit     = struct.event('emit'),
	_get      = struct.prop('get'),
	_set      = struct.prop('set'),
	_rm       = struct.prop('not'),
	_has      = struct.has(),
	_ajax     = struct.ajax(),
	_size     = struct.size(),
	_link     = struct.link(),
	_doom     = struct.doom(),
	_axt      = struct.doom("axt"),
	_merge    = struct.merge(),
	_index    = struct.index(),
	_one      = struct.index("one"),
	_decode   = struct.html("decode"),
	cool      = struct.cool();

	// ax genertor function
	function genertor_(api){
		var apiName, apiUse, apiSelect, Use;
		if(_isAry(api)){
			apiUse = api[1];
			apiName = api[0];
			apiSelect = api[2]; }
		else{
			apiUse = api;
			apiName = api;
			apiSelect = void 0; }

		Use = struct[apiUse](apiSelect);

		aM.prototype[apiName] = function(){
			var tmp = this.get(),
					args = [tmp].concat(_slice(arguments));
			if(!_eq(tmp = Use.apply(tmp,args),this.get()))
				this.emit((this.set(tmp),api),args);
			return this;
		};

		aT.prototype[apiName] = function(){
			return Use.apply(this,
				[this.toChunk()].concat(_slice(arguments)));
		};
	}

	// not change rebase data
	function genertor_$(api){
		var apiName, apiUse, apiSelect, Use;
		if(_isAry(api)){
			apiUse = api[1];
			apiName = api[0];
			apiSelect = api[2]; }
		else{
			apiUse = api;
			apiName = api;
			apiSelect = void 0; }

		Use = struct[apiUse](apiSelect);

		aM.prototype[apiName] = function(){
			var args = [this.get()].concat(_slice(arguments));
			return Use.apply(this,args);
		};

		aT.prototype[apiName] = function(){
			return Use.apply(this,
			[this.toChunk()].concat(_slice(arguments)));
		};
	}

	function createAx(Use){
		return function(o){
			return new Use(_isObj(o) ? o : {});
		};
	}

	function createExtend(Use){
		return function(malloc){
			return function(o){
				return new Use(_merge(malloc,_isObj(o) ? o : {}));
			};
		};
	}

	// Performance JavaScript selector
	// Just Optimzer this function for sl pref
	// @ much more need its better
	Z = function(elm){
		this.el = _isAryL(elm) ? _slice(elm) : (_isElm(elm) ? [elm] : []);
	};

	z = function(x){ return z.init.call(root,x); };

	var _zid = 1,
		handlers = {},
		focusinSupported = 'onfocusin' in struct.root,
		focus = { focus: 'focusin', blur: 'focusout' },
		hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' },
		check = { check: 'change' },
		change = { change: 'input', input: 'input' },
		ininput = ["input","keypress","keydown","keyup"],
		isFF = struct.root.navigator.userAgent.indexOf("Firefox")>-1;

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

		if (event.ns) var matcher = matcherFor(event.ns);

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
		return { e: parts[0], ns : parts.slice(1).sort().join(' ') };
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
			return range.select();
		}

		return elm.selectionStart ?
			elm.setSelectionRange(pos, pos, elm.focus()) :
			elm.focus();
	}

	function realEvent(type) {
		return hover[type] ||
					change[type] ||
					check[type] ||
					(focusinSupported && focus[type]) ||
					type;
	}

	// I Just want to fuck zepto, because the rubbish lib give not work for new browser
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
					if (!related || (related !== this && !this.contains(related)))
						return handler.fn.apply(this, arguments);
				};

			handler.del = delegator;
			var callback  = delegator || fn;

			handler.proxy = function(e){
				var pos,
						type = e.type,
						tname = e.target.nodeName,
						editable = e.target.contentEditable === "true",
						isinput = _has(ininput,type) && (tname === "INPUT" || tname === "TEXTAREA" || editable );

				var fe = new z.xEvent(e=compatible(e));

				if (e.isImmediatePropagationStopped() || (isinput && e.target._compositionIn))
					return false;

				// # Chrome event handler assign Error with CompositionEvent
				fe.data = data;

				if(isinput)
					pos = capCursor(e.target);

				var result = callback.apply(element,
					fe._args === void 0 ? [fe] : [fe].concat(fe._args));

				if(result === false){
					e.preventDefault();
					e.stopPropagation();
				}

				if(pos)
					setCursor(e.target,pos);

				return result;
			};

			handler.i = set.length;
			set.push(handler);

			var tEvent = realEvent(handler.e);

			if(tEvent in change){
				element.addEventListener("compositionstart",function(e){
					e.target._compositionIn = true;
				});
				element.addEventListener("compositionend",function(e){
					e.target._compositionIn = false;
					if(!isFF) z(e.target).trigger("input");
				});
			}

			element.addEventListener(
				tEvent,
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

			try { event.timeStamp || (event.timeStamp = Date.now()); }
			catch(ignored){ /*ignore*/ }

			if (source.defaultPrevented !== void 0 ? source.defaultPrevented :
				'returnValue' in source ? source.returnValue === false :
				source.getPreventDefault && source.getPreventDefault())
				event.isDefaultPrevented = returnTrue;
		}
		return event;
	}

	function createProxy(event) {
		var key, proxy = { originalEvent: event };
		for (key in event)
			if (!ignoreProperties.test(key) && event[key] !== void 0)
				proxy[key] = event[key];

		return compatible(proxy, event);
	}

	var matchzx = Element.prototype.matches ||
								Element.prototype.webkitMatchesSelector ||
								Element.prototype.mozMatchesSelector ||
								Element.prototype.msMatchesSelector;

	z.init = function(x){
		return new Z(x);
	};

	z.matchz = function(elm,selector){
		return (
		elm!==null &&
		elm!==document &&
		_isStr(selector)) &&
		matchzx.call(elm,selector);
	};

	z.event = {
		add: zaddEvent,
		remove: zremoveEvent
	};

	z.proxy = function(fn, context) {
		var args = (2 in arguments) && _slice(arguments, 2);

		if(_isFn(fn)){
			var proxyFn = function(){
				return fn.apply(
					context, args ?
					args.concat(_slice(arguments)) : arguments
				);
			};

			proxyFn._zid = zid(fn);
			return proxyFn;

		}else if(_isStr(context)) {
			if (args)
				return z.proxy.apply(null,(args.unshift(fn[context],fn),args));
			else
				return z.proxy(fn[context], fn);
		}else
			throw new TypeError("expected function");
	};

	// z Custom Events
	z.Event = function(type, props) {
		var name;

		if (!_isStr(type))
			props = type, type = props.type;

		var event = document.createEvent(
			_has(capTypes.MouseEvent,type) ?
			'MouseEvent' : 'Events'), bubbles = true;

		if(props)
			for(name in props)
				(name === 'bubbles') ?
				(bubbles = !!props[name]) :
				(event[name] = props[name]);

		event.initEvent(type, bubbles, true);
		return compatible(event);
	};

	z.xEvent = function(event){
		var key;
		for(key in event)
			this[key] = event[key];
	};

	// attr list mapping
	var attrList = {
		class        : "className",
		style        : "style.cssText",
		placeholder  : "@placeholder",
		maxlength    : "@maxlength",
		minLength    : "@minLength",
		max          : "@max",
		min          : "@min",
		href         : "@href",
		checked      : "*checked",
		disabled     : "*disabled",
		readonly     : "*readonly",
		required     : "*required",
		selected     : "*selected",
		controls     : "*controls",
		ended        : "*ended",
		muted        : "*muted",
		hidden       : "*hidden",
		seeking      : "*seeking",
		paused       : "*paused",
		loop         : "*loop",
		autoplay     : "*autoplay",
		multiple     : "*multiple",
		autofocus    : "*autofocus",
		autocomplete : "*autocomplete",
		draggable    : "*draggable",
		spellcheck   : "*spellcheck",
		translate    : "*translate",
		specified    : "*specified",
		defer        : "*defer",
		async        : "*async"
	};

	var patchList = [
		"no",         // 0
		"replace",    // 1
		"append",     // 2
		"remove",     // 3
		"modifytext", // 4
		"withtext",   // 5
		"removetext", // 6
		"addattr",    // 7
		"modifyattr", // 8
		"removeattr"  // 9
	];

	var slikReg = new RegExp(
		"</([^><]+?)>|" +
		"<([^><]+?)/>|" +
		"<([^><]+?)>|"  +
		"([^><]+)|$" ,"g");

	var tagList = {
		input:1,
		br:1,
		hr:1,
		img:1,
		meta:1,
		area:1,
		base:1,
		col:1,
		isindex:1,
		command:1,
		embed:1,
		keygen:1,
		link:1,
		head:1,
		param:1,
		source:1,
		track:1,
		wbr:1,
		path:1,
		circle:1,
		ellipse:1,
		line:1,
		rect:1,
		use:1,
		stop:1,
		polyline:1,
		polygon:1
	};

	var attrexec = /(\S+)=["'](.*?)["']|([\w-]+)/gi,
			attreval = /^\{|\}$/gi,
			attrprops = /^\{([^'"\s]+)\}$/i,
			excapetab = /^[\r\n\f\t\s]+|[\r\n\f\t\s]+$/gi,
			defaultAttr = /^default[^\s]+/i;

	var attrSetter = function(elm,attr,val){
		var attrName = attrList[attr] || attr;
				val = _isStr(val) ?  _decode(val) : val;

		if(defaultAttr.test(attrName)){
			// is defaultAttr
			attrName = attrName.slice(7).toLowerCase();
			var inval = elm.getAttribute(attrName) || elm[attrName];

			if(inval == null || inval === "") attrSetter(elm,attrName,val);
		}
		else if(attrName[0] === "*")
			_set(elm,attrName.slice(1),(val==="true"||val===true));
		else if(attrName[0] === "@")
			elm.setAttribute(attrName.slice(1),val);
		else if(attrName[0] === ":")
			z(elm).on(attrName.slice(1),val);
		else
			_set(elm,attrName,val);
	};

	var attrClear = function(elm,key,val){
		if(key[0] === ":" && _isFn(val))
			z(elm).off(key.slice(1),val);
		else if(elm[key] && !(delete elm[key]))
			try{ elm[key] = null; }catch(e){ }
		else
			elm.removeAttribute(key);
	};

	var attrEvent = function(key,val,props){
		var res=val,fn;
		// parse props
		if(attrprops.test(val)){
			fn = props[val.replace(attreval,'')];
			res = fn !== void 0 ? fn : val;
		}

		if(key[0]===":")
			res = _isFn(fn) ? fn : Function("event", _toString(val));

		return res;
	};

	var patchAttr = function(o,t){
		var s = {};
		_fol(t,function(v,k){ if(o[k] === v) s[k]=1; });
		return s;
	};

	var patchHack = [
		//0 nopatch
		_noop,
		//1 replace
		function(patch){
			var t = patch.s;

			if(t && t.parentNode) t.parentNode.replaceChild(patch.n,t);
				// t.parentNode.insertBefore(patch.n,t);
				// t.parentNode.removeChild(t);
		},
		//2 append
		function(patch){
			var t = patch.s;
			if(t) t.appendChild(patch.n);
		},
		//3 remove
		function(patch){
			var t = patch.s;
			if(t.parentNode) t.parentNode.removeChild(t);
		},
		//4 modifytext
		function(patch){
			var t = patch.s;
			t.textContent = _decode(patch.c);
		},
		//5 withtext
		function(patch){
			var t = patch.s;
			t.textContent = _decode(patch.c);
		},
		//6 removetext
		function(patch){
			var t = patch.s;
			t.innerHTML = patch.n.innerHTML;
		},
		//7 addattr
		function(patch){
			_fol(patch.a,function(value,key){
				attrSetter(patch.s,key,value);
			});
		},
		//8 modifyattr
		function(patch){
			var t = patch.s;
			var s = patchAttr(patch.o,patch.a);

			_fol(patch.o,function(value,key){
				if(!(key in s)) attrClear(t,key,value);
			});
			_fol(patch.a,function(value,key){
				if(!(key in s)) attrSetter(t,key,value);
			});
		},
		//8 removeattr
		function(patch){
			_fol(patch.a,function(value,key){
				attrClear(patch.s,key,value); });
		}
	];

	// SLIK SINGE virtualDOM DIFF
	var slik = {

		treeDiff: function(org,tag,patch,orgParent,tagParent,view){
			if(org === void 0)
				// new node
				patch.unshift(this.createPatch(orgParent,tag,2,view));

			else if(tag === void 0)
				// remove node
				patch.push(this.createPatch(org,0,3,view));

			else if(org.tagName === tag.tagName){
				if(!_eq(org.attributes,tag.attributes)){
					if(org.attributes&&tag.attributes) patch.push(this.createPatch(org,tag,8));
					else if(!org.attributes) patch.push(this.createPatch(org,tag,7));
					else if(!tag.attributes) patch.push(this.createPatch(org,tag,9));
				}

				// some node , maybe modify
				if(org.text !== tag.text){
					if( org.text && tag.text && org.text !== tag.text) patch.push(this.createPatch(org,tag,4));
					else if(!org.text) patch.push(this.createPatch(org,tag,5));
					else if(!tag.text) patch.push(this.createPatch(org,tag,6,view));
					return patch;
				}

				// with child diff
				// optimzer patch at child diff
				var i, o = org.child.length, t = tag.child.length;

				// There is an algorithm problem
				// and if you need the smallest patcher - 
				// you need to make extreme comparisons and optimizations to diff child nodes
				// but it also leads to more cycles and complexity
				// *will rebuild using some algorithm with reduce the patcher
				if(o || t){
					// org < tag ( add tag )
					if(o < t){
						// don't be naive. There are order problems
						for(i=o; i<t; i++) patch.push(this.createPatch(org,tag.child[i],2,view));
						for(i=o; i--;) this.treeDiff(org.child[i],tag.child[i],patch,org,tag,view);

					// org > tag ( exist remove tag )
					}else if(o>t){
						for(i=o-1; i>=t; i--) patch.push(this.createPatch(org.child[i],0,3,view));
						for(i=t; i--;) this.treeDiff(org.child[i],tag.child[i],patch,org,tag,view);

					}else{
					// org === tag ( modify )
						for(i=Math.max(o,t); i--;) this.treeDiff(org.child[i],tag.child[i],patch,org,tag,view);
					}
				}
			}

			else if(org.tagName !== tag.tagName)
				patch.push(this.createPatch(org,tag,1,view));

			return patch;
		},

		applyPatch:function(oDOM,patchs){
			_fal(_map(patchs,function(patch){
				patch.path = patch.s;
				patch.s = this.mapTreeNode(oDOM,patch.s);
				return patch;
			}.bind(this)),function(patch){
				patchHack[patch.t].call(oDOM,patch);
			});
		},

		mapTreeNode: function(oDOM,path){
			var target,i=0,p=oDOM.children;
			for(; i<path.length; i++){
				if(p[path[i]]){
					target = p[path[i]];
					p = target.children;
				} else break;
			}
			return target;
		},

		createSelector:function(org){
			var path = [org.i];
			while((org=org.parent))
				if(org.i !== void 0)
					path.unshift(org.i);
			return path;
		},

		createPatch: function(org,tag,type,view){
			var node, patch, sl = this.createSelector(org);

			switch(patchList[type]){
				case "replace":
					node = this.createDOMElement(tag,view);
					patch = { t:1, s:sl, n:node };
					break;
				case "append":
					node = this.createDOMElement(tag,view);
					patch = { t:2, s:sl, n:node };
					break;
				case "remove":
					patch = { t:3, s:sl };
					break;
				case "modifytext":
					patch = { t:4, s:sl, c:tag.text };
					break;
				case "withtext":
					patch = { t:5, s:sl, c:tag.text };
					break;
				case "removetext":
					node = this.createDOMElement(tag,view);
					patch = { t:6, s:sl, n:node };
					break;
				case "addattr":
					patch = { t:7, s:sl ,a:tag.attributes };
					break;
				case "modifyattr":
					patch = { t:8, s:sl ,a:tag.attributes, o:org.attributes };
					break;
				case "removeattr":
					patch = { t:9, s:sl ,a:org.attributes };
					break;
				default:
					patch = { t:0 };
					break;
			}
			return patch;
		},

		createTreeFromHTML: function(html,vprops){
			var axroot = {
				tagName: "AXROOT",
				child:[]
			};

			var p = axroot , c = axroot.child, n;

			html.replace(slikReg,function(match,close,stag,tag,text){
				if(!match || !(match.replace(excapetab,"")))
					return match;
				if(close){
					p = p.parent; c = p.child;
				}else if(stag){
					n = this.createObjElement(stag,vprops);
					n.i= c.length; c.push(n); n.parent = p;
				}else if(tag){
					n = this.createObjElement(tag,vprops);
					n.i= c.length; c.push(n); n.parent = p;
					if(!(n.tagName in tagList)) p = n, c = n.child;
				}else if(text){
					if(text.trim()) p.text = text;
				}
				return match;
			}.bind(this));

			return axroot;
		},

		createObjElement:function(str,vprops){
			var arr = str.split(" "),
					props = _isObj(vprops) ? vprops : {},
					tagName = arr.shift(),
					attributes = arr.join(" "),
					elm =  { tagName: tagName, child:[] };

			if(attributes){
				var attrs = {} ,s, tg;
				while((s=attrexec.exec(attributes))){
					if(!s[1]){
						if(!tg)
							tg = s[0];
						else{
							attrs[tg] = attrEvent(tg,s[0],props); tg=0;
						}
					}else
						attrs[s[1]] = attrEvent(s[1],s[2],props);
				}
				elm.attributes = attrs;
			}

			return elm;
		},

		createDOMElement:function(obj,view){
			var elm = document.createElement(obj.tagName);

			if(view && obj.attributes && obj.attributes.ref)
				view.refs[obj.attributes.ref] = elm;

			_fol(obj.attributes,function(value,key){ 
				attrSetter(elm,key,value); 
			});

			if(obj.text)
				elm.textContent = _decode(obj.text);

			else if(obj.child.length)
				_fal(obj.child,function(child){ 
					elm.appendChild(this.createDOMElement(child,view)); 
				},this);

			return elm;
		}
	};

	var capTypes = {
		// "UIEvent"       : [
		// 	"focus",
		// 	"blur",
		// 	"focusin",
		// 	"focusout"
		// ],
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
		// "KeyboardEvent" : [
		// 	"keydown",
		// 	"keypress",
		// 	"keyup"
		// ]
	};

	Z.prototype = {
		get : function(index){
			return 0 in arguments ?
				this.el[+index + ( index < 0 ? this.length : 0 )] :
				this.el;
		},

		each : function(fn,context){
			_fal(this.el,fn,context||this);
			return this;
		},

		find : function(sl){
			var res = [];
			_fal(this.el,function(e){
				res = _slice(e.querySelectorAll(sl)).concat(res);
			});
			return z(res);
		},

		closest : function(selector,element){
			var el=this.el ,tmp=this.get(0),
					find, i=0, l=el.length;

			for(; i<l; i++,tmp=el[i]){
				while(tmp&&!find&&tmp!==element)
					if(z.matchz(tmp=tmp.parentNode,selector))
						find = tmp;
				if(find) break;
			}

			return z(find||[]);
		},

		on : function(event, selector, data, callback, one){
			var autoRemove, delegator;

			if(event && !_isStr(event)) {
				_loop(event, function(fn, type){
					this.on(type, selector, data, fn, one);
				},this);

				return this;
			}

			if(!_isStr(selector) &&
				!_isFn(callback) &&
				callback !== false)
				callback = data, data = selector, selector = void 0;
			if(callback === void 0 || data === false)
				callback = data, data = void 0;

			if(callback === false)
				callback = returnFalse;

			return this.each(function(element){
				if(one)
					autoRemove = function(e){
						zremoveEvent(element, e.type, callback);
						return callback.apply(this, arguments);
					};

				if(selector)
					delegator = function(e){
						var match = z.matchz(e.target,selector) ?
							e.target : z(e.target).closest(selector, element).get(0);

						if (match && match !== element)
							(autoRemove || callback).apply(
								match,
								[_extend(e, { currentTarget: match, liveFired: element })].concat(
									_slice(arguments,1)
								)
							);
					};

				zaddEvent(element, event, callback, data, selector, delegator || autoRemove);
			});
		},

		off : function(event, selector, callback){
			if (event && !_isStr(event)) {
				_loop(event, function(fn, type){
					this.off(type, selector, fn);
				},this);
				return this;
			}

			if(!_isStr(selector) &&
				!_isFn(callback) &&
				callback !== false)
				callback = selector, selector = void 0;

			if(callback === false)
				callback = returnFalse;

			return this.each(function(element){
				zremoveEvent(element, event, callback, selector);
			});
		},

		trigger : function(event, args){
			event = _isStr(event) ? z.Event(event) : compatible(event);
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
				e = createProxy(_isStr(event) ? z.Event(event) : event);

				e._args = args;
				e.target = element;
				_loop(findHandlers(element, event.type || event), function(handler){
					result = handler.proxy(e);
					if (e.isImmediatePropagationStopped())
						return false;
					return true;
				});
			});

			return result;
		},

		html : function(html){
			return this.each(function(elm){
				elm.innerHTML = _toString(html);
			});
		},

		remove: function(){
			return this.each(function(elm){
				elm.parentNode.removeChild(z(elm).off().get(0));
			});
		},

		// virtual render
		render : function(newhtml,view,props){
			return this.each(function(elm){
				var target = slik.createTreeFromHTML(newhtml,props);

				if(elm._vid !== view._vid)
					return elm.appendChild(slik.createDOMElement(
						view.axml = target, view
					).firstElementChild, elm.innerHTML = "");

				return slik.applyPatch(
					elm, 
					slik.treeDiff(view.axml,target,[],null,null,view), 
					view.axml = target
				);
			});
		}
	};

	// checker template;
	var checkalert = _doom("[ checker -> ax.va.{{#type}} ]"),
			vahandler  = _doom("The value Of *( {{#value}} ) with type [ {{#type}} ] not pass validate! {{#msg}}");

	function checkValidate(newdata,model){
		if(!model._v) return true;

		var validate = model._asv(_),
				error = [], key = _keys(validate),
				i=0, s=key.length, isRequired, value, valid;

		for(; i<s; i++){
			// get validate funtion
			isRequired = validate[key[i]]; value= _get(newdata,key[i]);
			if(!isRequired(value)){
				error.push(key[i],value);
				break;
			}
		}

		valid = !_size(error);

		model.emit("validate:"+(valid ? "success" : "fail"),
								valid ? [_clone(newdata)] : error);

		return valid;
	}


	function singleValidate(key,val,model){
		return !model._v || checkValidate(_set(model.get(),key,val),model);
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
		var res;
		if(_isAry(target)) res = target.concat(val);
		else if(_isObj(target)) res = _merge(_extend({},target),val);
		else res = val;
		return res;
	}

	function warn(value,msg){
		return !console.warn(
			vahandler({ value : value, type : _type(value), msg : msg||"" })
		);
	}

	function makeChecker(checker,type){
		return function(value){
			return checker(value) ||
				warn(value,checkalert({ type:type }));
		};
	}

	function isAx(compare){
		return function(value){
			return value instanceof compare;
		};
	}

	function pipe(type,url,param,fns,fnf,header){
		//param must be object typeof
		var st = {
			url : url,
			type  : RESTFUL[type],
			aysnc : true,
			param : param,
			header : header
		};

		// deal with arguments
		// set http header param
		st.success = function(){
			// change the data before dispatch event;
			(fns||_noop).apply(this,arguments);
			this.emit(type+":success",arguments);
		}.bind(this);

		st.fail = function(){
			(fnf||_noop).apply(this,arguments);
			this.emit(type+":fail",arguments);
		}.bind(this);

		return this.emit(type,[_ajax(st),st]);
	}

	function revs(str){
		return str.split("").reverse().join("");
	}

	function modelDefined(model,props){
		_fol(props,function(t,n){
			_define(model, n, { value: t,
				writable: false,
				enumerable: false,
				configurable: false
			});
		});
		return model;
	}

	ax.module = function(name,creater){
		var make = maker[name];
		if(make) return make;
		if((make = creater.apply(struct.root,AXMODULE_INJECT)))
			return (maker[name] = make);
	};

	ax.use = function(name){
		if(maker[name]) return maker[name];
		console.warn("Ax was not find dependency injection { module } as: [",name,"]");
	};

	aS = {
		t: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		kAt: function(key,i){
			return key.charCodeAt(~~(i%key.length));
		},

		ecd: function(data) {
			var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
			if (!data) { return data; }
			do {
				o1 = data[i++];
				o2 = data[i++];
				o3 = data[i++];
				bits = o1 << 16 | o2 << 8 | o3;
				h1 = bits >> 18 & 0x3f;
				h2 = bits >> 12 & 0x3f;
				h3 = bits >> 6 & 0x3f;
				h4 = bits & 0x3f;
				enc += this.t.charAt(h1) 
						+  this.t.charAt(h2) 
						+  this.t.charAt(h3) 
						+  this.t.charAt(h4);
			} while (i < data.length);
			r = data.length % 3;
			return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
		},

		dcd: function(data) {
			var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
			if (!data) { return data; }
			data += "";
			do {
				h1 = this.t.indexOf(data.charAt(i++));
				h2 = this.t.indexOf(data.charAt(i++));
				h3 = this.t.indexOf(data.charAt(i++));
				h4 = this.t.indexOf(data.charAt(i++));
				bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
				o1 = bits >> 16 & 0xff;
				o2 = bits >> 8 & 0xff;
				o3 = bits & 0xff;
				result.push(o1);
				if (h3 !== 64) {
					result.push(o2);
					if (h4 !== 64)
						result.push(o3);
				}
			} while (i < data.length);
			return result;
		},

		incry: function(s,key){
			var i=0,l=s.length,res = [];
			for(; i<l; i++)
				res[i] = s[i].charCodeAt(0)^this.kAt(key,i);
			return this.ecd(res);
		},

		decyt: function(s,key){
			s = this.dcd(s); 
			var i=0, l=s.length;
			for(; i<l; i++)
				s[i] = FCD(s[i]^this.kAt(key,i));
			return s.join("");
		},

		set: function(name,data){
			LS.setItem(
				(SN+this.incry(name,revs(name))),
				this.incry(encodeURIComponent(JSON.stringify(data)),name)
			);
		},

		get: function(name){
			var str = LS.getItem(SN+this.incry(name,revs(name)));
			return str ? JSON.parse(decodeURIComponent(this.decyt(str,name))) : 0;
		},

		rm: function(name){
			LS.removeItem(SN+this.incry(name,revs(name)));
		}
	};

	// Ax Model
	// Ax build -> 3.0
	// model constructor
	aM = function(obj){
		var config    = _extend(_clone(MODEL_DEFAULT),obj||{}),
				events    = config.events,
				validate  = config.validate||{},
				filter    = _isFn(config.filter) ? config.filter : cool ,

				existname = _isStr(config.name),
				usestore  = !!(config.store && existname),
				usedata   = config.data || {},
				data      = usestore ? (aS.get(config.name) || usedata) : usedata;

		_fol(events,uon,modelDefined(this,{
			name: existname ? config.name : "_",
			_ast: function(todo,v){
				return v===_ ? todo(data) : {}; },
			_asv: function(v){
				return v===_ ? validate : {}; },
			_v: !!_size(validate),
			_f: filter,
			_c: function(newdata,v){
				return v===_ ? (data = newdata) : {}; },
			_s: usestore
		}));

		if(existname) RAM[this.name] = this;
		// init event
		_extend(this,config,MODEL_KEYWORDS).emit("init").unbind("init");
	};


	// model data usually define as pure data, not javascript event or function
	// because it much as MVC-M logs
	aMP = aM.prototype = {
		constructor: aM,

		get: function(key,by){
			var data = this._ast(_clone,_);
			return (key || key===0) ? _get.call(this,data,key,by) : data;
		},

		set: function(key,val,setStatic){
			if(this.lock) return;

			var assert = this._ast(cool,_), 
					argslen = arguments.length,
					ref, single = !_isPrim(key) && _isObj(key);

			if(argslen){
				if(single){
					// single pointer select
					setStatic = val;

					if((ref=this._f(key))&&
						!_eq(assert,ref)&&
						checkValidate(ref,this)){

						this._c(ref,_,this.change=true);
						if(this._s) aS.set(this.name,ref);
						if(!setStatic) 
							this.emit("change",[_clone(ref)]);
					}

				} else {
					if(!_eq(_get(assert,key),val) &&
						singleValidate(key,val,this)){

						_set(assert,key,val,this.change = true);
						if(this._s) aS.set(this.name,assert);
						if(!setStatic){
							this.emit("change",[_clone(assert)]);
							this.emit("change:"+key,[val]);
						}
					}
				}

			}

			return this;
		},

		rm: function(prop,rmStatic){
			if(this.lock) return;

			var assert = this._ast(cool,_);

			if(_isPrim(prop) &&
				prop!=null &&
				_get(assert,prop) !== void 0){
				_rm(assert,prop);
				if(this._s) aS.set(this.name,assert);
				if(!rmStatic){
					this.emit("change",[_clone(assert)]);
					this.emit("remove:"+prop);
				}
			}

			return this;
		},

		moc: function(key,val,setStatic){
			return this.set(
				key,
				moc(this.get(key),val),
				setStatic
			);
		},

		// API event
		on: on,
		emit: emit,
		unbind: unbind,

		// Ax Restful API design for
		// [Ax Model] data format serialize
		toJSON: function(){
			return JSON.stringify(this.get());
		},

		send: function(url,header){
			if(_isObj(url)){
				header = url;
				url = null;
			}

			return pipe.apply(this,[
				"send",
				url || this.url,
				this.get(),
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
				this.get(),
				_noop,
				_noop,
				header
			]);
		},

		toString: function(){
			return _toString(this.toJSON());
		}
	};

	function packBefore(view){
		return function(){
			var args = _slice(arguments);
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

			view.root._vid = view._vid;
			view.root.setAttribute("ax-root","");
			return view.emit("completed",args);
		};
	}

	function packRender(view,render){
		var b = packBefore(view),
				m = packMain(view,render),
				c = packComplete(view);

		return _link(b,m,c);
	}

	function setRender(view,render){
		if(_isFn(render))
			view.render = packRender(view,render);
		return view;
	}

	function checkElm(el){
		if(!(_isElm(el) || _isAryL(el)))
			throw new TypeError(
				"el must be typeof DOMElement or NodeList collections -> not " + el
			);
		return true;
	}

	// Ax View [ The view container ]
	aV = function(obj){
		this.refs = {};

		var config  = _extend(_clone(VIEW_DEFAULT),obj||{}),
				props   = _lock(_isObj(config.props) ? config.props : {}),
				vroot   = config.root,
				render  = config.render,
				events  = config.events,
				model   = config.model,
				stencil = config.template;

		// parse template
		// building the render function
		if(!_isFn(render)){
			stencil = _isStr(stencil) ?
			(config.cache ? _doom : _axt)(stencil.trim(), props) :
			(_isFn(stencil) ? stencil : _noop);

			render = function(){
				return stencil !== _noop &&
					z(this.root).render(
						stencil.apply(this,_slice(arguments)),
						this,
						props
					);
			}.bind(this);
		}

		// if userobj has more events
		if(vroot&&checkElm(vroot)){
			// bind events
			this.root = vroot;

			_fol(events,uon,setRender(this,render));

			if(model && vA.model(model))
				model.on("change",this.render);

		}else{
			this.mount = function(el){
				if(checkElm(el)){
					// bind events
					this.root = vroot = el;
					_fol(events,uon,setRender(this,render));

					if(model && vA.model(model))
						model.on("change",this.render);

					// trigger render
					if(1 in arguments)
						this.render.apply(this,_slice(arguments,1));

					// delete mount
					delete this.mount;
					return this;
				}
			};
		}

		_extend(this,config,VIEW_KEYWORDS,this._vid=vid++).emit("init").unbind("init");
	};

	aVP = aV.prototype = {
		constructor:aV,

		on: function(type,fn){
			_fal(_toString(type).split("|"),function(mk){
				var param = mk.split(":");
				// DOM Element events
				if(param.length > 1)
					z(this.root).on(
						param[0],
						param[1],
						fn._bind||(fn._bind=fn.bind(this))
					);
				else 
					_on(this,mk,fn);
			},this);

			return this;
		},

		unbind: function(type,fn){
			_fal(_toString(type).split("|"),function(mk){
				var param = mk.split(":");
				// DOM Element events
				if(param.length > 1)
					z(this.root).off(param[0], param[1], fn ? (fn._bind||fn) : void 0);
				else 
					_unbind(this,mk,fn);
			},this);

			return this;
		},

		emit: function(type,args){
			var t = _toString(type), k = t.split(":");

			if(k.length>2){
				_fal(t.split("|"),function(mk){
					var mkf = mk.split(":");
					z(this.root).find(mkf[1]).trigger(mkf[0],args);
				},this);
				return this;
			}

			if(k.length>1){
				z(this.root).find(k[1]).trigger(k[0],args);
				return this;
			}

			return _emit(this,type,args);
		},

		destroy: function(withRoot){
			this.root.removeAttribute("ax-root",this.root._vid=void 0);

			_ayc(function(){
				z(this.root).off()[withRoot?"remove":"html"]();
				this.emit("destroy",delete this.root);
			}.bind(this));
		},

		toString: function(){
			return this.root ? this.root.outerHTML : "";
		}
	};

	function aTite(cmd,args){
		return function(model){
			return model[cmd].apply(model,args);
		};
	}

	function assert(LIST){
		return function(tdo,v){
			return (_isFn(tdo)&&v===_) ? tdo(LIST) : []; };
	}

	function assertModel(name){
		return function(m){ 
			return m.name === name; 
		};
	}

	function assertMake(list,callback){
		var LIST = this._assert(cool,_);
		var target = _isStr(list) ? [list] : (_isAry(list) ? list : []);
		_fal(target,function(name){ 
			callback.call(this,LIST,name); 
		},this);

		return this;
	}

	function assertMatch(list,match){
		var use = [];
		switch(_type(match)){
			case "regexp":
				_fal(list,function(m){
					if(match.test(m.name))
						use.push(m.name);
				});
				break;
			case "string":
				use.push(match);
				break;
			case "array":
				use = match;
				break;
			default:
				break;
		}
		return use;
	}

	function stom(atom,list){
		var c = ax.atom({ use:list });

		c.back = function(){ 
			return atom; 
		};

		return c;
	}

	// Ax atom * stom
	// Useful models manager
	aT = function(obj){
		var config = _extend(_clone(ATOM_DEFAULT),obj||{}),
				initList = config.use,
				LIST = [];

		// create assert
		this._assert = assert(LIST);

		_extend(this.use(initList),config,ATOM_KEYWORDS);
	};

	aTP = aT.prototype = {
		constructor: aT,

		all: function(){ 
			return this._assert(_slice,_); 
		},

		use: function(list){
			return assertMake.call(this,list,
			function(LIST,name,M){
				if((M = RAM[name]) && !_has(LIST,M))
					LIST.push(M);
			});
		},

		out: function(list){
			return assertMake.call(this,list,
			function(LIST,name){
				var find = _index(LIST,assertModel(name));
				if(_isNum(find)) LIST.splice(find,1);
			});
		},

		p: function(name){
			return _one(this.all(),assertModel(name));
		},

		of: function(fn,args){
			_fal(this.all(), _isFn(fn) ? fn : aTite(fn,args));
			return this;
		},

		swap: function(a,b,swapStatic){
			var ma = this.p(a), mb = this.p(b);

			if(ma && mb){
				var tmp = ma.get();
				ma.set(mb.get(),swapStatic);
				mb.set(tmp,swapStatic);
			}

			return this;
		},

		select: function(match){
			return stom(this,assertMatch(this.all(),match));
		},

		toData: function(){
			return _map(
				this._assert(cool,_),
				function(m){ return m.get(); });
		},

		toChunk: function(){
			var res = {};
			this.of(function(model){ res[model.name] = model.get(); });
			return res;
		}
	};

	// #genertor minmix [ struct ] api
	_fal(["extend","not","cat","find","filter","reject","chunk","compact","pluck","groupBy","countBy","pairs","shuffle","flat","merge","map","sort","unique","concat","pull","drop","pairs",["hook","map","hook"],["mapKey","map","key"],["uniqueFast","unique","fast"],["pullAt","pull","at"],["dropLeft","drop","left"],["dropRight","drop","right"],["dropLeftTo","drop","leftto"],["dropRightTo","drop","rightto"],["unpairs","pairs","un"],["insertSort","sort","i"],["quickSort","sort","q"]],genertor_);

	_fal(["keys","every","some","diff","intsec","first","last","auto","eq","values","size","each","has","type","index",["hasKey","has","key"],["findex","index","first"],["lindex","index","last"],["single","index","one"],["one","index","one"],["reduce","reduce","left"],["reduceRight","reduce","right"],["slimDiff","diff","slim"],["slimIntsec","intsec","slim"]],genertor_$);

	// Extend method
	// Create Ax Pack extends
	ax.model = createAx(aM);
	ax.view  = createAx(aV);
	ax.atom  = createAx(aT);

	ax.model.extend = createExtend(aM);
	ax.view.extend  = createExtend(aV);
	ax.atom.extend  = createExtend(aT);

	// ax validate functional
	ax.va = vA = {
		required  : makeChecker(_isNeed  , "required")  ,
		fn        : makeChecker(_isFn    , "function")  ,
		int       : makeChecker(_isInt   , "int")       ,
		array     : makeChecker(_isAry   , "array")     ,
		float     : makeChecker(_isFloat , "float")     ,
		string    : makeChecker(_isStr   , "string")    ,
		object    : makeChecker(_isObj   , "object")    ,
		number    : makeChecker(_isNum   , "number")    ,
		arrayLike : makeChecker(_isAryL  , "arrayLike") ,
		primitive : makeChecker(_isPrim  , "primitive") ,
		bool      : makeChecker(_isBool  , "boolean")   ,
		dom       : makeChecker(_isDOM   , "dom")       ,
		element   : makeChecker(_isElm   , "element")   ,
		node      : makeChecker(_isNode  , "node")      ,
		model     : makeChecker(isAx(aM) , "model")     ,
		view      : makeChecker(isAx(aV) , "view")      ,
		atom      : makeChecker(isAx(aT) , "atom")
	};

	ax.VERSION = struct.VERSION;

	return _lock(aM,aV,aT,aS,
		v8(aMP),v8(aVP),v8(aTP),
		v8(vA),v8(slik),v8(ax));
});
