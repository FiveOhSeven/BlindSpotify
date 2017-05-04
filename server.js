var http = require('http');
var path = require('path');
var express = require('express');
var router = express();
var server = http.createServer(router);
var SpotifyWebApi = require('spotify-web-api-node');

router.use(express.static(path.resolve(__dirname, 'client')));

var spotifyApi = new SpotifyWebApi({
	clientId: 'client_id',
	clientSecret: 'client_secret',
	redirectUri: 'callback_uri'
});

var scopes = ['user-read-private',
	'user-library-read',
	'user-top-read',
	'playlist-read-private'
];

//OAuthentication

router.use('/login', function(req, res) {
	var authorizeURL = spotifyApi.createAuthorizeURL(scopes) + '&show_dialog=true';
	res.redirect(authorizeURL);
});

router.use('/callback', function(req, res) {
	var code = req.query.code;
	spotifyApi.authorizationCodeGrant(code).then(function(data) {
		spotifyApi.setAccessToken(data.body.access_token);
		spotifyApi.setRefreshToken(data.body.refresh_token);
	});
	res.redirect('/app');
});

//Routing

router.use('/app*', function(req, res, next) {
	res.sendFile(__dirname + '/client/app.html');
});

//RESTful endpoints
router.post('/token/access', function(req, res) {
	var tempObject = {};
	tempObject.access_token = spotifyApi.getAccessToken();
	tempObject.refresh_token = spotifyApi.getRefreshToken();
	spotifyApi.resetAccessToken();
	spotifyApi.resetRefreshToken();
	res.json(tempObject);
});

router.post('/token/refresh', function(req, res) {
	var x = req.headers.cookie.split('=');
	spotifyApi.setRefreshToken(x[1]);
	spotifyApi.refreshAccessToken().then(function(data) {
		spotifyApi.setAccessToken(data.body['access_token']);
		var l = spotifyApi.getAccessToken();
		spotifyApi.resetAccessToken();
		spotifyApi.resetRefreshToken();
		res.json(l);
	}, function(err) {
		res.send('Unable to refresh token ' + err);
	});
});

//all other routes get the login
router.get('*', function(req, res) {
	res.sendFile(__dirname + '/login.html');
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
	var addr = server.address();
	console.log("Listening at", addr.address + ":" + addr.port);
});