import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/MVVM.js',
    format: 'iife',
    moduleName: 'MVVM',
    plugins: [
        resolve({
            // pass custom options to the resolve plugin
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        })
    ],
    dest: 'dist/MVVM.js'
}
