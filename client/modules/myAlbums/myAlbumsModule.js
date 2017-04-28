angular.module('myAlbumsModule', []).config(router);

function router($routeProvider){
	$routeProvider
		.when('/app/myAlbums', {
			templateUrl: '/modules/myAlbums/myAlbums.html',
			controller: 'myAlbumsController'
	});
}