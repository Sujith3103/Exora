import { LogOut, Menu, X } from 'lucide-react'
import SideBar from '../../../components/navbar/sidebar/sidebar'
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Card, CardFooter } from '@/components/ui/card'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { logout } from '@/store/authSlice'
import { useEffect, useState } from 'react'
import { FetchUserProfileData, FetchUserSecurityData } from '@/services/userService'
import { profileSliceLoadinStart, profileSliceLoadinStop, setProfile, setSecurity } from '@/store/profileSlice'

const ProfileLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [sidebarOpen, setSidebarOpen] = useSidebarInitial();

  const handleClick_logout = () => {
    dispatch(logout())
    navigate('/')
  }

  function useSidebarInitial() {

    // run only once on mount → initial state depends on width

    const [sidebarOpen, setSidebarOpen] = useState(() => {

      return window.innerWidth > 1024; // true if below lg

    });



    return [sidebarOpen, setSidebarOpen] as const;

  }

  const handle_fetchprofile = async () => {
    console.log("fetching profile")
    dispatch(profileSliceLoadinStart())
    const response = await FetchUserProfileData()
    if (response.data.success) {
      console.log(response.data)
      dispatch(setProfile(response.data.cachedData ?? response.data.profileData))
      console.log("fetched profile")
    }

  }

  const handle_fetchsecurity = async () => {
    dispatch(profileSliceLoadinStart())
    const response = await FetchUserSecurityData()
    if (response.data.success) {
      console.log("security :", response.data)
      dispatch(setSecurity(response.data.cachedData ?? response.data.securityData))
    }
    dispatch(profileSliceLoadinStop())
  }

  useEffect(() => {
    handle_fetchprofile()
    handle_fetchsecurity()
  }, [])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen ">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between  bg-blue- 200 p-3 lg:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
        <span className="font-semibold">Profile</span>
      </div>

      {/* Sidebar */}
      <div className='relative w-[232px] '>
        <Card
          className={`fixed top-0 left-0 bottom-0 z-10  w-[232px] bg-gray-200 p-3
           flex flex-col           
           transform transition-transform duration-300
            ${!sidebarOpen ? '-translate-x-full lg:translate-x-0' : ''}
          `}
        >
          {/* Top section */}
          <div className="w-50 fixed">
            <div className="bg-gray-300 w-full text-center py-2 flex">
              <Link to="overview" className="font-semibold block ml-15" onClick={() => setSidebarOpen(false)}>
                Profile
              </Link>
              {sidebarOpen && <X onClick={() => setSidebarOpen(false)} className='ml-auto' />}
            </div>
            <div className=" p-2">
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
      </div>

      {/* Main content */}
      <section className="flex-1 overflow-x-hidden lg:ml-0">
        <Outlet />
      </section>
    </div>
  )
}

export default ProfileLayout
