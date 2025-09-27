import server from "@/api/axiosinstance"
import AnalyticsNavbar from "@/components/navbar/analytics-navbar/analytics_Navbar"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

const AnalyticsLayout = () => {

    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)


    const handleClick_Menu = () => {
        setIsOpenMenu((prev) => !prev)
    }

    return (
        <div className="h-screen w-full flex">
            {/* Sidebar */}
            <div className={`min-w-1/7 h-full  lg:block z-10
                ${isOpenMenu ? 'absolute bg-white' : 'hidden'}
                `}>
                {
                    isOpenMenu && <X className="absolute -right-10 top-3 bg-white border-2 border-gray" onClick={handleClick_Menu} />
                }
                <AnalyticsNavbar />
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full overflow-y-auto">
                <div className="w-full bg-black lg:hidden" onClick={handleClick_Menu}>
                    <Menu className="text-white ml-2" />
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default AnalyticsLayout
