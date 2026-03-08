import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "./StudentSidebar";

const StudentCourseView = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [completedItems, setCompletedItems] = useState([]); 
  const token = localStorage.getItem("token");

  // State for Labs
  const [showModal, setShowModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionLink, setSubmissionLink] = useState("");

  // State for Quizzes
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Fetch Course Details
        const courseRes = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(courseRes.data);

        // 2. Fetch ACTUAL submissions from the database to handle refresh
        const subRes = await axios.get(`http://localhost:5000/api/student/submissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Populate the completedItems array with IDs from the database
        if (subRes.data.submittedIds) {
          setCompletedItems(subRes.data.submittedIds);
        }
      } catch (err) {
        console.error("Initialization Error", err);
      }
    };
    if (id && token) fetchInitialData();
  }, [id, token]);

  const handleFinishQuiz = async () => {
    let correctCount = 0;
    currentQuiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correctCount++;
    });

    const percentage = Math.round((correctCount / currentQuiz.questions.length) * 100);
    setFinalScore(percentage);
    setQuizFinished(true);

    try {
      await axios.post("http://localhost:5000/api/student/submit", {
        courseId: id,
        type: "quiz",
        itemId: currentQuiz._id,
        score: percentage,
        totalQuestions: currentQuiz.questions.length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Lock the quiz locally so it updates immediately
      setCompletedItems(prev => [...prev, currentQuiz._id]);
    } catch (err) {
      console.error("Quiz save error", err);
    }
  };

  const handleSubmitLab = async () => {
    if (!submissionLink) return alert("Please provide a link!");
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/student/submit", {
        courseId: id,
        type: "lab",
        itemId: selectedLab._id,
        submissionLink: submissionLink
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompletedItems(prev => [...prev, selectedLab._id]);
      setShowModal(false);
      setSubmissionLink("");
      alert("Lab submitted successfully!");
    } catch (err) {
      alert("Error submitting lab.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!course) return <div className="p-5 text-center">Loading course content...</div>;

  // Logic to calculate progress percentage
const totalItems = (course.quizzes?.length || 0) + (course.practice?.length || 0);
const completedCount = completedItems.length;
const progressPercentage = totalItems > 0 
  ? Math.round((completedCount / totalItems) * 100) 
  : 0;

  return (
    <div style={{ display: "flex", backgroundColor: "#F4F7FE", minHeight: "100vh" }}>
      <StudentSidebar />
      <div style={{ marginLeft: "80px", padding: "30px", width: "100%" }}>
        
        {/* Course Header */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "20px" }}>
          <div className="d-flex align-items-center">
            <div className="bg-primary-subtle p-3 rounded-4 me-3 text-primary">
              <i className={`bi ${course.icon || "bi-journal-code"} fs-2`}></i>
            </div>
            <div>
              <h3 className="fw-bold mb-0" style={{ color: "#2B3674" }}>{course.title}</h3>
              <p className="text-muted mb-0">Instructor: {course.instructorId?.name}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex gap-3 mb-4">
          {["content", "meetings", "quizzes", "labs"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`btn rounded-pill px-4 fw-bold ${activeTab === tab ? "btn-primary shadow-sm" : "btn-light text-muted"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* CONTENT */}
            {activeTab === "content" && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
                <h5 className="fw-bold mb-3 text-dark">Study Materials</h5>
                {course.uploads?.map((file, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-2">
                    <span className="fw-bold small">{file.fileName}</span>
                    <a href={file.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary rounded-pill px-3">Download</a>
                  </div>
                ))}
              </div>
            )}

            {/* 2. MEETINGS TAB (RESTORED) */}
            {activeTab === "meetings" && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
                <h5 className="fw-bold mb-3">Live Class Schedule</h5>
                {course.meetings?.length > 0 ? course.meetings.map((m, i) => (
                  <div key={i} className="p-3 border-start border-primary border-4 bg-light rounded-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-1">{m.topic}</h6>
                        <p className="small text-muted mb-0">
                          {new Date(m.scheduledDate).toLocaleDateString()} • {m.startTime}
                        </p>
                      </div>
                      <a href={m.meetLink} target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill btn-sm px-4">Join Class</a>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x fs-1 text-muted"></i>
                    <p className="text-muted mt-2">No live classes scheduled for today.</p>
                  </div>
                )}
              </div>
            )}

            {/* QUIZZES */}
            {activeTab === "quizzes" && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
                <h5 className="fw-bold mb-3 text-dark">Available Quizzes</h5>
                {course.quizzes?.map((q, i) => {
                  const isDone = completedItems.includes(q._id);
                  return (
                    <div key={i} className="d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded-3">
                      <span className="fw-bold">{q.title}</span>
                      {isDone ? (
                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 border-0">
                          <i className="bi bi-check2-circle me-1"></i> Completed
                        </span>
                      ) : (
                        <button className="btn btn-dark btn-sm rounded-pill px-4" onClick={() => {
                          setCurrentQuiz(q);
                          setAnswers(new Array(q.questions.length).fill(null));
                          setCurrentQuestionIndex(0);
                          setQuizFinished(false);
                          setShowQuiz(true);
                        }}>Start Quiz</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* LABS */}
            {activeTab === "labs" && (
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
                <h5 className="fw-bold mb-3 text-dark">Practical Labs</h5>
                {course.practice?.map((lab, i) => {
                  const isDone = completedItems.includes(lab._id);
                  return (
                    <div key={i} className="p-3 border-start border-info border-4 bg-light rounded-4 mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className={`fw-bold mb-1 ${isDone ? 'text-muted' : ''}`}>{lab.challengeTitle}</h6>
                          <p className="small text-muted mb-0">{isDone ? "Submission Received" : lab.instructions}</p>
                        </div>
                        {isDone ? (
                          <span className="text-success fw-bold small"><i className="bi bi-check-lg"></i> Submitted</span>
                        ) : (
                          <button className="btn btn-outline-dark btn-sm rounded-pill px-3" onClick={() => { setSelectedLab(lab); setShowModal(true); }}>
                            Submit Lab
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LAB MODAL */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, background: "rgba(0,0,0,0.4)" }}>
          <div className="card border-0 shadow-lg p-4" style={{ borderRadius: "25px", width: "100%", maxWidth: "500px" }}>
            <h5 className="fw-bold mb-3">Submit Lab</h5>
            <input type="url" className="form-control rounded-pill bg-light border-0 p-3 mb-4" placeholder="URL Link" value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} />
            <div className="d-flex gap-2">
                <button className="btn btn-light w-100 rounded-pill fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary w-100 rounded-pill fw-bold" style={{ backgroundColor: "#4318FF" }} onClick={handleSubmitLab} disabled={submitting}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {showQuiz && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1060, background: "rgba(0,0,0,0.7)" }}>
          <div className="card border-0 shadow-lg p-4" style={{ borderRadius: "25px", width: "100%", maxWidth: "600px" }}>
            {!quizFinished ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="text-muted mb-0">{currentQuiz.title}</h6>
                  <span className="badge bg-primary-subtle text-primary rounded-pill">Q {currentQuestionIndex + 1}/{currentQuiz.questions.length}</span>
                </div>
                <h5 className="mb-4 fw-bold">{currentQuiz.questions[currentQuestionIndex].question}</h5>
                <div className="d-grid gap-2 mb-4">
                  {currentQuiz.questions[currentQuestionIndex].options.map((option, idx) => (
                    <button key={idx} className={`btn p-3 rounded-4 text-start fw-bold ${answers[currentQuestionIndex] === idx ? 'btn-primary' : 'btn-light border'}`} onClick={() => {
                      const newAns = [...answers]; newAns[currentQuestionIndex] = idx; setAnswers(newAns);
                    }}>{option}</button>
                  ))}
                </div>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-light rounded-pill px-4 fw-bold" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)}>Back</button>
                  {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                    <button className="btn btn-success rounded-pill px-4 fw-bold" onClick={handleFinishQuiz} disabled={answers[currentQuestionIndex] === null}>Finish</button>
                  ) : (
                    <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={answers[currentQuestionIndex] === null}>Next</button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="display-4 text-primary mb-3"><i className="bi bi-trophy"></i></div>
                <h2 className="fw-bold">Quiz Done!</h2>
                <p className="fs-4">Score: {finalScore}%</p>
                <button className="btn btn-primary rounded-pill px-5 mt-3" onClick={() => setShowQuiz(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseView;