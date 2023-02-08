import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

export default {
  input: "build/compiled/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    sourcemap: false,
    minifyInternalExports: true,
  },
  plugins: [
    resolve({ exportConditions: ["node"] }),
    commonjs({
      ignoreDynamicRequires: true,
    }),
    json(),
  ],
};
