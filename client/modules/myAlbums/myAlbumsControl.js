angular.module('myAlbumsModule').controller('myAlbumsController', msg);

function msg($scope, Spotify) {

	$scope.render = function() {
		Spotify.getSavedUserAlbums().then(function(data) {
			$scope.albums = data.data.items;
		});
	};
	$scope.render();
}