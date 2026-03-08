import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [animate, setAnimate] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: ""
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/instructors");
      setInstructors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/admin/add-instructor",
        formData
      );

      setAnimate(false);
      setTimeout(() => setShowForm(false), 200);

      setFormData({
        name: "",
        email: "",
        password: "",
        dob: "",
        gender: ""
      });

      fetchInstructors();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this instructor?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/delete-instructor/${id}`
      );
      fetchInstructors();
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = () => {
    setShowForm(true);
    setTimeout(() => setAnimate(true), 10);
  };

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => setShowForm(false), 200);
  };

  return (
    <div style={{ display: "flex", background: "#F4F7FE", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ marginLeft: "80px", padding: "30px", width: "100%" }}>
        <div className="container-fluid">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold">Instructor Management</h3>
              <p className="text-muted small">
                Manage and monitor all instructors
              </p>
            </div>

            <button
              className="btn text-white"
              style={{
                background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                borderRadius: "12px",
                padding: "8px 18px"
              }}
              onClick={openModal}
            >
              + Add Instructor
            </button>
          </div>

          {/* STATS */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h6 className="text-muted">Total Instructors</h6>
                <h3 className="fw-bold">{instructors.length}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h6 className="text-muted">Active Faculty</h6>
                <h3 className="fw-bold text-success">92%</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h6 className="text-muted">Departments</h6>
                <h3 className="fw-bold">6</h3>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <table className="table align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {instructors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      No instructors found
                    </td>
                  </tr>
                ) : (
                  instructors.map((inst) => (
                    <tr key={inst._id}>
                      <td className="fw-bold">{inst.name}</td>
                      <td>{inst.email}</td>
                      <td>{inst.gender}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger rounded-3"
                          onClick={() => handleDelete(inst._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: animate ? "blur(6px)" : "blur(0px)",
            backgroundColor: animate
              ? "rgba(0,0,0,0.3)"
              : "rgba(0,0,0,0)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            transition: "all 0.3s ease"
          }}
        >
          <div
            style={{
              width: "450px",
              background: "#FFFFFF",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              transform: animate ? "scale(1)" : "scale(0.8)",
              opacity: animate ? 1 : 0,
              transition: "all 0.3s ease"
            }}
          >
            <h4 className="fw-bold mb-4 text-center">Add Instructor</h4>

            <form onSubmit={handleAddInstructor}>
              <input
                type="text"
                name="name"
                className="form-control mb-3"
                placeholder="Name"
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="Email"
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                className="form-control mb-3"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="dob"
                className="form-control mb-3"
                onChange={handleChange}
              />

              <select
                name="gender"
                className="form-control mb-4"
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-light border rounded-3"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn text-white rounded-3"
                  style={{
                    background:
                      "linear-gradient(135deg,#6366F1,#8B5CF6)"
                  }}
                >
                  Save Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructors;