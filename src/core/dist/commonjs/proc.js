"use strict";
/**
 * grab some basic process stuff safely at startup
 *
 * @module
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.cwd = exports.argv = exports.execArgv = exports.proc = void 0;
/**
 * A reference to the global `process` object, if available
 */
exports.proc = typeof process === 'object' && process ? process : undefined;
/**
 * A reference to `process.argv`, if available
 */
_a = exports.proc
    ? (() => {
        if (process.versions.electron) {
            let i = 1;
            for (i = 1; i < exports.proc.argv.length; ++i) {
                const arg = exports.proc.argv[i];
                if (!arg || !(arg.startsWith('--') || arg.startsWith('-')) || arg === '--') {
                    break;
                }
                if (arg === '-r' || arg === '--require') {
                    ++i;
                    continue;
                }
            }
            return [exports.proc.argv.slice(1, i), [exports.proc.argv0, ...exports.proc.argv.slice(i)]];
        }
        return [exports.proc.execArgv, exports.proc.argv];
    })()
    : [[], []], exports.execArgv = _a[0], exports.argv = _a[1];
/**
 * A reference to `process.cwd()`, if available. Note that this is not
 * updated if `process.chdir()` is called.
 */
exports.cwd = exports.proc?.cwd?.() || '.';
/**
 * A reference to `process.env`, if available.
 */
exports.env = exports.proc?.env || {};
//# sourceMappingURL=proc.js.map