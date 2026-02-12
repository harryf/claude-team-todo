# Todo CLI App -- Design Document

## Architecture Overview

A single-user CLI todo application built with Node.js ES modules and zero external dependencies. The app follows a three-layer architecture:

```
CLI Layer (src/cli.js)
    |
    v
Logic Layer (src/todo.js)
    |
    v
Storage Layer (src/storage.js)
```

**Data flow:** User input enters through the CLI layer, which parses commands and delegates to the logic layer. The logic layer validates input, applies business rules, and calls the storage layer to persist changes. Results flow back up to the CLI layer for display.

## Data Model

Each todo item has the following shape:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-02-12T10:00:00.000Z"
}
```

| Field       | Type    | Description                              |
|-------------|---------|------------------------------------------|
| id          | number  | Auto-incrementing integer, unique per item |
| title       | string  | User-provided description of the task    |
| completed   | boolean | Defaults to false, set true on completion |
| createdAt   | string  | ISO 8601 timestamp, set at creation time |

## Storage Approach

Todos are persisted as a JSON file at `./todos.json` in the working directory. The file contains a single object:

```json
{
  "nextId": 4,
  "todos": [
    { "id": 1, "title": "Example", "completed": false, "createdAt": "..." }
  ]
}
```

- `nextId` tracks the next available ID to avoid collisions after deletions.
- The entire file is read and written on each operation (acceptable for a small, single-user app).
- If the file does not exist, the storage layer initializes it with `{ "nextId": 1, "todos": [] }`.
- All file operations use `fs/promises` (async).

## CLI Commands

The entry point is `bin/todo.js`, invoked as `node bin/todo.js <command> [args]`.

| Command              | Description                          | Example                        |
|----------------------|--------------------------------------|--------------------------------|
| `add <title>`        | Create a new todo item               | `node bin/todo.js add "Buy milk"` |
| `list`               | Show all todos with status           | `node bin/todo.js list`        |
| `complete <id>`      | Mark a todo as completed             | `node bin/todo.js complete 2`  |
| `delete <id>`        | Remove a todo permanently            | `node bin/todo.js delete 3`    |

- Unknown commands or missing arguments print a usage message to stderr and exit with code 1.
- Successful operations print confirmation to stdout and exit with code 0.

## Module Structure

```
claude-team-todo/
  bin/
    todo.js          # Entry point -- parses process.argv, calls CLI layer
  src/
    cli.js           # Command routing and output formatting
    todo.js          # Business logic (add, list, complete, delete)
    storage.js       # Read/write todos.json via fs/promises
  todos.json         # Data file (created at runtime, gitignored)
  package.json       # type: "module", bin field
  DESIGN.md          # This file
```

### src/storage.js

Exports:
- `load()` -- Returns the parsed data object from todos.json (creates file if missing).
- `save(data)` -- Writes the data object to todos.json.

### src/todo.js

Exports:
- `addTodo(title)` -- Creates a todo, assigns next ID, persists, returns the new item.
- `listTodos()` -- Returns the array of all todos.
- `completeTodo(id)` -- Sets `completed: true` on the matching todo. Throws if not found.
- `deleteTodo(id)` -- Removes the matching todo. Throws if not found.

### src/cli.js

Exports:
- `run(args)` -- Takes the argument list (process.argv.slice(2)), dispatches to the appropriate todo function, formats and prints the result.

### bin/todo.js

Minimal entry point:

```js
#!/usr/bin/env node
import { run } from '../src/cli.js';
run(process.argv.slice(2));
```
