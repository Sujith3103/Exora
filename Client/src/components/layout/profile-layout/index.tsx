import { LogOut } from 'lucide-react'
import SideBar from '../../navbar/sidebar/sidebar'
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Card, CardFooter } from '@/components/ui/card'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { logout } from '@/store/authSlice'

// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store";




const ProfileLayout = () => {

  const navigate = useNavigate()

  // const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch<AppDispatch>()

  const handleClick_logout = () => {
    dispatch(logout())
    navigate('/')
  }
  
  return (
    <div className="min-w-screen min-h-screen flex bg-amber-100">

      {/* Sidebar Card */}
      <Card className="w-1/6 bg-blue-200 p-3 flex flex-col h-screen rounded-none">

        {/* Top section (Profile + Sidebar) */}
        <div>
          {/* Profile link */}
          <div className="bg-blue-100 w-full text-center py-2">
            <Link to="overview" className="font-semibold block">
              Profile
            </Link>
          </div>

          {/* Sidebar */}
          <div className="bg-amber-50 p-2">
            <SideBar />
          </div>
        </div>

        {/* Logout footer fixed at bottom */}

        <div className="mt-auto w-full">
          <hr className="border-t border-black mb-3" />
          <CardFooter className="flex items-center gap-2 cursor-pointer hover:text-red-500" onClick={handleClick_logout}>
            <LogOut />
            <span>Log Out</span>
          </CardFooter>
        </div>
      </Card>

      {/* Main content */}
      <section className="flex-1">
        <Outlet />  
      </section>
    </div>
  )
}

export default ProfileLayout
