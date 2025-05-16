// src/parser.js
const fs = require("fs").promises;
const path = require("path");

async function parseInput(inputPath) {
  const raw = await fs.readFile(inputPath, "utf8");
  const ext = path.extname(inputPath).toLowerCase();
  let records, headers;

  if (ext === ".csv") {
    const [hdr, ...lines] = raw.trim().split(/\r?\n/);
    headers = hdr.split(",").map((h) => h.trim());
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
    if (!Array.isArray(records)) throw new Error("JSON input must be an array");
    headers = Array.from(
      records.reduce((s, r) => {
        Object.keys(r).forEach((k) => s.add(k));
        return s;
      }, new Set())
    );
  } else {
    throw new Error("Unsupported format: .csv or .json only");
  }

  return { records, headers };
}

module.exports = { parseInput };
