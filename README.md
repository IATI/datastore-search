# IATI Datastore Search Web Application

## Package install
To install:

`npm install`
  
## Running local dev server

To run a development server using (`./envs/.env.development` vars):

`npm run dev`

To run a development server using (`./envs/.env.production` vars):

`npm run dev:production`

## Building for Deployment

To make a production build using (`./envs/.env.development` vars):

`npm run build:development`

To make a production build using (`./envs/.env.production` vars):

`npm run build:production`

To serve a production build locally for testing:

`npm run serve`

## Testing w/ Cypress

### Open Cypress UI

`npm run cy:open`

### Run Cypress Tests against local environment from Command Line

`npm run cy:run-ci`

### Run Cypress Tests against deployed development environment from Command Line

`npm run cy:run`
