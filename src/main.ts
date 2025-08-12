import './style.css';
import { dummyTodos } from './data';

// Use `import type` when importing interfaces or types to tell TS that they are only needed in development, so they won't be included in the compile JS and won't trigger unnecessary runtime imports.
import type { ITodo } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = /*html*/ `
  <h1>What todo, what todo?</h1>
  <main>
    <form class="add-todo-form">
      <label for="title-input">Add new Todo</label>
      <input class="new-todo-title" id="title-input" type="text">
      <button class="add-btn" type="submit">Add</button>
    </form>
    <section class="todo-list"></section>
  </main>
`;

const todoList = document.querySelector<HTMLElement>('.todo-list')!;

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
    <div class="action-buttons"></div>
  `;

  return newTodoEl;
}

function populateTodoListWithDummys() {
  dummyTodos.forEach((t) => {
    // appendChild would work fine as well
    todoList.insertAdjacentElement('beforeend', createNewTodoEl(t));
  });
}
