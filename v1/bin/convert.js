#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
const { performance } = require("perf_hooks");

async function convertFile(
  inputPath,
  outputPath = "./out",
  transform = (r) => r
) {
  const ext = path.extname(inputPath).toLowerCase();
  const raw = await fs.readFile(inputPath, "utf8");
  let records;

  if (ext === ".csv") {
    const [headerLine, ...lines] = raw.trim().split(/\r?\n/);
    const headers = headerLine.split(",").map((h) => h.trim());
    records = lines.map((line) => {
      const vals = line.split(",");
      const obj = Object.create(null);
      for (let i = 0; i < headers.length; i++) {
        obj[headers[i]] = vals[i]?.trim() ?? "";
      }
      return obj;
    });
  } else if (ext === ".json") {
    records = JSON.parse(raw);
    if (!Array.isArray(records))
      throw new Error("JSON input must be an array of objects");
  } else {
    throw new Error("Unsupported input format: must be .csv or .json");
  }

  const start = performance.now();
  const transformed = records.map((rec, i) => transform(rec, i));
  let outStr;

  if (outputPath.endsWith(".json")) {
    outStr = JSON.stringify(transformed, null, 2);
  } else if (outputPath.endsWith(".csv")) {
    const keys = Object.keys(transformed[0] || {});
    const lines = transformed.map((rec) =>
      keys.map((k) => rec[k] ?? "").join(",")
    );
    outStr = [keys.join(","), ...lines].join("\n");
  } else {
    throw new Error("Unsupported output format: must be .csv or .json");
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, outStr, "utf8");
  const end = performance.now();
  console.log(
    `✓ ${records.length} records  |  ${((end - start) / 1000).toFixed(2)}s`
  );
}

if (require.main === module) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error("Usage: convert.js <inputPath> <outputPath>");
    process.exit(1);
  }
  convertFile(input, output).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = convertFile;
