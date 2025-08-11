import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import { Navigate, useLocation } from "react-router-dom"

const RouteGuard = ({element}:any) => {

    // const user = useSelector((state: RootState ) => state.auth.user)
    const isAuthenticated = useSelector((state : RootState) => state.auth?.isAuthenticated)
    const isloading = useSelector((state: RootState) => state.auth.loading)

    const location = useLocation()

    if(isloading){
        console.log("loading")
        return element
    }

    if(!isAuthenticated && location.pathname.includes('profile')){
        console.log("includes profile - routeguard",isAuthenticated)
        return <Navigate to={'/'}/>
    }

    if(isAuthenticated && location.pathname.includes('auth')){
        return <Navigate to={'/'} />
    }

  return element
}

export default RouteGuard
