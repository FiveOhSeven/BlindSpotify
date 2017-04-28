angular.module('affinityModule', []).config(router);

function router($routeProvider) {
	$routeProvider
		.when('/app/affinity', {
			templateUrl: '/modules/affinity/affinity.html',
			controller: 'affinityController'
		});
}