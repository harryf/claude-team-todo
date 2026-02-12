import assert from 'node:assert/strict';
import { unlinkSync } from 'node:fs';
import { addTodo, listTodos, completeTodo, deleteTodo } from '../src/todo.js';

// ---------------------------------------------------------------------------
// Minimal test runner
// ---------------------------------------------------------------------------
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n--- Todo App Tests ---\n');

  for (const t of tests) {
    // Clean state before each test: remove todos.json so storage starts fresh
    try {
      unlinkSync('./todos.json');
    } catch {
      // File may not exist yet — that is fine
    }

    try {
      await t.fn();
      passed++;
      console.log(`  PASS  ${t.name}`);
    } catch (err) {
      failed++;
      console.log(`  FAIL  ${t.name}`);
      console.log(`        ${err.message}`);
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);

  // Final cleanup
  try {
    unlinkSync('./todos.json');
  } catch {
    // ignore
  }

  process.exit(failed > 0 ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------

test('addTodo creates a todo with correct fields', async () => {
  const todo = await addTodo('Write tests');

  assert.equal(typeof todo.id, 'number', 'id should be a number');
  assert.equal(todo.title, 'Write tests', 'title should match input');
  assert.equal(todo.completed, false, 'new todo should not be completed');
  assert.ok(todo.createdAt, 'createdAt should be set');

  // Verify createdAt is a valid ISO date string
  const parsed = new Date(todo.createdAt);
  assert.equal(isNaN(parsed.getTime()), false, 'createdAt should be a valid date');
});

test('listTodos returns all todos', async () => {
  // Start with an empty list
  const emptyList = await listTodos();
  assert.equal(emptyList.length, 0, 'should start empty');

  // Add two todos and verify the list contains both
  await addTodo('First task');
  await addTodo('Second task');

  const list = await listTodos();
  assert.equal(list.length, 2, 'should contain two todos');
  assert.equal(list[0].title, 'First task');
  assert.equal(list[1].title, 'Second task');
});

test('completeTodo marks a todo complete', async () => {
  const created = await addTodo('Finish homework');
  assert.equal(created.completed, false, 'should start incomplete');

  const completed = await completeTodo(created.id);
  assert.equal(completed.completed, true, 'should be marked complete');
  assert.equal(completed.id, created.id, 'id should stay the same');

  // Verify persistence: re-read from storage
  const list = await listTodos();
  const found = list.find((t) => t.id === created.id);
  assert.equal(found.completed, true, 'completion should persist');
});

test('completeTodo throws for invalid id', async () => {
  await assert.rejects(
    () => completeTodo(9999),
    { message: 'Todo with id 9999 not found' },
  );
});

test('deleteTodo removes a todo', async () => {
  const todo = await addTodo('Temporary task');
  const removed = await deleteTodo(todo.id);

  assert.equal(removed.id, todo.id, 'returned todo should match deleted one');
  assert.equal(removed.title, 'Temporary task');

  // Verify the list no longer contains it
  const list = await listTodos();
  const found = list.find((t) => t.id === todo.id);
  assert.equal(found, undefined, 'deleted todo should not appear in list');
});

test('deleteTodo throws for invalid id', async () => {
  await assert.rejects(
    () => deleteTodo(9999),
    { message: 'Todo with id 9999 not found' },
  );
});

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
runTests();
