import { Outlet } from "react-router-dom"
import NavBar from "../navbar"

const Layout = () => {
  return (
    <div className="h-screen">
      <NavBar/>

      <div className="h-[92.2%] ">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
