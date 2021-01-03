const mergeModules = require('./merge');
const getDefaultModules = require('./defaults');
module.exports = (CONFIG, RUN_PARAMS, dependencies) => mergeModules(getDefaultModules(CONFIG, RUN_PARAMS, dependencies), CONFIG.build.modules);
