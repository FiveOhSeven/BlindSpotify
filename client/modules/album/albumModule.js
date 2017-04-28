angular.module('albumModule', []).config(router);

function router($routeProvider) {
	$routeProvider
		.when('/app/album/:album', {
			templateUrl: '/modules/album/album.html',
			controller: 'albumController'
		});
}