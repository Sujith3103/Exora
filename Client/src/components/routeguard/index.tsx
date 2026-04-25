import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../store"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { isloading, loginSuccess, logout } from "@/store/authSlice"
import server from "@/api/axiosinstance"

const RouteGuard = ({ element }: any) => {

    // const user = useSelector((state: RootState ) => state.auth.user)
    const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated)
    const isLoading = useSelector((state: RootState) => state.auth.loading)
    const user = useSelector((state: RootState) => state.auth.user)

    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            dispatch(isloading(true));

            try {
                const accessToken = sessionStorage.getItem("token");
                const storedUser = sessionStorage.getItem("user");
                // 🚪 No token or user -> logout immediately
                if (!accessToken || !storedUser) {
                    dispatch(logout());
                    return;
                }

                const user = JSON.parse(storedUser);
                
                dispatch(loginSuccess({ token: accessToken, user }));

                const response = await server.get("/auth/check-auth");

                if (!response.data?.success) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    dispatch(logout());
                }
            } catch (error: any) {
                if (error.response?.status === 401) {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    dispatch(logout());
                } else {
                    console.error("Auth check failed:", error);
                }
            } finally {
                dispatch(isloading(false));
            }
        };

        fetchUserData();
    }, []);


    if (isLoading) {
        console.log("loading")
        return element
    }

    if (!isAuthenticated && location.pathname.includes('profile')) {
        console.log("includes profile - routeguard", isAuthenticated)
        return <Navigate to={'/'} />
    }

    if (isAuthenticated && location.pathname.includes('auth')) {
        return navigate(-1)
    }

    if (isAuthenticated && location.pathname.includes('instructor') && user?.role != 'INSTRUCTOR') {
        return <Navigate to={'/'} />
    }

    if (isAuthenticated && location.pathname.includes('developer') && user?.role != 'DEVELOPER') {
        return navigate('/')
    }

    if (!isAuthenticated && location.pathname.includes('developer')) {
        return <Navigate to={"/auth/login" } />
    }

    if (location.pathname.includes('teaching') && user?.role == 'INSTRUCTOR') {
        return navigate(-1)
    }

    return element
}

export default RouteGuard
