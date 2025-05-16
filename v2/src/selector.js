// src/selector.js
const readline = require("readline");

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ans = await new Promise((res) => rl.question(question, res));
  rl.close();
  return ans.trim();
}

async function chooseColumns(headers) {
  let mode;
  while (true) {
    mode = (
      await ask("Columns: [A]ll, [K]eep, [D]elete (A/K/D): ")
    ).toUpperCase();
    if (!mode || ["A", "K", "D"].includes(mode)) break;
  }
  let selected = [];
  if (mode === "K") {
    while (true) {
      const col = await ask("Keep column (blank to end): ");
      if (!col) break;
      if (headers.includes(col) && !selected.includes(col)) selected.push(col);
    }
  } else if (mode === "D") {
    while (true) {
      const col = await ask("Delete column (blank to end): ");
      if (!col) break;
      if (headers.includes(col) && !selected.includes(col)) selected.push(col);
    }
  }
  return { mode, selected };
}

function applySelection(records, headers, { mode, selected }) {
  if (mode === "K") {
    return records.map((r) => {
      const o = Object.create(null);
      selected.forEach((k) => (o[k] = r[k]));
      return o;
    });
  }
  if (mode === "D") {
    return records.map((r) => {
      const o = Object.create(null);
      headers.forEach((k) => {
        if (!selected.includes(k)) o[k] = r[k];
      });
      return o;
    });
  }
  return records;
}

async function remapHeaders(headers) {
  const remaps = {};
  while (true) {
    const col = await ask("Remap column (blank to end): ");
    if (!col) break;
    if (!headers.includes(col)) continue;
    const newName = await ask(`New name for '${col}': `);
    remaps[col] = newName || col;
  }
  return remaps;
}

function applyRemaps(records, remaps) {
  return records.map((rec) => {
    const o = Object.create(null);
    Object.keys(rec).forEach((k) => {
      o[remaps[k] || k] = rec[k];
    });
    return o;
  });
}

async function removeDuplicates(records) {
  const ans = (await ask("Remove duplicates? (Y/N): ")).toUpperCase();
  if (ans === "Y" || ans === "YES") {
    const seen = new Set();
    return records.filter((r) => {
      const s = JSON.stringify(r);
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });
  }
  return records;
}

module.exports = {
  chooseColumns,
  applySelection,
  remapHeaders,
  applyRemaps,
  removeDuplicates,
};
