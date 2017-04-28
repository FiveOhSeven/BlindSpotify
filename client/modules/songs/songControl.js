angular.module('songModule').controller('songController', msg);

function msg($scope, Spotify) {
	$scope.render = function() {
		Spotify.getSavedUserTracks().then(function(data){
			$scope.tracks = data.data.items;
		});
	};
	$scope.render();
}