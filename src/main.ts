import './css/style.css';
import { dummyTodos } from './data';
import { v4 as generateId } from 'uuid';

// Use `import type` when importing interfaces or types to tell TS that they are only needed in development, so they won't be included in the compile JS and won't trigger unnecessary runtime imports.
import type { ITodo } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = /*html*/ `
  <h1>What todo, what todo?</h1>
  <main>
    <form class="add-todo-form">
      <label for="title-input">Add new Todo</label>
      <input class="new-todo-title" id="title-input" required type="text">
      <button class="add-btn" type="submit">Add</button>
    </form>
    <section class="todo-list"></section>
  </main>
`;

const formEl = document.querySelector<HTMLFormElement>('.add-todo-form')!;
const todoListEl = document.querySelector<HTMLElement>('.todo-list')!;
const inputEl = document.querySelector<HTMLInputElement>('#title-input')!;

// It is possible to have inline event handlers
formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTodo: ITodo = {
    completed: false,
    id: generateId(),
    title: inputEl.value,
  };

  const newTodoEl = createNewTodoEl(newTodo);
  todoListEl.insertAdjacentElement('afterbegin', newTodoEl);
  inputEl.value = '';
  updateMoveButtonState();
});

// But I prefer to externalize them ( event handler ).
todoListEl.addEventListener('click', (e) => handleOnClick(e));

populateExistingTodos();
updateMoveButtonState();

// #################### Functions below ####################

function createNewTodoEl(todo: ITodo): HTMLElement {
  // const completed = todo.completed;
  // const id = todo.id;
  // const title = todo.title;

  // Deconstructing an object, same as above but in one line basically.
  const { completed, id, title } = todo;
  const classes = ['todo'];

  if (completed) {
    classes.push('completed');
  }

  const newTodoEl = document.createElement('article');
  newTodoEl.id = String(id); // Parse whatever inside to a string
  newTodoEl.classList.add(...classes); // Spread syntax, 'spreads out all the elements'

  newTodoEl.innerHTML = /*html*/ `
    <p class="todo-title">${title}</p>
    <div class="action-buttons">
      <button class="complete-btn" type="button">
        <span class="material-symbols-outlined">
          ${completed ? 'check_box' : 'check_box_outline_blank'}
        </span>
      </button>
      
      <button class="remove-btn" type="button">
        <span class="material-symbols-outlined">delete</span>
      </button>

      <button class="move-up-btn" type="button">
        <span class="material-symbols-outlined">
          arrow_upward
        </span>
      </button>

      <button class="move-down-btn" type="button">
        <span class="material-symbols-outlined">arrow_downward</span>
      </button>
    </div>
  `;

  return newTodoEl;
}

async function fetchTodos(): Promise<ITodo[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos');

  if (res.ok === false) {
    throw new Error('Todos could not be fetched');
  }

  const todos = (await res.json()) as ITodo[];
  return todos.slice(0, 5);
}

function handleOnClick(event: MouseEvent): void {
  const target = event.target;

  // Need this syntax to be typesafe. Looks odd but it gets the job done. TS can't know before the actual event is triggered.
  if (!(target instanceof HTMLElement)) return;

  const todoEl = target.closest<HTMLElement>('.todo');
  if (todoEl === null) return;

  // If no ancestor with the specific class exists, that if check will be false and will move on to the next if check.
  if (target.closest('.remove-btn')) return removeTodo(todoEl);
  if (target.closest('.complete-btn')) return updateTodo(todoEl);
  if (target.closest('.move-up-btn')) return moveElement(todoEl, 'up');
  if (target.closest('.move-down-btn')) return moveElement(todoEl, 'down');
}

function moveElement(todoEl: HTMLElement, direction: 'up' | 'down'): void {
  if (direction === 'up') {
    const prevEl = todoEl.previousElementSibling!;
    todoListEl.insertBefore(todoEl, prevEl);
  } else {
    const nextEl = todoEl.nextElementSibling!;
    todoListEl.insertBefore(nextEl, todoEl);
  }

  updateMoveButtonState();
}

async function populateExistingTodos(): Promise<void> {
  const todos = await fetchTodos();

  todos.forEach((t) => {
    todoListEl.insertAdjacentElement('beforeend', createNewTodoEl(t));
  });
}

function removeTodo(todoEl: HTMLElement): void {
  todoListEl.removeChild(todoEl);
  updateMoveButtonState();
}

function updateMoveButtonState(): void {
  const todos = todoListEl.children;
  if (!todos || todos.length === 0) return;

  Array.from(todos).forEach((todo, index, arr) => {
    const moveUpBtn = todo.querySelector<HTMLButtonElement>('.move-up-btn')!;
    const moveDownBtn = todo.querySelector<HTMLButtonElement>('.move-down-btn')!;

    moveUpBtn.disabled = index === 0;
    moveDownBtn.disabled = index === arr.length - 1;
  });
}

function updateTodo(todoEl: HTMLElement): void {
  const completed = !todoEl.classList.contains('completed');
  const id = todoEl.id;
  const title = todoEl.querySelector<HTMLParagraphElement>('.todo-title')!.innerText;

  const updatedTodo: ITodo = {
    completed,
    id,
    title,
  };

  const updatedTodoEl = createNewTodoEl(updatedTodo);
  todoListEl.replaceChild(updatedTodoEl, todoEl);
}
