angular.module('albumModule').controller('albumController', msg);

function msg($scope, $routeParams, Spotify) {

	$scope.render = function() {
		$scope.id = $routeParams.album;
		Spotify.getAlbum($routeParams.album)
			.then(function(data){
				$scope.tracks = data.data.tracks.items;
				$scope.image = data.data.images[0].url;
				$scope.name = data.data.name;
				$scope.id = data.data.id;
			});
	};
	$scope.render();
}