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

## Linting and Formatting

ESLint and Prettier are employed for linting and formatting. Implemented following this guide:
https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/

It's recommended you install the following VSCode Extensions:

- [ESLint](https://open-vsx.org/extension/dbaeumer/vscode-eslint) VSCode extension.
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### Manual Lint w/ ESLint

`npm run lint`

### Manual Format w/ Prettier

`npm run format`
