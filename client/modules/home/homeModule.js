angular.module('homeModule', []).config(router);

function router($routeProvider){
	$routeProvider
		.when('/app', {
			templateUrl: '/modules/home/home.html',
			controller: 'homeController'
	});
}