import * as path from 'path';
import * as fs from 'fs';
import * as shell from 'shelljs';

const packagesPath = path.resolve(__dirname, '../dist');
const packages = fs.readdirSync(packagesPath).filter((name) => fs.statSync(path.resolve(packagesPath, name)).isDirectory());

async function sync() {
    for (const pkg of packages) {
        console.log(`sync @ai-table/${pkg} styles ...`);
        shell.exec(`cd packages/${pkg}/src && cpx '**/*.scss' '../../../dist/${pkg}'`);
        console.log(`sync @ai-table/${pkg} styles done.`);
    }
}

sync();
