import pkg from "./package.json" assert { type: 'json' };
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';


export default [
    
    {
        input: "lib/Index.js",
        output: {
            file:"dist/getaddress-location-native-" + pkg.version + ".mjs",
            format:"es",
            sourcemap:  "inline"
        }
        ,plugins:[nodeResolve()]
    },
    {
        input: "lib/Index.js",
        output: 
            {
                file:"dist/getaddress-location-native-" + pkg.version + ".js",
                format:"iife", 
                name:'getAddress',
                sourcemap:  "inline"
            }
        
        ,plugins:[nodeResolve()]
    },
    {
        input: "dist/getaddress-location-native-" + pkg.version + ".mjs",
        output: 
            {
                file:"dist/getaddress-location-native-" + pkg.version + ".min.js",
                format:"iife",
                name:'getAddress'
            },
        plugins:[terser()]
    }
]