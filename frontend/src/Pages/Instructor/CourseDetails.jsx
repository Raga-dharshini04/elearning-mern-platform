import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CreateQuiz from "./Createquiz";

const CourseDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("meetings");
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(res.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const calculateProgress = () => {
    if (!course) return 0;
    const meetings = course.meetings?.length || 0;
    const quizzes = course.quizzes?.length || 0;
    const uploads = course.uploads?.length || 0;
    const total = meetings + quizzes + uploads;
    if (total === 0) return 10;
    return Math.min(100, total * 20); 
  };

  const progress = calculateProgress();

  if (!course) return null;

  return (
    <div style={{ display: "flex", backgroundColor: "#F8F9FD", minHeight: "100vh" }}>
      
      {/* SIDE NAVIGATION */}
      <div style={courseNavStyle}>
        <div className="px-3 mb-4">
          <div className="badge bg-primary-subtle text-primary mb-2">Instructor Mode</div>
          <h5 className="fw-bold text-dark">{course.title}</h5>
        </div>

        <div className="d-flex flex-column gap-1 px-2">
          <button onClick={() => setActiveTab("meetings")} style={navItemStyle(activeTab === "meetings")}>
            <i className="bi bi-camera-video me-2"></i> Live Classes
          </button>
          <button onClick={() => setActiveTab("quiz")} style={navItemStyle(activeTab === "quiz")}>
            <i className="bi bi-patch-check me-2"></i> Create Quiz
          </button>
          <button onClick={() => setActiveTab("uploads")} style={navItemStyle(activeTab === "uploads")}>
            <i className="bi bi-file-earmark-arrow-up me-2"></i> Upload Assets
          </button>
          <button onClick={() => setActiveTab("practice")} style={navItemStyle(activeTab === "practice")}>
            <i className="bi bi-code-square me-2"></i> Practice Lab
          </button>
        </div>

        <div className="mt-auto p-3">
          <div className="card border-0 bg-light p-3" style={{ borderRadius: "15px" }}>
            <span className="small text-muted">Course Health</span>
            <div className="progress mt-2" style={{ height: "5px" }}>
              <div className="progress-bar bg-primary" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div style={{ flex: 1, padding: "35px", overflowY: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white p-2 rounded-3 shadow-sm" style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left text-muted"></i>
            </div>
            <h4 className="fw-bold m-0">
              {activeTab === "meetings" ? "Live Sessions" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h4>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "24px", minHeight: "75vh", backgroundColor: "#fff" }}>
          {activeTab === "meetings" && <LiveSessionsDesign courseId={id} course={course} onUpdate={fetchCourse} />}
          {activeTab === "quiz" && <QuizDesign courseId={id} fetchCourse={fetchCourse} existingQuizzes={course.quizzes} />}
          {activeTab === "uploads" && <UploadDesign courseId={id} existingUploads={course.uploads} onUploadSuccess={fetchCourse} />}
          {activeTab === "practice" && <PracticeDesign courseId={id} course={course} onSaveSuccess={fetchCourse} />}
        </div>
      </div>
    </div>
  );
};

// ------------------ COMPONENTS ------------------

const LiveSessionsDesign = ({ courseId, course, onUpdate }) => {
  const [newMeeting, setNewMeeting] = useState({ 
    topic: "", 
    meetLink: "", 
    scheduledDate: "", 
    startTime: "",
    period: "AM" // Explicitly track AM or PM
  });
  const token = localStorage.getItem("token");

  // --- HELPER: Display 24h time as 12h AM/PM in the list ---
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleAddMeeting = async () => {
    if (!newMeeting.topic || !newMeeting.startTime || !newMeeting.scheduledDate) {
      return alert("Please fill Topic, Date, and Time");
    }

    // --- LOGIC: Convert input + AM/PM dropdown to 24h for Database ---
    let [hours, minutes] = newMeeting.startTime.split(':');
    let h = parseInt(hours);
    
    // If user picks 2:00 and select 'PM', convert to 14:00
    if (newMeeting.period === "PM" && h < 12) h += 12;
    // If user picks 12:00 and select 'AM', convert to 00:00
    if (newMeeting.period === "AM" && h === 12) h = 0;
    
    const finalTime = `${h.toString().padStart(2, '0')}:${minutes}`;

    try {
      await axios.post(`http://localhost:5000/api/courses/${courseId}/meeting`, 
        { ...newMeeting, startTime: finalTime }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Reset form
      setNewMeeting({ topic: "", meetLink: "", scheduledDate: "", startTime: "", period: "AM" });
      onUpdate();
      alert("Session Scheduled Successfully!");
    } catch (err) { 
      alert("Error scheduling meeting. Please check your connection."); 
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Live Class Schedule</h3>
        <div className="bg-danger-subtle text-danger px-3 py-1 rounded-pill small fw-bold">
           <i className="bi bi-record-fill me-1"></i> Google Meet Integration
        </div>
      </div>

      {/* 1. INPUT FORM */}
      <div className="bg-light p-4 rounded-4 mb-4 border border-primary-subtle">
        <div className="row g-2">
          <div className="col-md-6">
            <label className="small fw-bold text-muted mb-1 ms-1">Session Topic</label>
            <input className="form-control" placeholder="e.g. UI Design Principles" value={newMeeting.topic} onChange={(e) => setNewMeeting({...newMeeting, topic: e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="small fw-bold text-muted mb-1 ms-1">Meet Link</label>
            <input className="form-control" placeholder="meet.google.com/xxx-xxxx" value={newMeeting.meetLink} onChange={(e) => setNewMeeting({...newMeeting, meetLink: e.target.value})} />
          </div>
          <div className="col-md-4 mt-2">
            <label className="small fw-bold text-muted mb-1 ms-1">Date</label>
            <input type="date" className="form-control" value={newMeeting.scheduledDate} onChange={(e) => setNewMeeting({...newMeeting, scheduledDate: e.target.value})} />
          </div>
          <div className="col-md-3 mt-2">
            <label className="small fw-bold text-muted mb-1 ms-1">Time</label>
            <input type="time" className="form-control" value={newMeeting.startTime} onChange={(e) => setNewMeeting({...newMeeting, startTime: e.target.value})} />
          </div>
          <div className="col-md-2 mt-2">
            <label className="small fw-bold text-muted mb-1 ms-1">AM/PM</label>
            <select className="form-select" value={newMeeting.period} onChange={(e) => setNewMeeting({...newMeeting, period: e.target.value})}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <div className="col-md-3 mt-2 d-flex align-items-end">
            <button className="btn btn-primary w-100 fw-bold" style={{ height: "38px" }} onClick={handleAddMeeting}>Schedule</button>
          </div>
        </div>
      </div>

      {/* 2. DISPLAY LIST */}
      <div className="row g-3">
        {!course.meetings || course.meetings.length === 0 ? (
          <div className="text-center py-4 text-muted">No classes scheduled yet.</div>
        ) : (
          course.meetings.map((m, i) => (
            <div key={i} className="col-12">
              <div className="card border-0 shadow-sm p-3 rounded-4 bg-white border-start border-primary border-5">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-1">{m.topic}</h6>
                    <small className="text-muted">
                      <i className="bi bi-calendar-event me-1"></i> {new Date(m.scheduledDate).toLocaleDateString()} | 
                      <i className="bi bi-clock ms-2 me-1"></i> {formatTime(m.startTime)}
                    </small>
                  </div>
                  <a href={m.meetLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold">
                    Start Class <i className="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const QuizDesign = ({ courseId, fetchCourse, existingQuizzes }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  if (showCreateForm) return <CreateQuiz courseId={courseId} onCancel={() => setShowCreateForm(false)} onSave={() => { setShowCreateForm(false); fetchCourse(); }} />;
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Quizzes</h3>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>+ Create Quiz</button>
      </div>
      {existingQuizzes?.map((q, i) => (
        <div key={i} className="p-3 border rounded-4 mb-2 d-flex justify-content-between align-items-center">
          <div><h6 className="fw-bold mb-0">{q.title}</h6><small>{q.questions?.length} Questions</small></div>
        </div>
      ))}
    </div>
  );
};

const UploadDesign = ({ courseId, onUploadSuccess, existingUploads }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token");

  // --- NEW DELETE LOGIC ---
  const handleDelete = async (assetId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/courses/${courseId}/assets/${assetId}`,
        {
           headers: { Authorization: `Bearer ${token}` } 
        }
      );
      alert("File deleted!");
      onUploadSuccess(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await axios.post(`http://localhost:5000/api/courses/${courseId}/upload`,formData,
        {
           headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } 
        }
      );
      setFile(null);
      onUploadSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Course Assets</h3>  

      {/* Upload Box */}
      <div className="border-2 border-dashed rounded-4 p-5 text-center mb-4" style={{ borderColor: "#E0E5F2" }}>
        <i className="bi bi-cloud-arrow-up fs-1 text-primary mb-3"></i>
        <h5>{file ? file.name : "Select PDF, Images, or ZIP"}</h5>
        <input type="file" id="fileInput" hidden onChange={(e) => setFile(e.target.files[0])} />
        <div className="mt-3">
          {!file ? (
            <button className="btn btn-light" onClick={() => document.getElementById('fileInput').click()}>Browse Files</button>
          ) : (
            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Confirm Upload"}
            </button>
          )}
        </div>
      </div>

      {/* List of Files with Delete Button */}
      <div className="list-group">
        {existingUploads?.map((f, i) => (
          <div key={i} className="list-group-item d-flex justify-content-between align-items-center border-0 bg-light rounded-3 mb-2 p-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-file-earmark-text fs-4 text-primary me-3"></i>
              <div>
                <span className="fw-semibold d-block">{f.fileName}</span>
<small className="text-muted">{f.size || "Unknown size"}</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <a href={f.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-white shadow-sm">
                <i className="bi bi-eye"></i>
              </a>
              {/* THE DELETE BUTTON */}
              <button onClick={() => handleDelete(f._id)} className="btn btn-sm btn-outline-danger">
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PracticeDesign = ({ courseId, course, onSaveSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newChallenge, setNewChallenge] = useState({ title: "", instructions: "" });

  const handleSave = async () => {
    if (!newChallenge.title || !newChallenge.instructions) {
      return alert("Please fill in both the title and instructions.");
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/practice`,
        newChallenge,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Practice Lab Updated!");
      setIsAdding(false);
      setNewChallenge({ title: "", instructions: "" });
      onSaveSuccess();
    } catch (err) {
      alert("Error saving challenge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Practice Lab</h3>
        {!isAdding && (
          <button 
            className="btn btn-primary px-4 rounded-pill fw-bold shadow-sm" 
            onClick={() => setIsAdding(true)}
          >
            + Set New Challenge
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="card border-0 bg-light p-4 rounded-4 shadow-sm">
          <h5 className="fw-bold mb-4">Set Practice Challenge</h5>
          
          <div className="mb-3">
            <label className="fw-bold text-dark mb-2">Challenge Title</label>
            <input 
              className="form-control border-0 shadow-sm p-3" 
              placeholder="e.g. Design a High-Conversion Hero Section"
              style={{ borderRadius: "12px", fontSize: "1rem" }}
              value={newChallenge.title}
              onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="fw-bold text-dark mb-2">Detailed Instructions</label>
            <textarea 
              className="form-control border-0 shadow-sm p-3" 
              rows="10"
              placeholder="🎯 The Mission... 📝 Key Requirements..."
              style={{ borderRadius: "12px", resize: "none", fontSize: "0.95rem", lineHeight: "1.6" }}
              value={newChallenge.instructions}
              onChange={(e) => setNewChallenge({ ...newChallenge, instructions: e.target.value })}
            />
          </div>

          <div className="d-flex gap-3 align-items-center">
            <button 
              className="btn btn-primary px-4 py-2 fw-bold" 
              style={{ borderRadius: "10px" }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Challenge"}
            </button>
            <button 
              className="btn btn-link text-muted fw-bold text-decoration-none" 
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {!course.practice || course.practice.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4 border border-dashed">
              <i className="bi bi-code-square text-muted mb-3 d-block" style={{ fontSize: "2.5rem" }}></i>
              <p className="text-muted fw-medium">No practice challenges set for this course.</p>
            </div>
          ) : (
            course.practice.map((lab, index) => (
              <div key={index} className="col-12">
                {/* Fix: Removed fixed heights. 
                   Added: border-start-primary for that vertical accent line in your screenshot.
                */}
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white border-start border-primary border-5 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                      {lab.challengeTitle || lab.title}
                    </h5>
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                      Active Lab
                    </span>
                  </div>
                  
                  {/* Fix: Removed .substring(0, 150). 
                    Added: whiteSpace: "pre-wrap" to preserve line breaks and spacing.
                  */}
                  <div 
                    className="text-muted" 
                    style={{ 
                      whiteSpace: "pre-wrap", 
                      wordBreak: "break-word",
                      fontSize: "0.95rem",
                      lineHeight: "1.7",
                      color: "#4A5568" 
                    }}
                  >
                    {lab.instructions}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ------------------ STYLES ------------------
const courseNavStyle = { width: "280px", backgroundColor: "#fff", borderRight: "1px solid #edf2f7", display: "flex", flexDirection: "column", paddingTop: "30px" };
const navItemStyle = (isActive) => ({ width: "100%", padding: "14px 20px", border: "none", borderRadius: "15px", backgroundColor: isActive ? "#F4F7FE" : "transparent", color: isActive ? "#4318FF" : "#A3AED0", fontWeight: isActive ? "700" : "500", textAlign: "left", fontSize: "14px" });

export default CourseDetail;