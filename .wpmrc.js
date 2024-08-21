module.exports = {
    allowBranch: ['develop', 'release-auto-*'],
    bumpFiles: ['package.json', 'package-lock.json', 'packages/grid/package.json', 'packages/shared/package.json'],
    skip: {
        confirm: true
    },
    tagPrefix: '',
    hooks: {
        prepublish: 'npm run build',
        prereleaseBranch: 'node ./scripts/pre-release.js {{version}}'
    }
};
