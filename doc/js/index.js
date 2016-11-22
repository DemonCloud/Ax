(function(){

	var list = __("#list");

	var view = new aix.view({
		el : "#render",
		url: "template/method.aix"
	});
		
	var model = new aix.model({
		url:"module/data.json",
		events:{
			init:function(){
				this.fetch({},function(){
					route.listen();
				});
			}
		}
	});

	var route = new aix.route({
		routes:{
			".": "load"
		},
		actions:{
			load : function(event,hash){
				list.find("a").removeClass("active");
				list.find("a[href='#"+hash+"']").addClass("active");

				window.scrollTo(0,0);
				view.render(model.data[hash]);
			}
		}
	});


})();
