// eslint-disable-next-line import/no-cycle
import { todos, renderTodos } from '../index.js';

const clearAll = () => {
  const toDoListEl = document.getElementById('todos-list');
  const clearCompletedBtn = document.getElementById('clear-completed');

  toDoListEl.addEventListener('change', (event) => {
    const { target } = event;
    const parentElement = target.parentNode;

    if (parentElement.className !== 'todo') return;

    const todo = parentElement;
    const todoId = Number(todo.id);

    todos[todoId].completed = target.checked;

    localStorage.setItem('todos', JSON.stringify(todos));

    renderTodos();
  });

  clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter((todo) => !todo.completed);
    todos.forEach((todo, index) => {
      todo.id = index;
    });

    localStorage.setItem('todos', JSON.stringify(todos));

    renderTodos();
  });
};

export default clearAll;