# Convert V2

**Convert V2** (npm package `json-csv-convert`) is a fast, interactive CLI for converting between CSV and JSON. It adds zero-configuration interactivity for:

- Selecting columns/properties to keep or delete
- Remapping column/property names
- Deduplicating records by chosen keys
- Previewing a sample of output
- Output in JSON or CSV as desired

---

## 📦 Installation

```bash
npm install -g json-csv-convert-v2
# or for local/dev:
npm link
```

---

## CLI Usage

```bash
# Run interactive converter:
json-csv-convert <inputFile> <outputFileOrDir>

# Example:
json-csv-convert users.csv ./out
```

### Interactive Workflow

1. **Select Output Format**
   Choose `JSON` or `CSV`
2. **Choose Columns**
   Multi-select which headers to keep or delete
3. **Remap Columns**
   Edit or rename selected columns as `oldName → newName`
4. **Deduplicate Records**
   Optionally pick one or more columns as dedupe keys
5. **Confirm & Run**
   Review summary and press Enter to execute

---

## Non-Interactive Flags

You can bypass prompts with named options:

| Flag              | Shorthand | Description                                     |
| ----------------- | --------- | ----------------------------------------------- |
| `--format <fmt>`  | `-f`      | Output format: `json` or `csv`                  |
| `--keep <cols>`   | `-k`      | Comma-separated list of columns to keep         |
| `--delete <cols>` | `-d`      | Comma-separated list of columns to delete       |
| `--remap <map>`   | `-r`      | Comma-separated `old:new` pairs                 |
| `--dedupe [keys]` |           | Dedupe by columns (comma-separated)             |
| `--sample <N>`    | `-s`      | Preview N records before processing (default 5) |
| `--help`          | `-h`      | Show help text                                  |
| `--version`       | `-v`      | Show version                                    |

**Example (one-liner)**:

```bash
json-csv-convert data.csv data.json \
  --format json \
  --keep id,name,email \
  --remap email:contactEmail \
  --dedupe id
```

---

## Output

- **JSON**: pretty-printed array of objects
- **CSV**: headers from final columns; values joined by commas
- Creates target dir if needed

---

## Exit Codes

| Code | Meaning                    |
| ---- | -------------------------- |
| 0    | Success                    |
| 1    | Invalid arguments or flags |
| 2    | File read/write errors     |
| 3    | Parse or transform errors  |

---

## License

MIT
