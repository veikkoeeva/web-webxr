import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';

const common = fromRollup(commonjs);
const res = fromRollup(resolve);

export default {
  port: 8080,
  watch: true,  
  esbuildTarget: 'auto',
  dedupe: true,
  extensions: ['.mjs', '.js'],
  moduleDirs: ['node_modules'],
  plugins: [
    res({ browser: true}),
    common({ include: ['./node_modules/@babel/**/*'] })
  ]
};
