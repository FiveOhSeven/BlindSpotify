angular.module('voiceModule', []).config(router);

function router($routeProvider) {
	$routeProvider
		.when('/app/voice', {
			templateUrl: '/modules/voice/voice.html',
			controller: 'voiceController'
		});
}