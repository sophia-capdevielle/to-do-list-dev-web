import './App.css';
import { useState, useEffect} from 'react';

function Tache(task) {
  const { id, title, completed } = task;
  const [taskCompleted, setTaskCompleted] = useState(completed)

  const toggleCompletion = () => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !completed }),
    })
      .then((response) => {
        if (response.ok) {
          setTaskCompleted(!taskCompleted)
        } else {
          console.error("Failed to update the task");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={taskCompleted}
        onChange={toggleCompletion}
      />
      <span className="tache-text">{title}</span>
    </div>
  );
}



function TacheTable({filterCompleted}){

  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState(''); 

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = (text) => {
    fetch('http://localhost:5000/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: text }),
    })
    .then(response => response.json())
    .then(newTask => {
      setTasks(prevTasks => [newTask, ...prevTasks]);
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTask(inputValue);
      setInputValue(''); 
    }
  };

  return(
    <div>
    {tasks.map((task, index) => {
      if (filterCompleted && task.done){
        return null;
      }
        return (
          <Tache
            key={task.id}
            title={task.title}
            index={index}
            completed={task.done}
            id={task.id}
          />
        );
      })}

    <form className="add-tache" onSubmit={handleSubmit}>
      <button type="submit" className="add-button"> + </button>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Titre de la tâche"
        className="add-input"
      />
    </form>
    </div>
  )
}

function Filter({ filterCompleted, toggleFilter }){
  return(
    <button className="filter-button" onClick={toggleFilter}>
    {filterCompleted ? 'Afficher toutes les tâches' : 'Masquer les tâches réalisées'}
    </button>
  )
}

export default function TodoTable(){
  const [filterCompleted, setFilterCompleted] = useState(false);

  const toggleFilter = () => {
    setFilterCompleted(!filterCompleted);
  };

  return(
    <div className="todo-table">
      <h1 className="todo-title">TO DO</h1>
      <TacheTable filterCompleted={filterCompleted} />
      <Filter filterCompleted = {filterCompleted} toggleFilter = {toggleFilter}/>
    </div>
  )
}
