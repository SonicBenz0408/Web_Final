# VTDD - Collect the Streams of Vtubers

## Website Name ( zh ) : ⭐夸黑退散⭐

## Deploy Services : 
* Frontend : https://vtdd.vercel.app/  (Vercel)
* Backend :  https://vtdd.herokuapp.com/ (Heroku)

## Introduction
### Why we design this website?
* When you want to watch Vtuber's stream, you may need to search who is streaming now. But with VTDD, you can immediately know who is streaming and the time of the upcoming streams.

### Functions
* Have your own account (with password).
* Choose the Vtubers you like.
* Only show the stream of your favorite Vtuber.

### Techniques
* Frontend : React.js , React.Router ,  Websocket as client
* Backend : Puppeteer as crawler, BCrypt as login system, WebsocketServer
* Database : MongoDB

## How to Use This Website
* Click top-right to login.
![](https://i.imgur.com/RVLGrp1.png)
* Register and login.
![](https://i.imgur.com/V58Hx2b.png)
* Choose your favors. (Reset is to back to your original favor.)
![](https://i.imgur.com/XFywXGE.png)
* Enjoy the streams! Everyone is DD !
![](https://i.imgur.com/xUPwPyw.png)
* Also can see the channel list ~~~
![](https://i.imgur.com/wfkj5wI.png)

## Branch : 
1. master : Total codes (for deploy on localhost)
2. front : To deploy on Vercel (frontend)
3. heroku : To deploy on Heroku (backend)

## Warning :
* If you want to deploy on localhost, remember to change the websocket client and server url.
* If you want to deploy server on Heroku, due to region problem, you should use the code in "heroku" branch (To get correct time).

## Reference :
* https://holodex.net/