import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState(() => {
    // Load from localStorage on first render
    const localValue = localStorage.getItem("ITEMS");
    return localValue ? JSON.parse(localValue) : [];
  });

  // Save todos whenever they change
  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();
    if (newItem.trim() === "") return;
    setTodos((currentTodos) => [
      ...currentTodos,
      { id: crypto.randomUUID(), title: newItem, completed: false },
    ]);
    setNewItem("");
  }

  function toggleTodo(id, completed) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div>
          <label htmlFor="item">New Item</label>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            type="text"
            id="item"
          />
        </div>
        <button className="btn" type="submit">
          Add
        </button>
      </form>

      <div className="header">Todo List</div>
      <ul className="list">
        {todos.length === 0 && "No Todos"}
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => toggleTodo(todo.id, e.target.checked)}
              />
              {todo.title}
            </label>
            <button onClick={() => deleteTodo(todo.id)} className="btn btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
