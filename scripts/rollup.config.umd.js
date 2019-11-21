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
    sourcemapFile: path.join(root, 'dist', 'ecs.umd.js.map'),
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
      exclude: [/\/core-js\//],
      presets: [[
        '@babel/preset-env', {
          debug: false,
          modules: false,
          useBuiltIns: 'usage',
          corejs: {
            version: 3,
            proposals: true
          },
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
