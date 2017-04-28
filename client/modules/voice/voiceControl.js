angular.module('voiceModule').controller('voiceController', msg);

function msg($scope, $rootScope, Spotify) {

	$scope.render = function() {
		if (!annyang.isListening()) {
			console.log('hi');
			annyang.start({
				autoRestart: true,
				continuous: false
			});
			annyang.debug();
			annyang.addCommands(getCommands());
			$scope.$parent.recording = true;
		}
		else {
			annyang.abort();
			$scope.$parent.recording = false;
		}
	};
	$scope.render();

	function addConv(command, response, param) {
		var tempObject = {};
		tempObject.command = command;
		tempObject.response = response;
		$rootScope.conversation.push(tempObject);
		responsiveVoice.speak(response, "US English Female", param);
	}

	function getCommands() {
		return {
			'hello': function() {
				addConv("Hello", "hi", {});
			},
			'play': function() {
				if ($scope.playing == true) {
					$scope.current.object.volume = 0.5;
					addConv("Play", "Music is already playing", {
						onend: function() {
							$scope.current.object.volume = 1;
						}
					});
				}
				else {
					addConv("Play", "Playing current song", {
						onend: function() {
							$scope.playPause();
						}
					});
				}
			},
			'pause': function() {
				if ($scope.playing == true) {
					$scope.playPause();
					addConv("Pause", "Paused current song", {});
				}
				else {
					addConv("Pause", "Music is already paused", {});
				}
			},
			'current song': function() {
				$scope.current.object.volume = 0.5;
				addConv("Current song", "The current song is " + $scope.current.name + " by " + $scope.current.artist, {
					onend: function() {
						$scope.current.object.volume = 1;
					}
				});
			},
			'my playlists': function() {
				var tempString = "Your playlists are: ";
				$scope.playlists.forEach(function(data) {
					tempString += data.name + ", ";
				});
				addConv("My playlists", tempString, {});
			},
			'play favorite': function() {
				addConv("Play favorite", "Playing all of your favorite songs", {
					onend: function() {
						Spotify.getUserTopTracks().then(function(data) {
							var topTracks = data.data.items;
							topTracks.forEach(function(data) {
								$scope.queueFactory(data.name, data.artists[0].name, data.album.images[0].url, data.preview_url, '/app/album/' + data.album.id);
							});
							$scope.next();
						});
					}
				});

			},
			'next song': function() {
				if ($scope.playing == true) {
					$scope.playPause();
				}
				addConv("Next song", "Playing next song", {
					onend: function() {
						$scope.next();
					}
				});
			},
			'previous song': function() {
				if ($scope.playing == true) {
					$scope.playPause();
				}
				addConv("Previous song", "Playing previous song", {
					onend: function() {
						$scope.prev();
					}
				});
			},
			'play *song': function(song) {
				Spotify.search(song, 'track', {
					limit: 1
				}).then(function(data) {
					var item = data.data.tracks.items[0];
					$scope.songFactory(item.name, item.artists[0].name, item.album.images[0].url, item.preview_url, '/app/album/' + item.album.id);
					$scope.playPause();
				});
				addConv("Play " + song, "Playing " + song, {
					onend: function() {
						$scope.playPause();
					}
				});
			},
			'queue *song': function(song) {
				Spotify.search(song, 'track', {
					limit: 1
				}).then(function(data) {
					var item = data.data.tracks.items[0];
					$scope.queueFactory(item.name, item.artists[0].name, item.album.images[0].url, item.preview_url, '/app/album/' + item.album.id);
					$scope.playPause();
				});
				addConv("Queue " + song, "Queueing " + song, {
					onend: function() {
						$scope.playPause();
					}
				});
			}
		};
	}
}