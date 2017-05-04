angular.module('mainApp').controller('playerController', player);

function player($scope, $http, Spotify, ngAudio, $route, $location, $cookies, $window) {
	$scope.authToken = 'a';
	$scope.playlists = '';
	$scope.playing = false;
	$scope.prevQueue = [];
	$scope.glued = true;

	$scope.current = {
		"name": "Cold as Ice",
		"artist": "Kanye West",
		"image": "img/cold_kanye.png",
		"sound": "img/coldAsIce.mp3",
		"link": "/"
	};
	$scope.nextQueue = [];
	$scope.temp = {};
	$scope.current.object = ngAudio.load($scope.current.sound);
	ngAudio.setUnlock(false);
	var refreshCookie = $cookies.get('refreshCookie');
	if (refreshCookie) {
		if($cookies.get('refreshCookie') == "null"){
			$window.location.href = '/';
		}
		var temp = {};
		temp.refresh = $cookies.get('refreshCookie');
		$http.post('/token/refresh', temp).then(function(response){
			Spotify.setAuthToken(response.data);
			Spotify.getCurrentUser().then(function(data) {
				$scope.user = data.data.id;
				initialize();
			});
		});

	} else {
		$http.post('/token/access').then(function(response) {
			console.log(response);
			if(response.data.access_token == null){
				$window.location.href = '/';
			}
			$cookies.put('refreshCookie', response.data.refresh_token);
			Spotify.setAuthToken(response.data.access_token);
			Spotify.getCurrentUser().then(function(data) {
				$scope.user = data.data.id;
				initialize();
			});

		}, function(error){
			$window.location.href = '/';
		});
	}

	function initialize() {
		Spotify.getUserPlaylists($scope.user).then(function(data) {
			$scope.playlists = data.data.items;
		});

		// Spotify.getTrack('7oK9VyNzrYvRFo7nQEYkWN').then(function(data) {
		// 	$scope.temp.name = data.data.name;
		// 	$scope.temp.sound = data.data.preview_url;
		// 	$scope.temp.image = data.data.album.images[0].url;
		// 	$scope.temp.artist = data.data.artists[0].name;
		// 	$scope.temp.object = ngAudio.load(data.data.preview_url);
		// 	$scope.nextQueue.push($scope.temp);
		// });
		Spotify.getFeaturedPlaylists().then(function(data) {
			$scope.featuredPlaylists = data.data.playlists.items;
		});

		return;
	}

	$scope.playPause = function() {
		if ($scope.playing == true) {
			$scope.current.object.pause();
		}
		else if ($scope.playing == false) {
			$scope.current.object.play();
		}
		$scope.playing = !$scope.playing;
	};

	$scope.current.object.complete(function(audio) {
		audio.currentTime = 0;
		$scope.next();
	});

	$scope.next = function() {
		if ($scope.nextQueue[0] != null) {
			$scope.prevQueue.push($scope.current);
			$scope.current.object.stop();
			$scope.current = $scope.nextQueue[0];
			$scope.nextQueue.shift();
			$scope.current.object.play();
			$scope.playing = true;
		}
		else {
			$scope.playing = false;
			$scope.current.object.pause();
		}
	};

	$scope.prev = function() {
		if ($scope.prevQueue[$scope.prevQueue.length - 1] != null) {
			$scope.nextQueue.unshift($scope.current);
			$scope.current.object.stop();
			$scope.current = $scope.prevQueue[$scope.prevQueue.length - 1];
			$scope.prevQueue.pop();
			$scope.current.object.play();
			$scope.playing = true;
		}
		else {
			$scope.playing = false;
			$scope.current.object.pause();
		}
	};

	$scope.newSong = function() {
		$scope.current.object = ngAudio.load($scope.current.sound);
		$scope.current.object.play();
		$scope.playing = true;
		$scope.current.object.complete(function(audio) {
			audio.currentTime = 0;
			$scope.next();
		});
	};

	$scope.songFactory = function(name, artist, image, sound, link) {
		if (sound == null) {
			$scope.playPause();
			responsiveVoice.speak("There is no song preview available for" + name);
			return;
		}
		var tempObject = {};
		tempObject.name = name;
		tempObject.artist = artist;
		tempObject.image = image;
		tempObject.sound = sound;
		tempObject.link = link;
		$scope.current.object.stop();
		$scope.prevQueue.push($scope.current);
		$scope.current = tempObject;
		$scope.newSong();
	};

	//reused code from song factory and newSong.  restructuring necessary
	$scope.queueFactory = function(name, artist, image, sound, link) {
		if (sound == null) {
			return;
		}
		var tempObject = {};
		tempObject.name = name;
		tempObject.artist = artist;
		tempObject.image = image;
		tempObject.sound = sound;
		tempObject.link = link;
		tempObject.object = ngAudio.load(tempObject.sound);
		tempObject.object.complete(function(audio) {
			audio.currentTime = 0;
			$scope.next();
		});
		$scope.nextQueue.push(tempObject);
	};

	$scope.refresh = function() {
		$http.post('/token/refresh', $cookies.get('refreshCookie')).then(function(response) {
			console.log(response.data);
			Spotify.setAuthToken(response.data);
		});
		initialize($scope.user);
		$route.reload();
	};

	if (annyang.isListening()) {
		$scope.recording = true;
		$scope.$apply();
	}
	else {
		$scope.recording = false;
	}


	$scope.voiceRedirect = function($event) {
		if ($event.which == 13) {

			$scope.recording = !$scope.recording;
			if ($location.path() == '/app/voice') {
				$route.reload();
			}
			else {
				$location.path('/app/voice');
			}
		}
	};

	$scope.changeState = function() {
		if (annyang.isListening()) {
			$scope.recording = true;
		}
		else {
			$scope.recording = false;
		}
		if ($location.path() == '/app/voice') {
			$route.reload();
		}
		else {
			$location.path('/app/voice');
		}
	};

}