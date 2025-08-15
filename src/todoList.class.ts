import { TodosKey } from './constants';
import type { ITodo } from './types';

export class TodoList {
  private todos!: ITodo[];

  constructor() {
    const storedTodos = localStorage.getItem(TodosKey);

    if (storedTodos === null) {
      console.log('Todos from API');
      fetch('https://jsonplaceholder.typicode.com/todos')
        .then((res) => {
          if (res.ok === false) {
            throw new Error('Todos could not be fetched');
          }

          return res.json() as unknown as ITodo[];
        })
        .then((todos) => {
          this.todos = todos.slice(0, 5);
          this.saveToLocalStorage();
        });
    } else {
      this.todos = JSON.parse(storedTodos) as ITodo[];
    }
  }

  public add(todo: ITodo): void {
    this.todos.unshift(todo);
    this.saveToLocalStorage();
  }

  public getTodos(): ITodo[] {
    return this.todos;
  }

  public remove(todoId: string): void {
    this.todos = this.todos.filter((todo) => String(todo.id) !== todoId);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(TodosKey, JSON.stringify(this.todos));
  }
}
