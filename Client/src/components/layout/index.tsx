import { Outlet } from "react-router-dom"
import NavBar from "../navbar"

const NavBarLayout = () => {
  return (
    <div className="h-screen min-w-fit flex flex-col">
      <NavBar/>

      <div className="w-full flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default NavBarLayout
