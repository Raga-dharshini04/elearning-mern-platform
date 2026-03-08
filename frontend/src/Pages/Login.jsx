import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginsvg from "../assets/Login.svg";

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0f2fe 0%, #fef2f2 50%, #f5f3ff 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.45)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    borderRadius: "30px",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
    overflow: "hidden",
    position: "relative",
    zIndex: 10,
  },
  inputField: {
    borderRadius: "10px",
    padding: "12px 15px",
    border: "1.5px solid #E2E8F0",
    fontSize: "0.95rem",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  btnPrimary: {
    backgroundColor: "#3182CE",
    color: "#fff",
    borderRadius: "10px",
    flex: 1,
    border: "none",
  },
  btnOutline: {
    backgroundColor: "transparent",
    color: "#3182CE",
    borderRadius: "10px",
    flex: 1,
    border: "1.5px solid #3182CE",
  },
  bubble: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(20px)",
    opacity: 0.6,
    zIndex: 1,
  },
  bubble1: { width: "300px", height: "300px", background: "#C4B5FD", top: "-50px", left: "-50px" },
  bubble2: { width: "200px", height: "200px", background: "#BAE6FD", bottom: "10%", right: "5%" },
  bubble3: { width: "150px", height: "150px", background: "#FED7AA", top: "20%", right: "15%" },
  bubble4: { width: "250px", height: "250px", background: "#FBCFE8", bottom: "-50px", left: "20%" },
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Login Clicked");
  console.log("Form Data:", formData);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData
    );

    console.log("Login Success:", res.data);

    // ✅ Store real token
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    // ✅ Redirect based on role
    if (res.data.role === "admin") {
      navigate("/admin");
    } else if (res.data.role === "instructor") {
      navigate("/instructor-dashboard");
    } else {
      navigate("/student/dashboard");
    }

  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Invalid Credentials");
  }
};

  return (
    <div style={styles.pageWrapper}>
      {/* Decorative Bubbles */}
      <div style={{ ...styles.bubble, ...styles.bubble1 }}></div>
      <div style={{ ...styles.bubble, ...styles.bubble2 }}></div>
      <div style={{ ...styles.bubble, ...styles.bubble3 }}></div>
      <div style={{ ...styles.bubble, ...styles.bubble4 }}></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            <div style={styles.glassCard}>
              <div className="row g-0 align-items-center">
                
                {/* Left Side: Form */}
                <div className="col-md-6 p-4 p-md-5">
                  <h2 className="fw-bold mb-1" style={{ color: "#4A5568" }}>Welcom Back!</h2>
                  <p className="small mb-4" style={{ color: "#3182CE" }}>Please log in to your account.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.inputField}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-muted mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={styles.inputField}
                      />
                    </div>

                    

                    <div className="d-flex gap-3">
                      <button type="submit" className="btn py-2 px-4 fw-bold" style={styles.btnPrimary}>
                        Sign In
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Side: Illustration */}
                <div className="col-md-6 d-none d-md-block text-center p-4">
                  <div style={styles.illustrationWrapper}>
                    <img 
                      src={loginsvg} 
                      alt="Login Illustration"
                      style={{ width: '100%', maxWidth: '350px' }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        body { margin: 0; padding: 0; overflow-x: hidden; }
        .form-control:focus {
          border-color: #3182CE;
          box-shadow: 0 0 0 0.2rem rgba(49, 130, 206, 0.1);
        }
      `}</style>
    </div>
  );
}

export default Login;