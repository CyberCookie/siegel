# Scripts
There are three scripts which could help you to automate some routines.\
<b>All the next commands should be ran via bash terminal since scripts exec bash commands under the hood</b>

## init_project.js
Must be ran at project root level where package.json is. This script creates production ready project with predefined folder structure including already configured siegel to provide the best expirience. Also it creates npm script commands in your package.json that cover mostly all the cases you will need during development. More about these scripts read in [demo project section](https://github.com/CyberCookie/siegel/tree/master/__example).

The script accepts parameters:
- __--peers__ - to install peer dependencies
- __--run__ - to run a project in development mode right after project was created and peer dependencies was installed (if __--peers__ parameter had been passed)

## createSSL.js
Creates localhost ssl certificate to be used in siegel's static server.
Also it ceates authority certificate for testing purposes to be imported in chrome browser or another.

## install_peers.js
siegel has some peer dependencies to make eslint and typescript work.\
Sad but these dependencies you should resolve manually.
Using this script it's become easy to install all the necessary peer dependencies.
Peer dependency won't be installed if you already have such one with a version higher than used in siegel.