/**
 * grab some basic process stuff safely at startup
 *
 * @module
 */

declare var process: NodeJS.Process & {
  _exiting: boolean
  reallyExit(exitCode: string | number): never
}

/**
 * A reference to the global `process` object, if available
 */
export const proc =
  typeof process === 'object' && process ? process : undefined
/**
 * A reference to `process.argv`, if available
 */
export const [execArgv, argv] = proc
  ? (() => {
    if (process.versions.electron) {
      let i = 1;
      for (i = 1; i < proc.argv.length; ++i) {
        const arg = proc.argv[i];
        if (!arg || !(arg.startsWith('--') || arg.startsWith('-')) || arg === '--') {
          break;
        }
        if (arg === '-r' || arg === '--require') {
          ++i;
          continue;
        }
      }
      return [proc.argv.slice(1, i), [proc.argv0, ...proc.argv.slice(i)]];
    }
    return [proc.execArgv, proc.argv];
  })()
  : [[], []]

/**
 * A reference to `process.cwd()`, if available. Note that this is not
 * updated if `process.chdir()` is called.
 */
export const cwd = proc?.cwd?.() || '.'
/**
 * A reference to `process.env`, if available.
 */
export const env = proc?.env || {}
