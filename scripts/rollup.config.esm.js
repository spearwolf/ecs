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
    file: path.join(root, 'dist', 'ecs.mjs'),
    sourcemap: true,
    sourcemapFile: path.join(root, 'dist', 'ecs.mjs.map'),
    format: 'esm',
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
          useBuiltIns: 'usage',
          corejs: {
            version: 3,
            proposals: true
          },
          targets: {
            esmodules: true,
          },
        },
      ]],
    }),
    terser({
      output: { comments: /^!/ },
    }),
  ],
};
