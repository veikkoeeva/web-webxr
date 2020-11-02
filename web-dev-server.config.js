const rollupCommonjs = require('@rollup/plugin-commonjs');
const { fromRollup } = require('@web/dev-server-rollup');

const commonjs = fromRollup(rollupCommonjs);

module.exports = {
  port: 8080,
  watch: true,
  nodeResolve: { browser: true },
  esbuildTarget: 'auto',
  dedupe: true,
  rootDir: '.',
  extensions: ['.mjs', '.js'],
  moduleDirs: ['node_modules'],
  plugins: [ commonjs({ include: ['./node_modules/@babel/**/*'] }) ]
};
