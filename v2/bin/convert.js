#!/usr/bin/env node
const { convertFile } = require("../src/convertFile");

const [input, outputArg] = process.argv.slice(2);
const output = outputArg || "./out";

if (!input) {
  console.error("Usage: convert <input> [output]");
  process.exit(1);
}

convertFile(input, output).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
