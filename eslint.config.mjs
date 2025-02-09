import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";
import next from "eslint-plugin-next";

export default [
  js.configs.recommended, // Use ESLint's recommended JS settings
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    },
    plugins: {
      next, // Next.js recommended rules
    },
    rules: {
      // Add custom rules here
    },
  },
];
 