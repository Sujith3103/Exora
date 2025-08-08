import server from "@/api/axiosinstance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const SignUpComponent = () => {

    const [inputval, setInputval] = useState({
        name: String,
        email: String,
        password: String
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget; // This is definitely the form
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());
        const response = await server.post('/auth/register', jsonData)
        console.log("respone after signup : ", response)
    };


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="bg-white w-full h-full flex flex-col gap-7">
                    <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
                        <span className="w-1/15 bg-blue-200 rounded"></span>
                        <div className="flex-1">
                            <Label htmlFor="name" className="">Username</Label>
                            <Input id="name" name="name" type="text" autoComplete="current-name" required placeholder="enter your Name" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
                        </div>
                    </div>
                    <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
                        <span className="w-1/15 bg-blue-200 rounded"></span>
                        <div className="flex-1">
                            <Label htmlFor="email" className="">Email</Label>
                            <Input id="email" name="email" type="email" autoComplete="current-email" required placeholder="enter your email" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
                        </div>
                    </div>
                    <div className="w-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded-xl bg-white flex p-2 gap-5  ">
                        <span className="w-1/15 bg-blue-200 rounded"></span>
                        <div className="flex-1">
                            <Label htmlFor="password" className="font-">Password</Label>
                            <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="password here" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7" />
                        </div>
                    </div>
                    <Button className="bg-blue-400 h-15 hover:bg-blue-300 mtext-d" type="submit">Sign Up</Button>
                </div>
            </form>
        </>
    )
}

export default SignUpComponent
