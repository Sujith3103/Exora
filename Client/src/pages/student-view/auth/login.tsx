import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

const LoginComponent = () => {
  return (
    <>
      <form action="">
        <div className="bg-white w-full h-full flex flex-col gap-7">
          <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
            <span className="w-1/15 bg-blue-200 rounded"></span>
            <div className="flex-1">
              <Label htmlFor="email" className="">Email</Label>
              <Input id="email" type="email" placeholder="enter your email" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
            </div>
          </div>
          <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
            <span className="w-1/15 bg-blue-200 rounded"></span>
            <div className="flex-1">
              <Label htmlFor="password" className="font-">Password</Label>
              <Input id="password" type="password" placeholder="password here" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
            </div>
          </div>
          <div className="flex justify-around items-center">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" className="border-blue-300 rounded-none border-2" />
              <Label htmlFor="remember" className="text-blue-400 text-sm font-semibold">Remember Me</Label>
            </div>
            <Link to={'/auth/forgot-password'} className="text-blue-400 text-sm font-semibold">Forgot Password</Link>
          </div>
          <Button className="bg-blue-400 h-15 hover:bg-blue-300 text-md">Login</Button>
        </div>
      </form>
    </>
  )
}

export default LoginComponent
