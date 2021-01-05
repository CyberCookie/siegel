<h1>Siegel demo project</h1>

- To run the project in development mode: `npm start` (alias `npm run build_serv`).
- To build the project in dev/prod mode run `npm run build` / `npm run build:prod` accordingly.
- To transpile server app from TS run `npm run build_node`.
- To host the project locally using NodeJS server (make sure you had built it first running one of the commands above) run `npm run serv` / `npm run serv:prod`.
- To build in prod mode and to host using `pm2` daemon - run `npm run build_serv:prod`.
- To validate the project code with eslint and typescript run `npm run validate`
- To deploy the project from scratch run `npm run deploy`. This script installs dependencies, siegel's peer dependencies and executes `npm run build_serv:prod` command from above.
- To debug your NodeJS application run `npm run debug`. Site will be ran in dev mode with NodeJS inspector atttached to your browser dev tool.

<br />
<h2>Project structure</h2>

- <b>./client</b> - place for all the clientside related code and assets.
    - <b>assets</b> - place to keep all the static files which doesn't requires any transformations.
    - <b>main</b> - UI and business logic.
        - <b>Layout</b> - pages wrapper. Here you can add common components like header or footer to be displayed on every page.
        - <b>components</b> - if you have components that are used on multiple pages - here is the best place to put them. Also includes theming for siegel components and icons declarations.
            - theme - here we add default styles and props to the raw siegel's components making them ready to use in our demo application.
            - icons - the best place to keep your icons.
        - <b>pages</b> - for a page components.
            - Home - welcome demo page.
            - DemoComponents - demo of all the themed siegel's components with their variations.
            - DemoApi - example of how to use modules.
        - <b>modules</b> - all the logic regarding application state management including api calls.
        - <b>routes.tsx</b> - siegel router config.
    - <b>index.html</b> - site entrypoint.
    - <b>index.ts</b> - JS entrypoint.
    - <b>global.d.ts</b> - imports siegel's globals. Here you can add your own global declarations.
    - <b>styles.sass</b> - general styles that are not plugged in react components directly.
    - <b>sw.js</b> - service worker with uniq and the best caching strategy.
- <b>./server</b> - application entrypoint, siegel config and server with demo endpoint are located here.
- <b>.eslintrc</b> - eslint config that extends siegel config.
- <b>tsconfig.json</b> - typescript config with predefined aliases. Extends siegel typescript config.