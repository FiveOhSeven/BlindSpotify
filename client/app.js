var mainApp = angular.module('mainApp',[
    'ngRoute',
    'luegg.directives',
    'songModule',
    'playlistModule',
    'homeModule',
    'queueModule',
    'albumModule',
    'myAlbumsModule',
    'affinityModule',
    'voiceModule',
    'spotify',
    'ngAudio',
    'ngCookies'
    ]);

// Disable hashbanging
// Routes will be handled by each module rather than a large routing list
mainApp.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
    $routeProvider.otherwise({
        redirectTo: '/app'
    });
});

mainApp.run(function($rootScope){
    $rootScope.conversation = [];
})