import { readFile, writeFile } from 'node:fs/promises';

const STORAGE_PATH = './todos.json';

const DEFAULT_DATA = { nextId: 1, todos: [] };

export async function load() {
  try {
    const raw = await readFile(STORAGE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await save(DEFAULT_DATA);
      return { ...DEFAULT_DATA, todos: [] };
    }
    throw err;
  }
}

export async function save(data) {
  await writeFile(STORAGE_PATH, JSON.stringify(data, null, 2) + '\n');
}
