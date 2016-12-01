(function(){

	var list = __("#list");

		
	var model = new aix.model({
		url:"module/data.json",
		events:{
			init:function(){
				this.fetch({},function(){
					
					var view = new aix.view({
						el : "#render",
						url: "template/method.aix",
						events:{
							init:function(){
								route.view = this;
								route.listen();
							}
						}
					});
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
				this.view.render(model.data[hash]);
			}
		}
	});


})();
