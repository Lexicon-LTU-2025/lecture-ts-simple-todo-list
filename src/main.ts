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
const todoList = document.querySelector<HTMLElement>('.todo-list')!;
const inputEl = document.querySelector<HTMLInputElement>('#title-input')!;

formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTodo: ITodo = {
    completed: false,
    id: generateId(),
    title: inputEl.value,
  };

  const newTodoEl = createNewTodoEl(newTodo);
  todoList.insertAdjacentElement('afterbegin', newTodoEl);
  inputEl.value = '';
});

todoList.addEventListener('click', (e) => handleOnClick(e));

populateTodoListWithDummys();

// #################### Functions below ####################

function createNewTodoEl(todo: ITodo): HTMLElement {
  // const completed = todo.completed;
  // const id = todo.id;
  // const title = todo.title;

  // Deconstructing an object, same as above but in one line basically.
  const { completed, id, title } = todo;

  const newTodoEl = document.createElement('article');
  newTodoEl.id = String(id); // Parse whatever inside to a string
  newTodoEl.classList.add('todo');

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
    </div>
  `;

  return newTodoEl;
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

  console.log(todoEl);
}

function populateTodoListWithDummys(): void {
  dummyTodos.forEach((t) => {
    // appendChild would work fine as well
    todoList.insertAdjacentElement('beforeend', createNewTodoEl(t));
  });
}

function removeTodo(todoEl: HTMLElement): void {
  todoList.removeChild(todoEl);
}

function updateTodo(todoEl: HTMLElement): void {
  
}
