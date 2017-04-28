angular.module('playlistModule', []).config(router);

function router($routeProvider) {
	$routeProvider
		.when('/app/:user/playlist/:playlist', {
			templateUrl: '/modules/playlist/playlist.html',
			controller: 'playlistController'
		});
}