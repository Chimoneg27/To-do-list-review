import './style.css';
// eslint-disable-next-line import/no-cycle
import clearAll from './modules/statusUpdates.js';

const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const toDoListEl = document.getElementById('todos-list');
const clearCompletedBtn = document.getElementById('clear-completed');
// eslint-disable-next-line import/no-mutable-exports
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

const renderTodos = () => {
  toDoListEl.innerHTML = '';

  todos.forEach((todo, index) => {
    toDoListEl.innerHTML += `
        <div class="todo" id="${index}">
            <i 
              class="bi ${todo.completed ? 'bi-check-circle-fill' : 'bi-circle'}"
              style="color : ${todo.color}"
              data-action="check"
              ></i>
            <p class="${todo.completed ? 'checked' : ''}" data-action="check">${todo.value}</p>
            <i class="bi bi-pencil-square" data-action="edit"></i>
            <i class="bi bi-trash" data-action="delete"></i>
        </div>
        `;
  });
};

renderTodos();

const saveTodo = () => {
  const todoValue = todoInput.value;

  const isEmpty = todoValue === '';

  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

  if (isEmpty) {
    return '';
  } if (isDuplicate) {
    return '';
  }
  if (EditTodoId >= 0) {
    todos = todos.map((todo, index) => ({
      ...todo,
      value: index === EditTodoId ? todoValue : todo.value,
    }));
    EditTodoId = -1;
  } else {
    todos.push({
      id: todos.length,
      value: todoValue,
      completed: false,
      color: 'black',
    });
  }

  todoInput.value = '';

  return undefined;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  saveTodo();
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    completed: index === todoId ? !todo.completed : todo.completed,
  }));

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

function deleteTodo(todoId) {
  todos.splice(todoId, 1);
  EditTodoId = -1;
  todos.forEach((todo, index) => {
    if (index >= todoId) {
      todo.id = index;
    }
  });

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

toDoListEl.addEventListener('click', (event) => {
  const { target } = event;
  const parentElement = target.parentNode;

  if (parentElement.className !== 'todo') return;

  const todo = parentElement;
  const todoId = Number(todo.id);

  const { action } = target.dataset;

  switch (action) {
    case 'check':
      checkTodo(todoId);
      break;
    case 'edit':
      editTodo(todoId);
      break;
    case 'delete':
      deleteTodo(todoId);
      break;
    default:
      break;
  }
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);

  todos.forEach((todo, index) => {
    todo.id = index;
  });

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

clearAll();

export {
  renderTodos, todos,
};