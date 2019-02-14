/* eslint-env node */
import path from 'path';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';

import banner from './banner';

const root = path.resolve(__dirname, '..');

export default {
  input: 'src/index.js',
  output: {
    file: path.join(root, 'dist', 'ecs.umd.js'),
    sourcemap: true,
    sourcemapFile: path.join(root, 'dist', 'ecj.umd.js.map'),
    format: 'umd',
    name: 'ECS',
    exports: 'named',
  },
  plugins: [
    banner,
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    babel({
      presets: [[
        '@babel/preset-env', {
          debug: false,
          modules: false,
          useBuiltIns: 'entry',
          targets: {
            browsers: ['> 2%', 'not dead'],
          },
        },
      ]],
    }),
    terser({
      output: { comments: /^!/ },
    }),
  ],
};
