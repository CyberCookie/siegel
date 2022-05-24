# Siegel demo project

Requirements:
- NodeJS >= 16
- NPM => 7

<br />

Install dependencies with `npm i`.
<br /><br />


<br />

## package.json scripts:

- To run the project in development mode: `npm start`.
- To build client for production run `npm run build_web`.
- To transpile server app from TS run `npm run build_node`.
- `npm run build` &nbsp;=&nbsp; `npm run build_web` &nbsp;+&nbsp; `npm run build_node`.
- To host the project locally run `npm run serv`<br />
    To use this command first ensure you built a client using `npm run build_web`.
- To build in prod mode and to host using `pm2` daemon - run `npm run build_serv`.
- To validate the project code with eslint and typescript run `npm run validate`.
- To deploy the project from scratch run `npm run deploy`<br />
    This script installs dependencies and executes `npm run build_serv` command from above.
- To debug your NodeJS application run `npm run debug`<br />
    Site will be ran in dev mode with NodeJS inspector atttached to your browser dev tool.


<br />

## Project structure

- `client` - clientside related code and assets.
    - `assets` - static files which doesn't requires any transformations.
        - `copy` - assets in this folder was copied by `WebpackCopyPlugin` to the output folder.
    - `main` - UI and business logic.
        - `network` - setup client-server networking.
        - `modules` - api calls and app state manager using siegel's `Request` and `Hook Store`.
        - `Router` - demo routing with siegel's `react-router wrapper`.
        - `Layout` - pages wrapper. Components like header, footer etc..
        - `components` - app level components, icons, raw siegel's `components theming`.
        - `pages` - app pages.
            - Home - welcome demo page.
            - DemoComponents - demo of all the themed components with their variations.
            - DemoApi - test api example.
        - `styles` - app common styles
    - `index.html` - site entrypoint.
    - `index.ts` - JS entrypoint.
    - `global.d.ts` - global typescript declarations.
    - `styles.sass` - styles that are not plugged in react components directly.
    - `sw.js` - service worker with uniq and the best caching strategy.
- `server` - application entrypoint, siegel config and server with demo endpoint.
- `dto` - shared client-server api contracts types.
- `.eslintrc` - eslint config.
- `tsconfig.eslint.json` - eslint typescript config.
- `tsconfig.json` - typescript config with predefined aliases.