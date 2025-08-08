import server from "@/api/axiosinstance"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs } from "@/components/ui/tabs"
import { type AppDispatch } from "@/store"
import { loginFailure, loginSuccess } from "@/store/authSlice"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"

const AuthPage = () => {

    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState("")
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formValue, setFormValue] = useState({
        name: "",
        email: "",
        password: "",
        checkbox: false,
    })



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsError(false)
        setIsLoading(true)
        try {
            const form = e.currentTarget;
            const formData = new FormData(form);
            const jsonData = Object.fromEntries(formData.entries());
            let response;

            if (activeTab === "signup") {
                response = await server.post('/auth/register', jsonData);
            } else if (activeTab === 'login') {
                const updatedjson = { ...jsonData, rememberMe: formValue.checkbox };
                response = await server.post('/auth/login', updatedjson);
                if (response.data.success) {
                    dispatch(loginSuccess({
                        user: response.data.userData,
                        token: response.data.token
                    }))
                    sessionStorage.setItem('token', response.data.token)
                    navigate('/')
                } else {
                    dispatch(loginFailure(response.data.message || "Login failed"));
                }
            }
        } catch (error: any) {
            setIsError(true)
            if (error.response) {
                console.error("Server error:", error.response.data);
            } else {
                console.error("Request failed:", error.message || error);
            }
        }
        setIsLoading(false)
    };


    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const action = pathSegments[2];
        setActiveTab(action)
    }, [location])

    return (
        <div style={{ cursor: isLoading ? 'progress' : 'default' }} className="w-full h-full px-5 py-15  md:py-20 lg:px-50 flex bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 ">
            <div className="lg:bg-white w-full h-full xl:p-10 flex justify-center xl:justify-end ">

                {/* image */}

                <Card className="h-full w-full bg-white p-8 rounded-xl shadow-2xl max-w-md xl:w-1/2">
                    <Tabs>
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white w-full h-full flex flex-col gap-7">
                                {activeTab === "signup" &&
                                    <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
                                        <span className="w-1/15 bg-blue-200 rounded"></span>
                                        <div className="flex-1">
                                            <Label htmlFor="name" className="">Username</Label>
                                            <Input id="name" name="name" value={formValue.name} onChange={(e) => setFormValue(prev => ({ ...prev, name: e.target.value }))} type="text" autoComplete="current-name" required placeholder="enter your Name" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
                                        </div>
                                    </div>
                                }
                                <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
                                    <span className="w-1/15 bg-blue-200 rounded"></span>
                                    <div className="flex-1">
                                        <Label htmlFor="email" className="">Email</Label>
                                        <Input id="email" name="email" value={formValue.email} onChange={(e) => setFormValue(prev => ({ ...prev, email: e.target.value }))} type="email" autoComplete="current-email" required placeholder="enter your email" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
                                    </div>
                                </div>
                                <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
                                    <span className="w-1/15 bg-blue-200 rounded"></span>
                                    <div className="flex-1">
                                        <Label htmlFor="password" className="font-">Password</Label>
                                        <Input id="password" name="password" value={formValue.password} onChange={(e) => setFormValue(prev => ({ ...prev, password: e.target.value }))} type="password" autoComplete="current-password" required placeholder="password here" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
                                    </div>
                                </div>
                                {
                                    activeTab === "login" &&
                                    <div className="flex justify-around items-center">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="remember" checked={formValue.checkbox} onClick={() => setFormValue(prev => ({ ...prev, checkbox: !prev.checkbox }))} className="border-blue-300 rounded-none border-2" />
                                            <Label htmlFor="remember" className="text-blue-400 text-sm font-semibold">Remember Me</Label>
                                        </div>
                                        <Link to={'/auth/forgot-password'} className="text-blue-400 text-sm font-semibold">Forgot Password</Link>
                                    </div>
                                }
                                <Button className="bg-blue-400 h-15 hover:bg-blue-300 mtext-d" disabled={isLoading} type="submit">{activeTab === "login" ? "Login" : "Sign Up"}</Button>
                            </div>
                        </form>
                        {
                            isError &&
                            <p className="text-red-500 animate-shake mt-3"><i>Invalid UserName or Password</i></p>
                        }
                    </Tabs>


                </Card>
            </div>
        </div>
    )
}

export default AuthPage
