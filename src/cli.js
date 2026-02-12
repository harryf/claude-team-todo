import { addTodo, listTodos, completeTodo, deleteTodo } from './todo.js';

const USAGE = `Usage: todo <command> [args]

Commands:
  add <title>      Add a new todo
  list             List all todos
  complete <id>    Mark a todo as completed
  delete <id>      Delete a todo`;

export async function run(args) {
  const command = args[0];

  switch (command) {
    case 'add': {
      const title = args[1];
      if (!title) {
        process.stderr.write('Error: title is required\n');
        process.exit(1);
      }
      const todo = await addTodo(title);
      console.log(`Added todo #${todo.id}: ${todo.title}`);
      break;
    }

    case 'list': {
      const todos = await listTodos();
      if (todos.length === 0) {
        console.log('No todos yet. Add one with: todo add "Your task"');
        break;
      }
      for (const todo of todos) {
        const status = todo.completed ? '[x]' : '[ ]';
        console.log(`${status} #${todo.id} - ${todo.title}`);
      }
      break;
    }

    case 'complete': {
      const id = Number(args[1]);
      if (!id || isNaN(id)) {
        process.stderr.write('Error: valid id is required\n');
        process.exit(1);
      }
      const todo = await completeTodo(id);
      console.log(`Completed todo #${todo.id}: ${todo.title}`);
      break;
    }

    case 'delete': {
      const id = Number(args[1]);
      if (!id || isNaN(id)) {
        process.stderr.write('Error: valid id is required\n');
        process.exit(1);
      }
      const todo = await deleteTodo(id);
      console.log(`Deleted todo #${todo.id}: ${todo.title}`);
      break;
    }

    default: {
      process.stderr.write(USAGE + '\n');
      process.exit(1);
    }
  }
}
