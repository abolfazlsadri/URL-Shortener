# Url Shortener

> [Node.js](http://nodejs.org) API for an URL shortener service with Mongodb, [Redis](http://redis.io) and Redis queue high performance.


## Using

* [Express 4](http://expressjs.com/)
* [Redis](http://redis.io)
* [MongoDb](https://www.mongodb.com/)

### Getting Started
 Below are instructions to kick start AutoMart in your local server.


 **First off, you must have node/npm installed. Install the latest node version [here](https://nodejs.org/en/download/). Not to worry, the npm package comes along with the node package**



##### This will be the file and folder structure

    URL-shortener
    ├── adapters
        └── mongoose.js  
    ├── config
        ├── app.js 
        ├── logger.js 
        ├── mongo.js 
        └── redis.js 
    ├── controller
        ├── urlController.js
        ├── urlLogController.js
        └── userController.js
    ├── helpers
        └── logger.js  
    ├── jobs 
        └── urlLog.jobs.js
    ├── logs
        ├── urlShortener-error.log
        └── urlShortener.log
    ├── middleware  
        └── auth.js 
    ├── models  
        ├── LogConstants.js
        ├── urlLog.model.js
        └── user.model.js
    ├── routes  
        ├── url.route,js
        └── user.route.js
    ├── services
        └── url.service.js
    ├── index.js
    ├── ecosystem.config.js
    ├── worker.js
    └── package.json                   
<hr/>

# Introduction

In this project we intend to provide a URL shortening service.This service requires information in addition to URL shortening Save users who have used our shortened URL and use it for analytics. Any new user can have an account in our service using their username and password. 
Users can sign in with authentication. User can only use email, username and password Create an account pass And must be able to login with a username and password, or an email and password.
User logged into the service, It can use it by converting its long URLs into short ones.
In this method the user additionally your primary URL, Can provide a string as a suggestion, in which case the service should refer to that string or similar Use the path title


### Analytics

This section should contain information about each of the shortened URLs, give it to the user who created it. This data must be returned to the user promptly, therefore, it should be made async and the summary of user transfer. This information includes the following are the parts that should be given today for today, and for the last day, week and month.

- Views per URL
    
    - All
    - Mobile-desktop separation
    - Separate browsers

- The number of individual users who request each URL

    - All
    - Mobile-desktop separation
    - Separate browsers

 
 ### Installation
 
 1. Clone this repository by running this on your terminal: `git clone https://github.com/abolfazlsadri/URL-Shortener.git`
 2. Navigate to the project's directory with: `cd URL-Shortener`
 3. Run `npm install` to install dependencies
 4. Run  `npm run start` to start the server on a local host

 ### License

Copyright © 2020, [Abolfazl sadri](https://github.com/abolfazlsadri).
Released under the [MIT License](LICENSE).