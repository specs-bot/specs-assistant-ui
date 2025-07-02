import * as esbuild from 'esbuild'
import { copyFile, rmdir } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path';

const HOST = '127.0.0.1';
const PORT = 3000;
const OUT_DIR = 'dist';
const MAIN_ENTRY = 'src/main.tsx';

const vendors = {
    entry: 'src/vendors.ts',
    deps: ['react', 'react-dom']
};

/**
 * TODO
 * Hot reload 
 * Hot Module Replacement
 * Почему работает
 */

(async () => {
    await prepareDist()
    let context = await esbuild.context({
        entryPoints: [MAIN_ENTRY, vendors.entry],
        bundle: true,
        outdir: OUT_DIR,
        splitting: true,
        format: 'esm',
        sourcemap: true
    })

    await context.serve({
        servedir: OUT_DIR,
        host: HOST,
        port: PORT,
        onRequest: (request) => {
            // TODO Spa mode
        }
    })

    await context.watch()
    console.log(`Server running at http://${HOST}:${PORT}`);
})()

async function prepareDist() {
    if (existsSync(OUT_DIR)) {
        await rmdir(OUT_DIR, { recursive: true, force: true })
    }
    mkdirSync(OUT_DIR);
    await initRootHTML()
}

async function initRootHTML() {
    const FILE_NAME = 'index.html'
    try {
        await copyFile(FILE_NAME, path.join(OUT_DIR, FILE_NAME));
    } catch (error) {
        console.error(error);
    }
}

async function initVendors(params) {

}


