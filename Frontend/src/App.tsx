
import './App.css'
import Loginpage from './Components/Pages/Login'
import Registration from './Components/Pages/Registration'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserManagementDashboard from './Components/Pages/HomePage';
import UserLogoutPrivateRoute from './ProtectiveRoute/Logoutroute';
import UserPrivateRoute from './ProtectiveRoute/Loginroute';
import DetailPage from './Components/Pages/Detailpage';
function App() {


  return (
    <>
      <Router>
        <Toaster position="top-center" />

        <Routes>
          <Route
            path="/"
            element={<UserLogoutPrivateRoute element={<Loginpage />} />}
          />
          <Route
            path="/login"
            element={<UserLogoutPrivateRoute element={<Loginpage />} />}
          />
          <Route
            path="/register"
            element={<UserLogoutPrivateRoute element={<Registration />} />}
          />
          <Route
            path="/dashboard"
            element={<UserPrivateRoute element={<UserManagementDashboard />} />}
          />
          <Route
            path="/viewpage/:postid"
            element={<UserPrivateRoute element={<DetailPage />} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App
