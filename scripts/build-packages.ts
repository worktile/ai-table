#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs';
import * as ngPackage from 'ng-packagr';

// const packagesPath = path.resolve(__dirname, '../packages');
// const packages = fs.readdirSync(packagesPath).filter((name) => fs.statSync(path.resolve(packagesPath, name)).isDirectory());
const packages = ['utils', 'grid', 'state'];

async function buildNgPackages() {
    for (const pkg of packages) {
        const target = path.resolve(__dirname, `../packages/${pkg}`);
        await ngPackage
            .ngPackagr()
            .forProject(path.resolve(target, 'ng-package.json'))
            .withTsConfig(path.resolve(target, 'tsconfig.lib.json'))
            .build()
            .then()
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
        // console.log(`Building ${pkg}...`);
        // const target = path.resolve(__dirname, `../packages/${pkg}`);
        // try {
        //     await ngPackage
        //         .ngPackagr()
        //         .forProject(path.resolve(target, 'ng-package.json'))
        //         .withTsConfig(path.resolve(target, 'tsconfig.lib.json'))
        //         .build();
        //     console.log(`Successfully built ${pkg}`);
        // } catch (error) {
        //     console.error(`Error building ${pkg}:`, error);
        //     process.exit(1);
        // }
    }
}

buildNgPackages();
