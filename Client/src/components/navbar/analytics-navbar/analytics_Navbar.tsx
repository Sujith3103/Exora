import { Button } from "@/components/ui/button"
import { ChevronLeft, BarChart3, Users, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"

type NavBarTab = {
  title: string
  id: string
  icon: React.ReactNode
}

const AnalyticsNavbar = () => {
  const navigate = useNavigate()

  const navBarTabs: NavBarTab[] = [
    {
      title: "Revenue and Sales",
      id: "revenue",
      icon: <BarChart3 className="w-4 h-4 mr-2" />,
    },
    {
      title: "User Growth",
      id: "usergrowth",
      icon: <Users className="w-4 h-4 mr-2" />,
    },
    {
      title: "Trends",
      id: "trends",
      icon: <TrendingUp className="w-4 h-4 mr-2" />,
    },
  ]

  return (
    <div className=" w-full h-full p-4 flex flex-col gap-3 border-r-1">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="cursor-pointer w-fit"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-2" /> Back
      </Button>

      {/* Header */}
      <div>
        <h3 className="text-3xl font-semibold mb-2 text-center">Analytics</h3>
        <hr className="border-gray-300" />
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-1">
        {navBarTabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className="justify-start w-full cursor-pointer"
            onClick={() => navigate(`/profile/instructor/analytics/${tab.id}`)}
          >
            {tab.icon}
            {tab.title}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default AnalyticsNavbar
