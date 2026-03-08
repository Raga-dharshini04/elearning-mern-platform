import React, { useState } from "react";
import axios from "axios";

const CreateQuiz = ({ courseId, onCancel, onSave }) => {
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 }
    ]);
  };

  const handleSubmit = async () => {
    if (!title) return alert("Please enter a quiz title");
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/quiz`,
        { title, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Quiz Created!");
      onSave(); // Refresh data and hide form
    } catch (err) {
      console.error(err);
      alert("Failed to save quiz");
    }
  };

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">New Assessment</h4>
        <button className="btn btn-outline-danger btn-sm" onClick={onCancel}>Cancel</button>
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">Quiz Title</label>
        <input
          className="form-control form-control-lg"
          placeholder="e.g. JavaScript Basics Final"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ borderRadius: "12px", border: "2px solid #eee" }}
        />
      </div>

      {questions.map((q, index) => (
        <div key={index} className="mb-4 p-4 border-0 shadow-sm bg-white rounded-4" style={{ border: "1px solid #f0f0f0" }}>
          <div className="d-flex justify-content-between mb-3">
            <span className="badge bg-primary">Question {index + 1}</span>
          </div>
          
          <input
            className="form-control mb-3 fw-bold"
            placeholder="Enter your question here..."
            value={q.question}
            onChange={(e) => {
              const updated = [...questions];
              updated[index].question = e.target.value;
              setQuestions(updated);
            }}
          />

          <div className="row g-2">
            {q.options.map((opt, i) => (
              <div className="col-md-6" key={i}>
                <div className="input-group mb-2">
                  <span className="input-group-text bg-white border-end-0">
                    <input 
                      type="radio" 
                      name={`correct-${index}`} 
                      checked={q.correctAnswer === i}
                      onChange={() => {
                        const updated = [...questions];
                        updated[index].correctAnswer = i;
                        setQuestions(updated);
                      }}
                    />
                  </span>
                  <input
                    className="form-control border-start-0"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[index].options[i] = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="d-flex gap-3">
        <button className="btn btn-light px-4" onClick={addQuestion} style={{ borderRadius: "10px" }}>
          <i className="bi bi-plus-lg me-2"></i>Add Question
        </button>
        <button className="btn btn-primary px-5" onClick={handleSubmit} style={{ borderRadius: "10px", backgroundColor: "#4318FF" }}>
          Publish Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;