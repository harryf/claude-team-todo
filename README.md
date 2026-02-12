# Claude Code Team Demo: Todo CLI App

A simple CLI todo application built to demonstrate Claude Code's multi-agent team workflow. The entire project was built by specialized AI agents acting as a development team, using real GitHub branches and pull requests.

## The Team

| Role | Agent Type | Responsibility |
|------|-----------|----------------|
| **Tech Lead** | Main Claude session | Orchestration, code review, git workflow, documentation |
| **Architect** | `Architect` subagent | System design, module structure, data model |
| **Engineer** | `Engineer` subagent | Core implementation of all application code |
| **QA Tester** | `Engineer` subagent (QA role) | Test suite creation and validation |

## Workflow Demonstrated

### PR #1: Architecture Design
- **Branch:** `feature/architecture`
- **Agent:** Architect
- **Deliverable:** `DESIGN.md` — three-layer architecture, data model, CLI command spec
- **Review:** Tech Lead approved the design before any code was written

### PR #2: Core Implementation
- **Branch:** `feature/core-todo`
- **Agent:** Engineer
- **Deliverable:** `src/storage.js`, `src/todo.js`, `src/cli.js`, `bin/todo.js`
- **Review:** Tech Lead reviewed all 4 files, verified alignment with DESIGN.md

### PR #3: Test Suite
- **Branch:** `feature/tests`
- **Agent:** QA Tester
- **Deliverable:** `test/todo.test.js` — 6 tests, all passing
- **Review:** Tech Lead ran tests and performed manual smoke testing

### PR #4: Documentation
- **Branch:** `feature/readme`
- **Agent:** Tech Lead
- **Deliverable:** This README

## Usage

```bash
# Add a todo
node bin/todo.js add "Buy groceries"

# List all todos
node bin/todo.js list

# Mark as complete
node bin/todo.js complete 1

# Delete a todo
node bin/todo.js delete 1
```

## Running Tests

```bash
npm test
```

## Architecture

```
CLI Layer (src/cli.js)       # Command parsing, output formatting
    |
Logic Layer (src/todo.js)    # Business rules, CRUD operations
    |
Storage Layer (src/storage.js)  # JSON file persistence
```

- Zero external dependencies
- Node.js ES modules throughout
- JSON file storage at `./todos.json`

## Key Takeaways

1. **Subagents as team members** — Each Claude Code subagent (Architect, Engineer, QA) operates independently with a specific brief, just like a real team member
2. **Real git workflow** — Feature branches, pull requests via `gh` CLI, code review, and merges — all automated
3. **Design-first approach** — The Architect delivered a design doc before any code was written, and the Engineer implemented against that spec
4. **Verification at every step** — Tech Lead reviewed every PR, QA wrote tests, and manual smoke tests confirmed end-to-end functionality
5. **Clean separation of concerns** — Each agent stayed in their lane: design, implement, test, orchestrate
