#!/usr/bin/env node

import * as path from 'path';
import * as ngPackage from 'ng-packagr';

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
    }
}

buildNgPackages();
