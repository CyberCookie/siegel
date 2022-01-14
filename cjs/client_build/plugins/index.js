"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mergePlugins = require('./merge');
const getDefaultPlugins = require('./defaults');
module.exports = (CONFIG, RUN_PARAMS) => mergePlugins(getDefaultPlugins(CONFIG, RUN_PARAMS), CONFIG.build.plugins);
