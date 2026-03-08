import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Instructor/Sidebar";

const InstructorGradebook = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // State for the modal
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/instructor/gradebook/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchGradebook();
  }, [courseId, token]);

  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#F8F9FD", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "80px", padding: "40px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold m-0" style={{ color: "#2B3674" }}>Course Gradebook</h3>
          <button className="btn btn-sm btn-light border" onClick={() => navigate(-1)}>Back</button>
        </div>
        
        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
          <table className="table table-hover align-middle">
            <thead className="text-muted small">
              <tr>
                <th>STUDENT NAME</th>
                <th>PROGRESS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>
                    <div className="fw-bold">{s.studentName}</div>
                    <div className="small text-muted">{s.studentEmail}</div>
                  </td>
                  <td style={{ width: "200px" }}>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: "8px", borderRadius: "10px" }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${s.progress}%`, 
                            backgroundColor: s.progress === 100 ? "#05CD99" : "#4318FF" 
                          }}
                        ></div>
                      </div>
                      <span className="small fw-bold">{s.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-3 ${s.progress === 100 ? 'bg-success-subtle text-success' : 'bg-light text-muted'}`}>
                      {s.progress === 100 ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      onClick={() => setSelectedStudent(s)} // OPEN MODAL
                    >
                      View Submissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SUBMISSIONS MODAL --- */}
      {selectedStudent && (
        <div style={modalOverlayStyle} onClick={() => setSelectedStudent(null)}>
          <div 
            className="card border-0 shadow-lg p-4" 
            style={{ width: "500px", borderRadius: "24px", maxHeight: "80vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()} // Prevent close when clicking inside
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-0">{selectedStudent.studentName}</h5>
                <p className="text-muted small mb-0">Submission History</p>
              </div>
              <button className="btn-close" onClick={() => setSelectedStudent(null)}></button>
            </div>

            {selectedStudent.submissions.length > 0 ? (
              <div className="list-group list-group-flush">
                {selectedStudent.submissions.map((sub, idx) => (
                  <div key={idx} className="list-group-item border-0 bg-light rounded-3 mb-2 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold small text-uppercase text-primary">{sub.taskType || "Submission"}</span>
                      <span className="text-muted" style={{ fontSize: "11px" }}>
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h6 className="mb-1 mt-1">{sub.taskTitle || "General Task"}</h6>
                    
                    {/* Display score if it's a quiz, or a link if it's a file */}
                    {sub.score !== undefined ? (
                      <div className="badge bg-primary">Score: {sub.score}%</div>
                    ) : (
                      <a href={`http://localhost:5000/${sub.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-link p-0 text-decoration-none">
                        <i className="bi bi-download me-1"></i> View Attached File
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-folder-x fs-1 text-muted"></i>
                <p className="text-muted">No submissions found for this student.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorGradebook;