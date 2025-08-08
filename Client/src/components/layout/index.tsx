import { Outlet } from "react-router-dom"
import NavBar from "../navbar"

const NavBarLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <NavBar/>

      <div className=" min-w-screen w-full flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default NavBarLayout
