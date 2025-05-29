# Convert V1

**Convert V1** (npm package `json-csv-convert-v1`) is a zero-interaction, high-speed CLI and programmatic utility for lossless CSV ↔ JSON conversions.

---

## Installation

```bash
npm install -g json-csv-convert-v1
# or for local development:
npm link
```

> This installs the `json-csv-convert-v1` command globally.

---

## CLI Usage

```bash
# via global binary
json-csv-convert-v1 <input.csv> <output.json>

# or JSON → CSV
json-csv-convert-v1 <input.json> <output.csv>
```

- `<input>`: path to a `.csv` or `.json` file
- `<output>`: path ending in `.json` (for JSON output) or `.csv` (for CSV output)

**Success** prints:

```
✓ <N> records  |  <time>s
```

and exits with code 0.
**Error** prints a message to stderr and exits with code 1.

### Alternate Invocation

If you clone the repo directly, you can also run:

```bash
node convert.js <input> <output>
```

from the project root.

---

## Programmatic API

```js
// Require the module (from package or local file)
const convertFile = require("json-csv-convert-v1");

async function run() {
  await convertFile("data/input.csv", "data/output.json", (record, index) => {
    // optional per-record transform
    record.timestamp = new Date().toISOString();
    return record;
  });
}

run().catch(console.error);
```

**Function Signature**

```ts
convertFile(
  inputPath: string,
  outputPath?: string,
  transform?: (record: Record<string, any>, index: number) => Record<string, any>
): Promise<void>
```

- `inputPath`: `.csv` or `.json`
- `outputPath`: defaults to `./out` if omitted; must end in `.csv` or `.json`
- `transform`: optional per-record mapping function

---

## I/O Details

- **CSV → records**

  - Splits on `,`; first row is headers
  - Missing fields return `""`

- **JSON → records**

  - Input must be a JSON array of objects

- **records → JSON**

  - Pretty-printed with 2-space indentation

- **records → CSV**

  - Columns from keys of the first record; null/undefined → `""`

- Automatically creates parent directories for output

---

## Error Handling

- Unsupported extensions → `Error("Unsupported input/output format…")`
- JSON not an array → `Error("JSON input must be an array of objects")`
- FS or parse errors → printed to stderr, exit code 1

---

## License

MIT
