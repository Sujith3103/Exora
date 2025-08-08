
import { Route, Routes } from "react-router-dom"
import StudentViewHomePage from "./pages/student-view/home"
import NavBarLayout from "./components/layout"
import AuthPage from "./pages/student-view/auth"
import LoginComponent from "./pages/student-view/auth/login"
import SignUpComponent from "./pages/student-view/auth/signup"

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<NavBarLayout />}>
          <Route path="" element={<StudentViewHomePage />} />
        </Route>
        <Route path="/" element={<NavBarLayout />}>
          <Route path="auth" element={<AuthPage />}>
            <Route path="login" element={<LoginComponent />} />
            <Route path="signup" element={<SignUpComponent />} />
          </Route>
        </Route>
      </Routes>

    </>
  )
}

export default App
