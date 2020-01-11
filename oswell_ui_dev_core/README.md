- Project structure:
    - `dev_tools` - folder to keep all files related to nodejs server and build process:
        - `index.js` - dev_tools entrypoint. You may run this script with the following arguments:
            - `-b` - build a project with webpack.
            - `-s` - start express nodejs server.
        or use it as through `require`. Module provide `run` method that accepts lib config as first argument and run params as second
        - `server.js` - provides API to run express server with optional middlewares.
        - `webpack.js` - provides API to build project and to retrieve build dev middlewares.
        - `pm2.js` - run `npm run serv` command as pm2 process.

    - `ui-core` - ui library of usefull tools, react components, redux / hook store creators. 