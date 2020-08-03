# Website
The website is available [here](https://devwebapp.herokuapp.com "website").

# Backend

Uncle Bob's clean architecture implementation in nodejs/express/mongoose

# Frontend

Angular 8 application built in the lazy loading architecture

**Features**

- lazy-loading of admin and feature modules
- lazy reducers
- localStorage ui state persistence
- `@ngrx/effects` for API requests
- fully responsive design
- angular-material and custom components in `SharedModule`

**Stack**

- Angular
- ngrx (or try [ngx-model](https://github.com/tomastrajan/ngx-model) if you prefer less boilerplate)
- Angular Material
- Bootstrap 4

# Usage

#### Prerequisites
* [Git](https://git-scm.com/downloads)
* [Node JS](https://nodejs.org/en/)
* [Mongo DB](https://www.mongodb.com) (As a MongoDB interface, you can install MongoDB Compass)
* [Angular](https://angular.io/guide/setup-local)

## Running Locally

> The backend 
#### 1. Clone the repo and install dependencies

```bash
git clone 
cd mean-stack-web-app
npm i
```
#### 2. Modify the .env file
Save `.env.sample` as `.env` and then add your database and other variables

#### 3. Startup your MongoDB
Usually this is just: `mongod` on the command line. Or use MongoDB Compass

#### 4. Start the server
To run in development mode where code is run 
by [babel-node](https://babeljs.io/docs/en/babel-node) via [nodemon](https://nodemon.io) 
and re-transpiled any time there is a change:
```bash
npm run dev
```

To run in production mode where code is transpiled by Babel into a `dist` folder and run directly in `node`:
```bash
npm run prod
```

## Useful Commands

- `npm run test:e2e` - runs e2e test and opens chrome to run tests
- `npm run cover:unit:nyc` - runs unit tests and uses Istanbul as a code coverage reporter
- `npm run cover:unit:mocha` - runs unit tests and uses mochawesome as a custom reporter
- `npm run test:integration` - runs integration tests for the backend
- `npm run test:integration:watch` - runs integration tests in watch mode

> The frontend

#### 1. install dependencies

```bash
git clone 
cd client-side
npm i
```

#### 2. Start the application

```bash
npm run start
```

#### 2. Build the application for production use

```bash
npm run build
```

# Built With

> [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) 

# API

Documentation available [here](https://danny00747.github.io/mean-stack-web-app/ "api doc")

# Integration Test Code Coverage 

[![Netlify Status](https://api.netlify.com/api/v1/badges/bdf7e790-329b-4be4-82bc-b620617bd4b3/deploy-status)](https://app.netlify.com/sites/test-coverage/deploys)

The code coverage available [here](https://test-coverage.netlify.app/ "test coverage")

# Integration Test Report 

[![Netlify Status](https://api.netlify.com/api/v1/badges/bdf7e790-329b-4be4-82bc-b620617bd4b3/deploy-status)](https://app.netlify.com/sites/test-coverage/deploys)

Integration tests report available [here](https://tests-report.netlify.app/ "integration tests report")


# End to End Test Report 

[![Netlify Status](https://api.netlify.com/api/v1/badges/7c021d3d-9a2a-4463-97b0-5a37852a2a71/deploy-status)](https://app.netlify.com/sites/e2e-report/deploys)

E2E tests report available [here](https://e2e-report.netlify.app/ "e2e tests")

# End to End Tests Live Demo 

E2E tests live demo [here](https://www.youtube.com/watch?v=mJZop5IRazU&feature=youtu.be "live demo")

# Lighthouse Report 

[![Netlify Status](https://api.netlify.com/api/v1/badges/7c121a15-2bf5-42f1-bdc3-b96a9a515bba/deploy-status)](https://app.netlify.com/sites/lighthouse-report/deploys)

Lighthouse Report available [here](https://lighthouse-report.netlify.app/ "lighthouse report")

