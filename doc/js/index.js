(function(){

	var list = __("#list");
		

	var view = new aix.view({
		el : "#render",
		render: function(data){
			__(this.el).fill(data);
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

				_.aix({
					url : 'module/'+hash+'.html',
					type : "GET",
					success:function(responseText){
						window.scrollTo(0,0);
						view.render(responseText);
					}
				});
			}
		}
	});

	route.listen();

})();
