module.exports = {
    allowBranch: ['develop', 'w-test', 'release-auto-*'],
    bumpFiles: ['package.json', 'package-lock.json', 'packages/grid/package.json', 'packages/shared/package.json'],
    skip: {
        confirm: true,
        changelog: true
    },
    commitAll: true,
    hooks: {
        prepublish: 'npm run build',
        prereleaseBranch: 'lerna version {{version}} && git add .'
    }
};
