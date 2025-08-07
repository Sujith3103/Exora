import { Outlet } from "react-router-dom"

const AuthPage = () => {
    return (
        <div className="w-full h-full px-5 py-15  md:py-20 lg:px-50 flex bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 ">
            <div className="lg:bg-white w-full h-full xl:p-10 flex justify-center xl:justify-end ">
                
                {/* image */}

                <div className="h-full w-full bg-white p-8 rounded-xl shadow-2xl max-w-md xl:w-1/2">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AuthPage
