import path from 'path'
import * as td from 'typedoc'

import { PATHS } from './core/constants'


const app = await td.Application.bootstrapWithPlugins(
    {
        entryPoints: [
            path.join(PATHS.SHARED_UTILS)
        ],
        out: 'docs',
        entryPointStrategy: 'resolve'
    },
    [
        new td.TypeDocReader(),
        new td.TSConfigReader(),
        new td.PackageJsonReader()
    ]
)


const project = await app.convert()

if (project) {
    await app.generateDocs(project, 'docs')
}