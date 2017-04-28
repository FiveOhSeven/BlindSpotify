angular.module('songModule', []).config(router);

function router($routeProvider) {
	$routeProvider
		.when('/app/song', {
			templateUrl: '/modules/songs/song.html',
			controller: 'songController'
		});
}