# Siegel demo project

Requirements:
- NodeJS >= 16
- NPM => 7

<br />

Install dependencies with `npm i`.
<br /><br />


<br />

## package.json scripts:

- `npm start` - run the project in `development mode` 

- `npm run build` - build client for `production`

- `npm run serv` - host the project `locally`<br />
    To use this command `first ensure` you built your client with `npm run build`<br />

- `npm run build_node` - transpile server `ts` to server `js`

- `npm run build_serv` - build and host in `production` mode using `local static server` 

- `npm run validate` - validate the project code with `eslint` and `typescript`

- `npm run deploy` - perform deploy actions<br />
    This includes `clean install` and `client build`


<br /><br />

### To run above commands on `Windows`, you should first `download bash terminal` (git bash, for example)
### and set it up by running the next command:<br />
### `npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"`


<br />

## Project structure

- `client` - clientside related code and assets
    - `assets` - static files which doesn't requires any transformations
        - `copy` - assets in this folder was copied by `WebpackCopyPlugin` to the output folder
    - `main` - UI and business logic
        - `network` - setup client-server networking
        - `modules` - api calls and app state manager using Siegel's `Request` and `Hook Store`
        - `Router` - demo routing with Siegel's `react-router wrapper`
        - `Layout` - pages wrapper. Components like header, footer etc.
        - `components` - app level components, icons, raw Siegel's `components theming`
        - `pages` - app pages
            - Home - welcome demo page
            - DemoComponents - demo of all the themed components with their variations
            - DemoApi - test api example
        - `styles` - app common styles
    - `index.html` - site entrypoint
    - `index.ts` - JS entrypoint
    - `global.d.ts` - global typescript declarations
    - `styles.sass` - styles that are not plugged in react components directly
    - `sw.js` - service worker with uniq and the best caching strategy
- `server` - application entrypoint
    - `app_server.ts` -  Siegel static server extender
    - `index.ts` - demo app entrypoint with Siegel config
- `dto` - shared client-server api contracts types
- `.eslintrc` - eslint config
- `tsconfig.eslint.json` - eslint typescript config
- `tsconfig.json` - typescript config with predefined aliases