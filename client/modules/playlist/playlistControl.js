angular.module('playlistModule').controller('playlistController', msg);

function msg($scope, $routeParams, Spotify) {

	$scope.render = function() {
		Spotify.getPlaylist($routeParams.user, $routeParams.playlist)
			.then(function(data){
				$scope.tracks = data.data.tracks.items;
				$scope.name = data.data.name;
				$scope.image = data.data.images[0].url;
			});
	};
	$scope.render();
}