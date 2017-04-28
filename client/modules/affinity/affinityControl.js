angular.module('affinityModule').controller('affinityController', msg);

function msg($scope, Spotify) {
	$scope.render = function() {
		Spotify.getUserTopTracks().then(function(data){
			$scope.tracks = data.data.items;
		});
	};
	$scope.render();
}