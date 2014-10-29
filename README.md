GitHub OAuth2 Sample
====================

A non-production quality code, happy path only, sample Node.js web application to retrieve user information from GitHub using OAuth2.

This application was created as a learning exercise. It follows the OAuth2 protocol as presented in https://developer.github.com/v3/oauth/

1. Register an application on GitHub
    1. Go to Settings/Applications
    1. Click "Register new application"
    1. Fill in the Application name (such as github-oauth-sample)
    1. Fill in a Homepage URL (I used https://github.com/simonbates)
    1. For Authorization callback URL, use http://localhost:3000/
    1. Click "Register application"
1. Make a note of the Client ID and Client Secret
1. Set the appName, clientId, and clientSecret variables in app.js
1. npm install
1. node app.js
1. Point your browser to http://localhost:3000/
