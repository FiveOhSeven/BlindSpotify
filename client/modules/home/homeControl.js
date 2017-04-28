angular.module('homeModule').controller('homeController', msg);

function msg($scope, Spotify) {

	$scope.render = function() {
		Spotify.getFeaturedPlaylists().then(function(data) {
			$scope.featuredPlaylists = data.data.playlists.items;
		});
	};
//	$scope.render();
}