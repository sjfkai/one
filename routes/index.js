

module.exports = function(router){
	router.get('/',function *(){
			this.body = "hahahaha";
	});
	userRouter(router);
	pcRouter(router);
}