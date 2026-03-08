import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Instructor/Sidebar";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  
  // --- NEW STATES FOR ASSIGNMENT ---
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    category: "", 
    duration: "", 
    icon: "bi-laptop" 
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
      if (res.data.length > 0) setSelectedCourse(res.data[0]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // --- FETCH STUDENTS FOR ASSIGNMENT ---
  const handleOpenAssignModal = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/instructor/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllStudents(res.data);
      setShowAssignModal(true);
    } catch (err) {
      alert("Failed to fetch students");
    }
  };

  // --- ASSIGN LOGIC ---
  const handleAssignSubmit = async (studentId) => {
    try {
      await axios.post("http://localhost:5000/api/instructor/assign-student", {
        courseId: selectedCourse._id,
        studentId: studentId
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("Student assigned successfully!");
      setShowAssignModal(false);
      fetchCourses(); // Refresh data to show new student in the list
    } catch (err) {
      alert("Error assigning student");
    }
  };

  // --- REMOVE STUDENT LOGIC ---
  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Remove this student from the course?")) return;
    
    try {
      const res = await axios.post("http://localhost:5000/api/instructor/remove-student", {
        courseId: selectedCourse._id,
        studentId: studentId
      }, { headers: { Authorization: `Bearer ${token}` } });

      // Update the local state so the UI reflects the change immediately
      setSelectedCourse(res.data.course); 
      setCourses(prev => prev.map(c => c._id === res.data.course._id ? res.data.course : c));
      alert("Student removed.");
    } catch (err) {
      alert("Error removing student");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/courses/create", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ title: "", description: "", category: "", duration: "", icon: "bi-laptop" });
      fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  const getFileCounts = (uploads = []) => {
    const counts = { vids: 0, zips: 0, docs: 0 };
    uploads.forEach(file => {
      const name = file.fileName.toLowerCase();
      if (name.match(/\.(mp4|mov|avi)$/)) counts.vids++;
      else if (name.match(/\.(zip|rar|7z)$/)) counts.zips++;
      else counts.docs++;
    });
    return counts;
  };

  const availableIcons = ["bi-laptop", "bi-code-slash", "bi-palette", "bi-phone", "bi-cpu", "bi-globe"];

  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(8px)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100
  };

  const handleViewGradebook = (courseId) => {
  navigate(`/instructor/course/${courseId}/gradebook`);
};

  return (
    <div style={{ display: "flex", backgroundColor: "#F8F9FD", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "80px", padding: "40px" }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="fw-bold m-0">My Courses</h4>
          <button className="btn btn-primary shadow-sm" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg me-2"></i>Create Course
          </button>
        </div>
        <p className="text-muted small mb-4">Manage your online curriculum and track course assets.</p>

        <div className="row">
          {/* LEFT: Course Grid */}
          <div className="col-lg-7">
            <div className="row g-3">
              {courses.map((course) => (
                <div key={course._id} className="col-md-6">
                  <div 
                    className={`card border-0 shadow-sm p-3 h-100 ${selectedCourse?._id === course._id ? 'border border-primary' : ''}`}
                    style={{ borderRadius: "16px", cursor: "pointer" }}
                    onClick={() => setSelectedCourse(course)}
                  >

                    {/* NEW: Quick Gradebook Icon on the card */}
                  <div 
                    className="position-absolute" 
                    style={{ top: "15px", right: "15px" }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting the course when clicking the icon
                      handleViewGradebook(course._id);
                    }}
                    title="Quick View Gradebook"
                  >
                    <i className="bi bi-bar-chart-line text-primary opacity-50 hover-opacity-100"></i>
                  </div>
                    <div className="d-flex justify-content-between mb-3">
                       <div className="bg-light p-2 rounded-3 text-primary d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                          <i className={`bi ${course.icon || 'bi-journal-code'} fs-5`}></i>
                       </div>
                       <span className="text-muted small fw-bold mt-1">
                         <i className="bi bi-clock me-1"></i> {course.duration || "Self-Paced"}
                       </span>
                    </div>
                    <h6 className="fw-bold mb-1">{course.title}</h6>
                    <div className="text-muted small mb-2"><i className="bi bi-tag me-1"></i> {course.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Course Preview Pane */}
          <div className="col-lg-5">
            {selectedCourse ? (
              <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px" }}>
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary-subtle p-3 rounded-4 me-3 text-primary">
                    <i className={`bi ${selectedCourse.icon || 'bi-journal-code'} fs-3`}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">{selectedCourse.title}</h5>
                    <span className="text-muted small">{selectedCourse.category}</span>
                  </div>
                  <i 
                    className="bi bi-trash text-danger cursor-pointer ms-auto" 
                    style={{ fontSize: "1.2rem" }}
                    onClick={() => handleDeleteCourse(selectedCourse._id)}
                  ></i>
                </div>

                <h6 className="fw-bold small mb-2 text-muted text-uppercase">About Course</h6>
                <p className="text-muted small mb-4">{selectedCourse.description}</p>

                {/* ENROLLED STUDENTS SECTION */}
                <h6 className="fw-bold small mb-2 text-muted text-uppercase">
                  Enrolled Students ({selectedCourse.students?.length || 0})
                </h6>

                <div className="mb-4 pe-2" style={{ maxHeight: "180px", overflowY: "auto", scrollbarWidth: "thin" }}>
                  {selectedCourse.students && selectedCourse.students.length > 0 ? (
                    selectedCourse.students.map((std, index) => (
                      <div key={index} className="d-flex align-items-center justify-content-between mb-2 p-2 bg-light rounded-3">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" 
                            style={{ width: "32px", height: "32px", fontSize: "12px", fontWeight: "bold" }}
                          >
                            {std.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold small" style={{ fontSize: "13px", lineHeight: "1.1" }}>{std.name}</div>
                            <div className="text-muted" style={{ fontSize: "11px" }}>{std.email}</div>
                          </div>
                        </div>
                        <i 
                          className="bi bi-person-x text-danger cursor-pointer px-2 fs-5" 
                          title="Remove Student"
                          onClick={() => handleRemoveStudent(std._id)}
                        ></i>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 bg-light rounded-3">
                      <p className="text-muted small mb-0">No students enrolled yet.</p>
                    </div>
                  )}
                </div>

                {/* NEW: GRADEBOOK BUTTON */}
              <button 
                className="btn btn-dark w-100 mb-2 fw-bold py-2 shadow-sm" 
                style={{ borderRadius: "12px", backgroundColor: "#2B3674" }}
                onClick={() => handleViewGradebook(selectedCourse._id)}
              >
                <i className="bi bi-mortarboard me-2"></i> View Course Gradebook
              </button>

                <button 
                  className="btn btn-outline-primary w-100 mb-2 fw-bold py-2" 
                  style={{ borderRadius: "12px", border: "2px solid" }}
                  onClick={handleOpenAssignModal}
                >
                  <i className="bi bi-person-plus me-2"></i> Assign Student
                </button>

                <button 
                  className="btn btn-primary w-100 py-3 fw-bold mb-4" 
                  style={{ borderRadius: "12px" }}
                  onClick={() => navigate(`/courses/${selectedCourse._id}`)}
                >
                  Enter Course Dashboard
                </button>

                <h6 className="fw-bold small mb-3">Real-time Course Files</h6>
                <div className="d-flex justify-content-between">
                   {Object.entries(getFileCounts(selectedCourse.uploads)).map(([key, val]) => (
                     <div key={key} className="text-center" style={{ width: "30%" }}>
                        <div className={`p-3 rounded-3 mb-1 ${key==='vids'?'bg-info-subtle text-info':key==='zips'?'bg-danger-subtle text-danger':'bg-primary-subtle text-primary'}`}>
                          <i className={`bi ${key==='vids'?'bi-play-circle-fill':key==='zips'?'bi-file-earmark-zip-fill':'bi-file-earmark-text-fill'}`}></i>
                        </div>
                        <div className="fw-bold x-small">{val} {key.charAt(0).toUpperCase() + key.slice(1)}</div>
                     </div>
                   ))}
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">Select a course to view details</div>
            )}
          </div>
        </div>
      </div>

      {/* ASSIGN STUDENT MODAL */}
      {showAssignModal && (
        <div style={modalOverlayStyle}>
          <div className="card p-4 border-0 shadow-lg" style={{ width: "400px", borderRadius: "24px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0">Assign to {selectedCourse?.title}</h5>
              <button className="btn-close" onClick={() => setShowAssignModal(false)}></button>
            </div>
            <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: "300px" }}>
              {allStudents.map(student => (
                <div key={student._id} className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 mb-2">
                  <div className="d-flex align-items-center">
                    <img src={`https://ui-avatars.com/api/?name=${student.name}&background=random`} className="rounded-circle me-2" width="35" alt="" />
                    <span className="small fw-bold">{student.name}</span>
                  </div>
                  <button 
                    className="btn btn-sm btn-primary rounded-pill px-3" 
                    onClick={() => handleAssignSubmit(student._id)}
                  >
                    Assign
                  </button>
                </div>
              ))}
              {allStudents.length === 0 && <p className="text-center small text-muted">No students found.</p>}
            </div>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <div className="card p-4 border-0 shadow-lg" style={{ width: "450px", borderRadius: "24px" }}>
            <h4 className="fw-bold mb-4">New Online Course</h4>
            <form onSubmit={handleCreateCourse}>
              <input className="form-control border-0 bg-light p-3 mb-3" placeholder="COURSE TITLE" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              
              <label className="small fw-bold text-muted mb-2">CHOOSE ICON</label>
              <div className="d-flex gap-2 mb-3 overflow-auto pb-2">
                {availableIcons.map(icon => (
                  <div 
                    key={icon} 
                    className={`p-2 rounded-3 cursor-pointer border ${formData.icon === icon ? 'border-primary bg-primary-subtle' : 'bg-light'}`}
                    onClick={() => setFormData({...formData, icon})}
                  >
                    <i className={`bi ${icon} fs-5`}></i>
                  </div>
                ))}
              </div>

              <textarea className="form-control border-0 bg-light p-3 mb-3" placeholder="DESCRIPTION" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
              <div className="row mb-4">
                <div className="col"><input className="form-control border-0 bg-light p-3" placeholder="CATEGORY" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} /></div>
                <div className="col"><input className="form-control border-0 bg-light p-3" placeholder="DURATION" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} /></div>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light w-100 py-3 fw-bold" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-100 py-3 fw-bold">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;