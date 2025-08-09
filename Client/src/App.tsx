
import { Route, Routes } from "react-router-dom"
import StudentViewHomePage from "./pages/student-view/home"
import NavBarLayout from "./components/layout"
import AuthPage from "./pages/student-view/auth"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { type AppDispatch } from "./store"
import { loginSuccess } from "./store/authSlice"
import server from "./api/axiosinstance"
import ProfileLayout from "./components/layout/profile-layout"
import OverView from "./components/overview"


function App() {

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    async function fetchUserData() {
      const response = await server.get('/auth/check-auth')
      const accesstoken = sessionStorage.getItem('token')
      if (response.data.success) {
        if (accesstoken != null) {
          dispatch(loginSuccess({
            token: accesstoken,
            user: {
              id: response.data.data.user.id,
              name: response.data.data.user.name,
              email: response.data.data.user.email,
              role: response.data.data.user.role,
            }
          }))
        }
      }
    }
    fetchUserData()
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<NavBarLayout />}>
          <Route path="" element={<StudentViewHomePage />} />
        </Route>
        <Route path="/" element={<NavBarLayout />}>
          <Route path="auth" element={<AuthPage />}>
            <Route path="login" element={<AuthPage />} />
            <Route path="signup" element={<AuthPage />} />
          </Route>
        </Route>
        <Route path="/profile/:id" element={<ProfileLayout />}>
          <Route path="overview" element={<OverView />} />
        </Route>
      </Routes>

    </>
  )
}

export default App
