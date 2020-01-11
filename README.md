This is Oswell WebApp template with demo app and `oswell_ui_dev_core` as future npm module.

- Install NodeJS.
- From working directory open terminal and run to install all dependencies `npm i`.


- List and explanation of npm commands in package.json:
    - To build a project you may run `npm run build` / `npm run build:prod`.
    - To host a project you may run `npm run serv` / `npm run serv:prod`.
    - To start a project in development watch mode run `npm run dev` [alias `npm run build_serv`].
    - To deploy project from scratch run `npm run deploy`. It installs all the dependencies, in production mode builds project and hosts it using express server wrapped in pm2 daemon.
    - To do the same as `npm run deploy` but whithout node_modules installation run `npm run build_serv:prod`