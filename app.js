// See https://developer.github.com/v3/oauth/

var express = require('express');
var exphbs  = require('express-handlebars');
var https = require('https');
var querystring = require('querystring');
var url = require('url');

var appName = 'github-oauth-sample';
var clientId = '';
var clientSecret = '';

var requestedScope = 'user:email';
var state = 'RANDOM-STRING';

var authorizeCallbackUri = 'http://localhost:3000/authorize_callback';

function buildGitHubAuthorizeUrl (redirectUri) {
    return url.format({
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/login/oauth/authorize',
        query: {
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: requestedScope,
            state: state
        }
    });
}

function getGitHubAccessToken (code, callback) {
    var options = {
        hostname: 'github.com',
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var postData = querystring.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
    });

    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            callback(querystring.parse(chunk));
        });
    });

    req.write(postData);
    req.end();
}

function getGitHubUser (accessToken, callback) {
    var options = {
        hostname: 'api.github.com',
        path: '/user',
        headers: {
            'User-Agent': appName,
            'Authorization': 'token ' + accessToken
        }
    };

    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            callback(JSON.parse(chunk));
        });
    });

    req.end();
}

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.redirect(buildGitHubAuthorizeUrl(authorizeCallbackUri));
});

app.get('/authorize_callback', function (req, res) {
    getGitHubAccessToken(req.param('code'), function (accessTokenData) {
        getGitHubUser(accessTokenData.access_token, function (userData) {
            res.render('user', {
                accessToken: accessTokenData.access_token,
                grantedScope: accessTokenData.scope,
                tokenType: accessTokenData.token_type,
                userData: JSON.stringify(userData, null, 4)
            });
        });
    });
});

app.listen(3000);
