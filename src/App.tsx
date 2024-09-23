import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from './types';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post<Task>('http://localhost:5000/tasks', {
        title: newTaskTitle,
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id: number, title: string) => {
    try {
      const response = await axios.put<Task>(`http://localhost:5000/tasks/${id}`, {
        title,
      });
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTaskTitle}
        onChange={e => setNewTaskTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="text"
              value={task.title}
              onChange={e => updateTask(task.id, e.target.value)}
            />
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
