import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SignUpComponent = () => {

    const handleSubmit = async() => {
        
    }

    return (
        <>
            <form>
                <div className="bg-white w-full h-full flex flex-col gap-7">
                    <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
                        <span className="w-1/15 bg-blue-200 rounded"></span>
                        <div className="flex-1">
                            <Label htmlFor="name" className="">Username</Label>
                            <Input id="name" type="text" placeholder="enter your Name" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
                        </div>
                    </div>
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
                    <Button className="bg-blue-400 h-15 hover:bg-blue-300 mtext-d" onSubmit={handleSubmit}>Sign Up</Button>
                </div>
            </form> 
        </>
    )
}

export default SignUpComponent
