
import { Route, Routes } from "react-router-dom"
import StudentViewHomePage from "./pages/student-view/home"
import NavBarLayout from "./components/layout"
import AuthPage from "./pages/student-view/auth"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { type AppDispatch } from "./store"
import { isloading, loginSuccess, logout } from "./store/authSlice"
import server from "./api/axiosinstance"
import ProfileLayout from "./pages/student-view/profile-layout"
import OverView from "./components/profile-components/overview"
import RouteGuard from "./components/routeguard"


function App() {

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    async function fetchUserData() {
      dispatch(isloading(true));
      try {
        const accesstoken = sessionStorage.getItem('token');

        // if no token, logout immediately
        if (!accesstoken) {
          dispatch(logout()); 
          dispatch(isloading(false));
          return;
        }

        const response = await server.get('/auth/check-auth');

        if (response.data.success) {
          dispatch(loginSuccess({
            token: accesstoken,
            user: {
              id: response.data.data.user.id,
              name: response.data.data.user.name,
              email: response.data.data.user.email,
              role: response.data.data.user.role,
            }
          }));
        } else {
          // token expired or server says unauthorized
          sessionStorage.removeItem('token');
          dispatch(logout());
        }
      } catch (error: any) {
        // if the server returns 401 Unauthorized
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          dispatch(logout());
        }
      } finally {
        dispatch(isloading(false));
      }
    }
    fetchUserData();
  }, [dispatch]);


  return (
    <>
      <Routes>
        <Route path="/" element={<RouteGuard element={<NavBarLayout />} />}>
          <Route path="" element={<StudentViewHomePage />} />
        </Route>
        <Route path="/" element={<RouteGuard element={<NavBarLayout />} />} >
          <Route path="auth" element={<AuthPage />}>
            <Route path="login" element={<AuthPage />} />
            <Route path="signup" element={<AuthPage />} />
          </Route>
        </Route>
        <Route path="/profile" element={<RouteGuard element={<ProfileLayout />} />} >
          <Route path="overview" element={<OverView />} />
        </Route>
      </Routes>

    </>
  )
}

export default App
