import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#6366F1" }}
    >
      <div className="container">
        <span className="navbar-brand text-white fw-bold">
          E-Learning
        </span>

        <div>
          {role === "admin" && (
            <button
              className="btn btn-light me-2"
              onClick={() => navigate("/admin-dashboard")}
            >
              Admin Dashboard
            </button>
          )}

          {role === "instructor" && (
            <button
              className="btn btn-light me-2"
              onClick={() => navigate("/instructor-dashboard")}
            >
              Instructor Dashboard
            </button>
          )}

          {role === "student" && (
            <button
              className="btn btn-light me-2"
              onClick={() => navigate("/student-dashboard")}
            >
              Student Dashboard
            </button>
          )}

          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;