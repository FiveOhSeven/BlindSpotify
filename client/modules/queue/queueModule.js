angular.module('queueModule', []).config(router);

function router($routeProvider) {
	$routeProvider
		.when('/app/queue', {
			templateUrl: '/modules/queue/queue.html',
			controller: 'queueController'
		});
}