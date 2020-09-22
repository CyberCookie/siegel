# siegel demo project
- To run the project in development mode: `npm run dev` (alias `npm run build_serv`).
- To build the project in dev/prod mode run `npm run build` / `npm run build:prod` accordingly.
- To host the project locally using NodeJS server (make sure you had built it first running one of the commands above) run `npm run serv` / `npm run serv:prod`.
- To build in prod mode and to host using `pm2` daemon - run `npm run build_serv:prod`.
- To validate the project code with eslint and typescript run `npm run validate`
- To deploy the project from scratch run `npm run deploy`. This script installs dependencies, siegel's peer dependencies and executes `npm run build_serv:prod` command from above.

Project structure:
- ./client - place for all the clientside related code and assets.
    - assets - place to keep all the static files which doesn't requires any transformations.
    - main - UI and business logic.
        - Layout - pages wrapper. Here you can add general components like header or footer to be displayed on every page.
        - components - if you have components that are used on multiple pages - here is the best place to put them. Also includes theming for siegel components.
        - pages - for a pages components.
        - modules - all the logic regarding application state management including api calls.
        - routes.tsx - siegel router config.
    - index.html - site entrypoint.
    - index.ts - JS entrypoint
    - global.d.ts
    - styles.sass - general styles that are not plugged in react components directly.
    - sw.js - service worker with uniq and the best caching strategy.
- ./server - application entrypoint, siegel config and server with demo endpoint are located here.
- .eslintrc - eslint config that extends siegel config.
- tsconfig.json - typescript config with predefined aliases. Extends siegel typescript config.