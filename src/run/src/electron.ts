import { resolveImport } from 'resolve-import';
import { promises as fsp } from 'node:fs';
import { fileURLToPath } from 'node:url';

const electronTestRx = /\.(e|electron)(\.spec)?\.[mc]?(js|ts)x?$/i;

export function isElectronTest(testFilePath: string) {
    return electronTestRx.test(testFilePath);
}

export async function getElectronBin(testFilePath: string) {
    if (process.versions.electron) {
        return process.execPath;
    } else {
        const { default: electron } = await import((await resolveImport('electron', testFilePath)) as string);
        return electron;
    }
}

export async function getElectronVersion(testFilePath: string) {
    const electronVersion = process.versions.electron || await (async () => {
        const packageJSONpath = fileURLToPath(await resolveImport('electron/package.json', testFilePath));
        const json: { version: string } = JSON.parse(await fsp.readFile(packageJSONpath, 'utf-8'));
        return json.version;
    })()

    const [, majorS, minorS, patchS] = /^(\d+)\.(\d+)\.(\d+)/.exec(electronVersion) || ['', '', '', ''];

    const major = Number(majorS);
    const minor = Number(minorS);
    const patch = Number(patchS);

    if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
        throw new Error('cannot determine electron version');
    }

    return { major, minor, patch };
}
