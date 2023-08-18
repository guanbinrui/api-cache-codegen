import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

export default {
    input: 'src/cli.ts',
    output: {
        file: 'dist/cli.js',
        format: 'cjs',
    },
    plugins: [resolve(), commonjs(), builtins(), typescript()],
};
