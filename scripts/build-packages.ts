#!/usr/bin/env node

import * as path from 'path';
import * as ngPackage from 'ng-packagr';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function buildUtils() {
    const utilsPath = path.resolve(__dirname, '../packages/utils');
    try {
        console.log('------------------------------------------------------------------------------');
        console.log("Building entry point '@ai-table/utils'");
        console.log('------------------------------------------------------------------------------');
        await execAsync('npm run build', { cwd: utilsPath });

        console.log('✅ Utils package built successfully');
    } catch (error) {
        console.error('❌ Error building utils package:', error);
        process.exit(1);
    }
}

const packages = ['grid', 'state'];

async function buildNgPackages() {
    for (const pkg of packages.filter((p) => p !== 'utils')) {
        const target = path.resolve(__dirname, `../packages/${pkg}`);
        await ngPackage
            .ngPackagr()
            .forProject(path.resolve(target, 'ng-package.json'))
            .withTsConfig(path.resolve(target, 'tsconfig.lib.json'))
            .build()
            .then(() => console.log(`✅ ${pkg} package built successfully`))
            .catch((error) => {
                console.error(`❌ Error building ${pkg} package:`, error);
                process.exit(1);
            });
    }
}

async function buildAll() {
    await buildUtils();
    await buildNgPackages();
}

buildAll();
