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
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Todo List</h1>
        
        <div style={styles.inputGroup}>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            type="text"
            placeholder="Add new todo..."
            style={styles.input}
          />
          <button onClick={handleAdd} style={styles.addButton}>
            Add
          </button>
        </div>

        <ul style={styles.todoList}>
          {todos.length === 0 && (
            <li style={styles.emptyMessage}>No todos yet</li>
          )}
          {todos.map((todo) => (
            <li key={todo.id} style={styles.todoItem}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={styles.checkbox}
              />
              <span
                style={{
                  ...styles.todoText,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#999" : "#333",
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={styles.deleteButton}
                onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
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

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "40px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    width: "100%",
    maxWidth: "600px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#111827",
  },
  inputGroup: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "8px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "8px 24px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  todoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  todoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  todoText: {
    flex: 1,
    fontSize: "16px",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "6px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "20px",
    fontSize: "14px",
  },
};