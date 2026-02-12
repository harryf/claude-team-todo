import { load, save } from './storage.js';

export async function addTodo(title) {
  const data = await load();
  const todo = {
    id: data.nextId,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  data.nextId++;
  data.todos.push(todo);
  await save(data);
  return todo;
}

export async function listTodos() {
  const data = await load();
  return data.todos;
}

export async function completeTodo(id) {
  const data = await load();
  const todo = data.todos.find((t) => t.id === id);
  if (!todo) {
    throw new Error(`Todo with id ${id} not found`);
  }
  todo.completed = true;
  await save(data);
  return todo;
}

export async function deleteTodo(id) {
  const data = await load();
  const index = data.todos.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Todo with id ${id} not found`);
  }
  const [removed] = data.todos.splice(index, 1);
  await save(data);
  return removed;
}
