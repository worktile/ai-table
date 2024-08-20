import * as path from 'path';
import * as fs from 'fs';
import * as shell from 'shelljs';

const packagesPath = path.resolve(__dirname, '../dist');
const packages = fs.readdirSync(packagesPath).filter((name) => fs.statSync(path.resolve(packagesPath, name)).isDirectory());

async function publish() {
    let publishTag = '';
    if (process.argv[2] === '--next') {
        publishTag = '--tag next';
    }
    for (const pkg of packages) {
        console.log(`@ai-table/${pkg} publishing ...`);
        shell.exec(`cd dist/${pkg} && npm publish --access=public ${publishTag}`);
        console.log(`@ai-table/${pkg} published.`);
    }
}

publish();
