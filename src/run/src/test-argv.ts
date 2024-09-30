// the arguments when running test files, abstracted from run.ts for testing
import type { LoadedConfig } from '@tapjs/config'
import {
  execArgv,
  importLoaders,
  loaderFallbacks,
  loaders,
  requireRegisters,
} from '@tapjs/test'
import module from 'node:module'
import { resolveImport } from 'resolve-import'

// if we have Module.register(), then use --import wherever possible
const useImport = !!(module as { register?: (...a: any) => any })
  .register

const testModule = String(
  await resolveImport('@tapjs/test', import.meta.url),
)

const resolveLoaders = (loaders: string[]) =>
  Promise.all(
    loaders.map(async loader =>
      String(await resolveImport(loader, testModule)),
    ),
  )
const importScripts = await resolveLoaders(
  useImport ? importLoaders : [],
)
const loaderScripts = await resolveLoaders(
  useImport ? loaders : loaderFallbacks,
)

const pi =
  useImport ?
    `--import=${await resolveImport(
      '@tapjs/processinfo/import',
      import.meta.url,
    )}`
    : `--loader=${await resolveImport(
      '@tapjs/processinfo/loader',
      import.meta.url,
    )}`

const always = [
  ...importScripts.map(l => `--import=${l}`),
  ...loaderScripts.map(l => `--loader=${l}`),
  ...(useImport && !loaderScripts.length ? [] : ['--no-warnings']),
  '--enable-source-maps',
  // ensure this always comes last in the list
  pi,
]

const alwaysElectron27 = [
  ...requireRegisters.reduce((acc, l) => [...acc, '-r', l], [] as string[]),
  '--enable-source-maps',
  // ensure this always comes last in the list
  '-r', '@tapjs/processinfo/register',
];

export const testArgv = (config: LoadedConfig, electron27 = false) => {
  // Electron 27 and lower does not support `--loader` or `--import`
  // need to use `--require`
  if (electron27) {
    return [
      ...alwaysElectron27,
      ...execArgv(config.values),
      ...(config.get('node-arg') || []),
    ]
  }
  return [
    ...always,
    ...execArgv(config.values),
    ...(config.get('node-arg') || []),
  ]
}
