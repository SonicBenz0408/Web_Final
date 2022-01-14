# Deploy Backend On Heroku

## What are the backend doing?
1. Deal with login events.
2. Crawl the streams and the channel icons on Yoututbe.
3. Send the data to frontend.

## Tools
* Server : WebSocketServer
* Crawler : Puppeteer
* Platform : Heroku (with "heroku-ssl-redirect" (https://github.com/paulomcnally/node-heroku-ssl-redirect/))
* Database : MongoDB

## Requirements
1. Account of Heroku
2. Mongo Database (MONGO_URL)

## How to deploy to Heroku by yourself?
1. Login to your Heroku account.
2. Change "Config Vars" of MONGO_URL to your url.
3. Clone the repo to your own repo.
4. Use that repo to deploy.

## What we need to improve
* The speed of crawler is too slow......