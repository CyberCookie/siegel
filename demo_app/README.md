# Siegel demo project

Requirements:
- NodeJS >= 16
- NPM => 7

<br />

Install dependencies with `npm i`.
<br /><br />


<br />

## package.json scripts:

- To run the project in development mode: `npm start`
- To build client for production run `npm run build`
- To host the project locally run `npm run serv`<br />
    To use this command first ensure you built a client using `npm run build`
- To transpile server ts to server js run `npm run build_node`
- To build and host in prod mode using local static server run `npm run build_serv`
- To validate the project code with eslint and typescript run `npm run validate`
- To perform deploy actions run `npm run deploy`<br />
    This includes clean install and client build


<br />

To run above commands on Windows, you should first set npm bash shell<br />
by running the next command:<br />
`npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"`


<br />

## Project structure

- `client` - clientside related code and assets
    - `assets` - static files which doesn't requires any transformations
        - `copy` - assets in this folder was copied by `WebpackCopyPlugin` to the output folder
    - `main` - UI and business logic
        - `network` - setup client-server networking
        - `modules` - api calls and app state manager using siegel's `Request` and `Hook Store`
        - `Router` - demo routing with siegel's `react-router wrapper`
        - `Layout` - pages wrapper. Components like header, footer etc.
        - `components` - app level components, icons, raw siegel's `components theming`
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
    - `app_server.ts` -  siegel static server extender
    - `index.ts` - demo app entrypoint
    - `siegel_config.ts` - siegel config
- `dto` - shared client-server api contracts types
- `.eslintrc` - eslint config
- `tsconfig.eslint.json` - eslint typescript config
- `tsconfig.json` - typescript config with predefined aliases