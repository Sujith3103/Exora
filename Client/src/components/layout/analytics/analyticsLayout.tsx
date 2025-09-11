import AnalyticsNavbar from "@/components/navbar/analytics-navbar/analytics_Navbar"
import { Outlet } from "react-router-dom"

const AnalyticsLayout = () => {
    return (
        <div className="h-screen w-full flex">
            {/* Sidebar */}
            <div className="w-1/7 h-full">
                <AnalyticsNavbar />
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default AnalyticsLayout
