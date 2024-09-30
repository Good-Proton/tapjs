import { resolveImport } from 'resolve-import';

const electronTestRx = /\.(e|electron)(\.spec)?\.[mc]?(js|ts)x?$/i;

export function isElectronTest(testFilePath: string) {
    return electronTestRx.test(testFilePath);
}

export async function getElectronBin(testFilePath: string) {
    if (process.versions.electron) {
        return process.execPath;
    } else {
        // @ts-ignore
        const { default: electron } = await import(await resolveImport('electron', testFilePath));
        return electron;
    }
}

export async function getElectronVersion(testFilePath: string) {
    const electronVersion = process.versions.electron ||
        (await import(
            // @ts-ignore
            await resolveImport('electron/package.json', testFilePath),
            { assert: { type: 'json' } }
        )).default.version;

    const [, majorS, minorS, patchS] = /^(\d+)\.(\d+)\.(\d+)/.exec(electronVersion) || ['', '', '', ''];

    const major = Number(majorS);
    const minor = Number(minorS);
    const patch = Number(patchS);

    if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
        throw new Error('cannot determine electron version');
    }

    return { major, minor, patch };
}
