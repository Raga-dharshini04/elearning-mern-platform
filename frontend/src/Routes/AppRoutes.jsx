import { Routes, Route } from "react-router-dom";

import Login from "../Pages/Login";

import ProtectedRoute from "../Components/ProtectedRoute";
import AdminHome from "../Pages/AdminDashboard/AdminHome";
import Instructors from "../Pages/AdminDashboard/Instructors";
import Reports from "../Pages/AdminDashboard/Reports";
import AdminSettings from "../Pages/AdminDashboard/AdminSettings";
import InstructorHome from "../Pages/Instructor/InstructorHome";
import MyStudents from "../Pages/Instructor/MyStudents";
import MyCourses from "../Pages/Instructor/MyCourses";
import CourseDetails from "../Pages/Instructor/CourseDetails";
import InstructorSettings from "../Pages/Instructor/InstructorSettings";
import StudentHome from "../Pages/Student/StudentHome";
import StudentCourseView from "../Pages/Student/StudentCourseView";
import StudentCourses from "../Pages/Student/StudentCourses";
import InstructorGradebook from "../Pages/Instructor/InstructorGradebook";
import StudentSettings from "../Pages/Student/StudentSettings";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      
      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminHome />
          </ProtectedRoute>
        }
      />

      <Route
      path="/admin/instructors"
      element={<ProtectedRoute allowedRole="admin">
        <Instructors/>
      </ProtectedRoute>
      }
      />

      <Route 
      path="/admin/reports"
      element={
        <ProtectedRoute allowedRole="admin">
          <Reports/>
        </ProtectedRoute>
      }
      />

      <Route
      path="/admin/settings"
      element={
        <ProtectedRoute allowedRole="admin">
          <AdminSettings/>
        </ProtectedRoute>
      }
      />

      <Route
        path="/instructor-dashboard"
        element={
          <ProtectedRoute allowedRole="instructor">
            <InstructorHome />
          </ProtectedRoute>
        }
      />

      <Route
  path="/instructor/students"
  element={
    <ProtectedRoute allowedRole="instructor">
      <MyStudents />
    </ProtectedRoute>
  }
/>

<Route
  path="/instructor/courses"
  element={
    <ProtectedRoute allowedRole="instructor">
      <MyCourses />
    </ProtectedRoute>
  }
/>

<Route 
path="/courses/:id"
element={<ProtectedRoute allowedRole="instructor">
  <CourseDetails/>
</ProtectedRoute>
}
/>

<Route path="/instructor/settings" element={<ProtectedRoute allowedRole="instructor">
  <InstructorSettings/>
</ProtectedRoute>
}
/>

<Route path="/instructor/course/:courseId/gradebook" 
element={<ProtectedRoute allowedRole="instructor"><InstructorGradebook />
</ProtectedRoute>} />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentHome />
          </ProtectedRoute>
        }
      />

      <Route 
  path="/student/course/:id" 
  element={
    <ProtectedRoute allowedRole="student">
      <StudentCourseView />
    </ProtectedRoute>
  } 
/>

<Route path="/student/my-courses" element={<ProtectedRoute allowedRole="student">
  <StudentCourses/>
</ProtectedRoute>
}
/>

<Route path="/student/settings" element={<ProtectedRoute allowedRole="student">
  <StudentSettings/>
</ProtectedRoute>} />

    </Routes>
    
  );
}

export default AppRoutes;