import React, { useState, useEffect } from "react";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function loadTodos() {
      try {
        const result = await window.storage.get("todos");
        if (result) {
          setTodos(JSON.parse(result.value));
        }
      } catch (error) {
        console.log("No todos yet");
      }
    }
    loadTodos();
  }, []);

  useEffect(() => {
    async function saveTodos() {
      try {
        await window.storage.set("todos", JSON.stringify(todos));
      } catch (error) {
        console.error("Save failed");
      }
    }
    if (todos.length >= 0) {
      saveTodos();
    }
  }, [todos]);

  function handleAdd() {
    if (newItem.trim() === "") return;
    setTodos([...todos, { id: Date.now(), title: newItem, completed: false }]);
    setNewItem("");
  }

  function toggleTodo(id) {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  function deleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Todo List</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            type="text"
            placeholder="Add new todo..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.length === 0 && (
            <p className="text-gray-400 text-center py-4">No todos yet</p>
          )}
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 p-3 border rounded">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5"
              />
              <span className={todo.completed ? "line-through flex-1" : "flex-1"}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}