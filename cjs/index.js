'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
process.on('warning', console.warn);
process.on('uncaughtException', console.error);
const { PATHS } = require('./constants');
const normalizeConfigs = require('./normalize_configs');
async function main(_CONFIG, _RUN_PARAMS) {
    const { CONFIG, RUN_PARAMS } = normalizeConfigs(_CONFIG, _RUN_PARAMS);
    const { isBuild, _isDevServer, isServer } = RUN_PARAMS;
    let devMiddlewares = [];
    if (isBuild) {
        const { run, getDevMiddlewares } = require(PATHS.build)(CONFIG, RUN_PARAMS);
        await run();
        if (_isDevServer) {
            devMiddlewares = Object.values(getDevMiddlewares());
        }
    }
    if (isServer) {
        const devServer = require(PATHS.staticServer);
        const { appServerLoc, watch } = CONFIG.server;
        function createDevServer() {
            let appServer;
            if (appServerLoc) {
                try {
                    appServer = require(appServerLoc);
                    if (typeof appServer != 'function') {
                        throw '[appServerLoc] export type is not a function';
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
            return devServer.run(CONFIG, devMiddlewares, appServer);
        }
        let devServerInstance = createDevServer();
        if (watch && appServerLoc) {
            const { statSync, readdir, watch } = require('fs');
            const { join, dirname } = require('path');
            let lock = null;
            const serverInstanceDir = dirname(appServerLoc);
            function clearCachedDependencies({ filename }) {
                const cachedFile = require.cache[filename];
                if (cachedFile && filename.startsWith(serverInstanceDir)) {
                    const cacheChildren = cachedFile.children;
                    delete require.cache[filename];
                    cacheChildren.forEach(clearCachedDependencies);
                }
            }
            function stopDevServerInstance() {
                const userModuleEntry = require.cache[appServerLoc];
                userModuleEntry && clearCachedDependencies(userModuleEntry);
                devServerInstance.close();
                devServerInstance = createDevServer();
                lock = null;
            }
            function onChange() {
                lock || (lock = setTimeout(stopDevServerInstance, 100));
            }
            function applyWatchListener(filePath) {
                if (statSync(filePath).isDirectory()) {
                    readdir(filePath, (err, dirFiles) => {
                        err
                            ? console.error(err)
                            : dirFiles.forEach((f) => {
                                applyWatchListener(join(f, filePath));
                            });
                    });
                }
                else
                    watch(filePath).on('change', onChange);
            }
            applyWatchListener(appServerLoc);
        }
    }
}
if (require.main == module)
    main();
else {
    module.exports = main;
    module.exports.proxyReq = require('./server/proxy');
    module.exports.buildConstants = require('./client_build/constants');
}
