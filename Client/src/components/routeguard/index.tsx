import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import { Navigate, useLocation } from "react-router-dom"

const RouteGuard = ({element}:any) => {

    const user = useSelector((state: RootState ) => state.auth.user)
    const isAuthenticated = useSelector((state : RootState) => state.auth.user)

    const location = useLocation()

    if(!isAuthenticated && location.pathname.includes('profile')){
        return <Navigate to={'/'}/>
    }

  return element
}

export default RouteGuard
