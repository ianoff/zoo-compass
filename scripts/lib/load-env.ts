import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function parseEnvLine(line: string): [string, string] | null {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const separator = trimmed.indexOf('=');
  if (separator === -1) {
    return null;
  }

  const key = trimmed.slice(0, separator).trim();
  let value = trimmed.slice(separator + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

export function loadEnvFiles(root: string): void {
  for (const filename of ['.env', '.env.local']) {
    const path = join(root, filename);

    if (!existsSync(path)) {
      continue;
    }

    const content = readFileSync(path, 'utf8');

    for (const line of content.split('\n')) {
      const parsed = parseEnvLine(line);

      if (!parsed) {
        continue;
      }

      const [key, value] = parsed;

      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}
