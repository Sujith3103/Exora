import { Outlet } from "react-router-dom"

const AuthPage = () => {
  return (
    <div className="w-full h-full p-20 flex bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 ">
      <div className="bg-white w-1/2 h-full">
        
      </div>
      <div className="h-full w-1/2">
        <Outlet />  
      </div>
    </div>
  )
}

export default AuthPage
