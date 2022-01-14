"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mergeModules = require('./merge');
const getDefaultModules = require('./defaults');
module.exports = (CONFIG, RUN_PARAMS) => mergeModules(getDefaultModules(CONFIG, RUN_PARAMS), CONFIG.build.modules);
