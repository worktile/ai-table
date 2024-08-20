module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        'header-max-length': [0, 'always', 120],
        'scope-enum': [2, 'always', ['demo', 'testing', 'grid', 'shared', 'build']],
        'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'perf', 'docs', 'test', 'build', 'ci', 'revert']]
    }
};
