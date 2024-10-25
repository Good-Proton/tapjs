/**
 * grab some basic process stuff safely at startup
 *
 * @module
 */
/**
 * A reference to the global `process` object, if available
 */
export declare const proc: (NodeJS.Process & {
    _exiting: boolean;
    reallyExit(exitCode: string | number): never;
}) | undefined;
/**
 * A reference to `process.argv`, if available
 */
export declare const execArgv: string[], argv: string[];
/**
 * A reference to `process.cwd()`, if available. Note that this is not
 * updated if `process.chdir()` is called.
 */
export declare const cwd: string;
/**
 * A reference to `process.env`, if available.
 */
export declare const env: NodeJS.ProcessEnv;
//# sourceMappingURL=proc.d.ts.map