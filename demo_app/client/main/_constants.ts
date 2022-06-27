const GIT_PATHS = {
    ROOT: 'https://github.com/cybercookie/siegel',
    FILES_PREFIX: '/tree/master/',
    CLIENT_CORE: {
        ROOT: 'client_core',
        UI: 'ui'
    },
    SRC: {
        ROOT: 'core'
    },
    COMMON: {
        ROOT: 'common'
    }
} as const


export { GIT_PATHS }