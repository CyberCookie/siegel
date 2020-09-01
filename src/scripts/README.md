# Scripts
There are three scripts which could help you to automate some routines:

## init_project.js
Must be runed at project root level where package.json is. This script creates production ready project with predefined folder structure including already configured essence to provide the best expirience. Also it creates npm script commands in your package.json (read in apendix section) that cover mostly all the cases you will need during development.
The script accepts parameters:
- __--peers__ - to install peer dependencies
- __--run__ - to run a project in development mode right after project was created and peer dependencies was installed (if __--peers__ parameter had been passed)

## createSSL.js
Creates localhost ssl certificates to be used on server side if you had choosen secure protocol.
Also it ceates authority certificate for testing purposes to be imported in chrome browser or another.

## install_peers.js
Essence has some peer dependencies to make eslint and typescript work
Sad but these dependencies you should resolve manually.
Using this script it's become easy to install all the necessary peer dependencies.
Peer dependency won't be installed if you already have such one with a version higher than used in essence.