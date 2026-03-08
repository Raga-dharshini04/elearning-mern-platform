import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Instructor/Sidebar";

const InstructorHome = () => {
  // 1. To-Do State: Load from localStorage on initialization
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("instructor_todos");
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Review Practice Lab submissions" },
      { id: 2, text: "Update Google Meet links" },
      { id: 3, text: "Publish new Quiz for Module 3" }
    ];
  });
  
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [todaySessions, setTodaySessions] = useState([]);
  const token = localStorage.getItem("token");

  // Sync To-Dos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("instructor_todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    fetchAllMeetings();
  }, []);

  const fetchAllMeetings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const today = new Date().toLocaleDateString();
      let aggregatedMeetings = [];
      res.data.forEach(course => {
        if (course.meetings) {
          course.meetings.forEach(m => {
            if (new Date(m.scheduledDate).toLocaleDateString() === today) {
              aggregatedMeetings.push({ ...m, courseName: course.title });
            }
          });
        }
      });
      setTodaySessions(aggregatedMeetings);
    } catch (error) { console.error(error); }
  };

  const handleCompleteTask = (id) => {
    setTimeout(() => {
      setTodos(prev => prev.filter(t => t.id !== id));
    }, 400);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTask }]);
      setNewTask("");
      setShowInput(false);
    }
  };

  return (
    <div style={{ display: "flex" }}> 
      <Sidebar />
      <div style={{ marginLeft: "80px", padding: "30px", backgroundColor: "#F4F7FE", width: "100%", minHeight: "100vh" }}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card p-5 border-0 shadow-sm mb-4" style={{ borderRadius: "30px", background: "#fff" }}>
              <div className="row align-items-center">
                <div className="col-md-7">
                  <h2 className="fw-bold">Hi Instructor!</h2>
                  <p className="text-muted">Check your performance stats today!</p>
                </div>
                <div className="col-md-5 text-center">
                  <div style={{ position: "relative", display: "inline-block" }}>
                     <h1 className="fw-bold text-primary" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>4.6</h1>
                     <svg width="150" height="150">
                        <circle cx="75" cy="75" r="60" stroke="#eee" strokeWidth="15" fill="none" />
                        <circle cx="75" cy="75" r="60" stroke="#4318FF" strokeWidth="15" fill="none" strokeDasharray="300" />
                     </svg>
                  </div>
                </div>
              </div>
            </div>

            <h5 className="fw-bold mb-3">Today's Live Sessions</h5>
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
              {todaySessions.length > 0 ? todaySessions.map((session, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                   <div className="d-flex align-items-center">
                     <div className="bg-light p-3 rounded-4 me-3 text-primary"><i className="bi bi-camera-video-fill"></i></div>
                     <div>
                       <div className="fw-bold">{session.topic}</div>
                       <div className="text-muted small"><span className="text-primary">{session.courseName}</span> • {session.startTime}</div>
                     </div>
                   </div>
                   <a href={session.meetLink} target="_blank" rel="noreferrer" className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 text-decoration-none fw-bold">Join Meet</a>
                </div>
              )) : <p className="text-center py-4 text-muted">No meetings today.</p>}
            </div>
          </div>

          <div className="col-lg-4">
             <div className="card p-4 border-0 shadow-sm mb-4" style={{ borderRadius: "20px" }}>
                <h6 className="fw-bold mb-4">To-do list</h6>
                {todos.map((todo) => (
                  <div key={todo.id} className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" onChange={() => handleCompleteTask(todo.id)} />
                    <label className="form-check-label small">{todo.text}</label>
                  </div>
                ))}
                {todos.length === 0 && <p className="text-muted small text-center py-3">All caught up! 🎉</p>}
                {showInput ? (
                  <form onSubmit={handleAddTask}>
                    <input autoFocus className="form-control form-control-sm mb-2" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                    <button type="submit" className="btn btn-primary btn-sm w-100">Add Task</button>
                  </form>
                ) : (
                  <button className="btn btn-danger w-100 py-2 mt-3 fw-bold" style={{borderRadius: "12px", background: "#E31A1A", border: "none"}} onClick={() => setShowInput(true)}>+ Add new task</button>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorHome;