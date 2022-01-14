export namespace PATHS {
    export { cwd };
    export { root };
    export const cwdNodeModules: string;
    export const nodeModules: string;
    export const clientCore: string;
    export const clientCoreOutput: string;
    export const srcOutput: string;
    export const demoProject: string;
    export const build: string;
    export const staticServer: string;
}
export namespace LOC_NAMES {
    const PACKAGE_JSON: string;
    const ESLINT_JSON: string;
    const TS_JSON: string;
    const TS_GLOBAL_TYPES: string;
    const TS_ESLINT_JSON: string;
    const NODE_MODULES: string;
    const CLIENT_CORE_DIR_NAME: string;
    const CLIENT_CORE_OUTPUT_DIR_NAME: string;
    const SRC_OUTPUT: string;
    const SRC_DIR_NAME: string;
}
export namespace DEFAULT_RUN_PARAMS {
    export const isServer: boolean;
    export const isBuild: boolean;
    export const isProd: boolean;
    export { _isSelfDevelopment };
}
export namespace DEFAULT_CONFIG {
    export const staticDir: string;
    export namespace server {
        const host: string;
        const port: number;
    }
    export namespace build_1 {
        namespace input {
            const include: string[];
            const html: string;
            const js: string;
        }
        namespace output {
            const publicPath: string;
            const target: string;
            namespace filenames {
                namespace PROD {
                    export const assets: string;
                    const js_1: string;
                    export { js_1 as js };
                    export const js_chunk: string;
                    export const styles: string;
                    export const styles_chunk: string;
                    export const brotli: string;
                    export const gzip: string;
                }
                namespace DEV {
                    const assets_1: string;
                    export { assets_1 as assets };
                    const js_2: string;
                    export { js_2 as js };
                    const js_chunk_1: string;
                    export { js_chunk_1 as js_chunk };
                    const styles_1: string;
                    export { styles_1 as styles };
                    const styles_chunk_1: string;
                    export { styles_chunk_1 as styles_chunk };
                }
            }
        }
        const eslint: boolean;
        const aliases: {};
    }
    export { build_1 as build };
}
declare const cwd: string;
declare const root: string;
declare const _isSelfDevelopment: boolean;
export {};
