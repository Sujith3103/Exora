import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import { Navigate, useLocation } from "react-router-dom"

const RouteGuard = ({element}:any) => {

    // const user = useSelector((state: RootState ) => state.auth.user)
    const isAuthenticated = useSelector((state : RootState) => state.auth?.isAuthenticated)
    const isloading = useSelector((state: RootState) => state.auth.loading)

    const location = useLocation()

    if(isloading){
        console.log("yes")
        return element
    }

    if(!isAuthenticated && location.pathname.includes('profile')){
        console.log("s",isAuthenticated)
        return <Navigate to={'/'}/>
    }

  return element
}

export default RouteGuard
