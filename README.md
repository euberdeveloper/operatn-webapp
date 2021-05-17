# operatn-webapp
This is the repo for the webapp of OperaTN.

## How was it made

These webapp was made by using:
* __Vue.js__ as framework: this is both because it was the choice of the first programmer and because is my preferred framework.
* __Vuetify__ as UI framework: this is both because it was the choice of the first programmer and because is arguably the most powerful UI framewok in absolute (if you like maerial design).
* __Typescript__ as language: this is because Typescript is the only way to have a decent code, which becomes robuster and easier to debug.

Other modules that were used:
* __operatn-api-client__ to make api calls, it is the npm client published from the operatn-api repo.
* __clipboard-copy__ to copy text to clipboard
* __pdfmake__ for generating pdf files

## How to start it

For dev:

* Create a `.env` file, by following the `.env.example` file, fill it with the proper values
* Run `npm install` to install the dependencies
* Run `npm run serve` to start the dev server

For production:

* Run `npm run build`
* Note that the real deploy is made with `docker`

## How is deployed

There is a `Dockerfile`, which is synced with `Dockerhub` and creates an image of the APIs.
