import { LogOut, Menu } from 'lucide-react'
import SideBar from '../../../components/navbar/sidebar/sidebar'
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Card, CardFooter } from '@/components/ui/card'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { logout } from '@/store/authSlice'
import { useEffect, useState } from 'react'
import { FetchUserProfileData, FetchUserSecurityData } from '@/services/userService'
import { setProfile, setSecurity } from '@/store/profileSlice'

const ProfileLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleClick_logout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handle_fetchprofile = async () => {
    const response = await FetchUserProfileData()
    if (response.data.success) {
      console.log(response.data)
      dispatch(setProfile(response.data.cachedData ?? response.data.profileData))
    }
  }

  const handle_fetchsecurity = async () => {
    const response = await FetchUserSecurityData()
    if (response.data.success) {
      dispatch(setSecurity(response.data.cachedData ?? response.data.securityData))
    }
  }

  useEffect(() => {
    handle_fetchprofile()
    handle_fetchsecurity()
  }, [])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-amber-100">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between  bg-blue-200 p-3 lg:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
        <span className="font-semibold">Profile</span>
      </div>

      {/* Sidebar */}
      <Card
        className={`bg-blue-200 p-3 flex-col ${sidebarOpen? 'h-screen' : null} rounded-none z-10 transform transition-transform duration-300 
        fixed lg:static top-0 left-0 w-64
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
        lg:flex`}
      >
        {/* Top section */}
        <div className="flex-1">
          <div className="bg-blue-100 w-full text-center py-2">
            <Link to="overview" className="font-semibold block" onClick={() => setSidebarOpen(false)}>
              Profile
            </Link>
          </div>
          <div className="bg-amber-50 p-2">
            <SideBar />
          </div>
        </div>

        {/* Logout footer */}
        <div className="mt-auto w-full">
          <hr className="border-t border-black mb-3" />
          <CardFooter
            className="flex items-center gap-2 cursor-pointer hover:text-red-500"
            onClick={handleClick_logout}
          >
            <LogOut />
            <span>Log Out</span>
          </CardFooter>
        </div>
      </Card>

      {/* Main content */}
      <section className="flex-1 overflow-x-hidden lg:ml-0">
        <Outlet />
      </section>
    </div>
  )
}

export default ProfileLayout
