// src/convertFile.js
const path = require("path");
const fs = require("fs").promises;
const { performance } = require("perf_hooks");
const { parseInput } = require("./parser");
const {
  chooseColumns,
  applySelection,
  remapHeaders,
  applyRemaps,
  removeDuplicates,
} = require("./selector");

async function convertFile(inputPath, outputPath, transform = (r) => r) {
  const { records: recs, headers } = await parseInput(inputPath);
  const { mode, selected } = await chooseColumns(headers);
  let records = applySelection(recs, headers, { mode, selected });
  const remaps = await remapHeaders(Object.keys(records[0] || {}));
  records = applyRemaps(records, remaps);
  records = await removeDuplicates(records);

  const start = performance.now();
  const transformed = records.map(transform);
  const extOut = path.extname(outputPath).toLowerCase();
  let outStr;
  if (extOut === ".json") outStr = JSON.stringify(transformed, null, 2);
  else if (extOut === ".csv") {
    const keys = Object.keys(transformed[0] || {});
    const lines = transformed.map((r) => keys.map((k) => r[k] ?? "").join(","));
    outStr = [keys.join(","), ...lines].join("\n");
  } else throw new Error("Unsupported output");

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, outStr, "utf8");
  const end = performance.now();
  console.log(
    `✓ ${records.length} records  |  ${(end - start) / (1000).toFixed(2)}s`
  );
  return transformed;
}

module.exports = { convertFile };
