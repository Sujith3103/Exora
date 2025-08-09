import { Button } from '@/components/ui/button'
import { Bell, CircleUser, GraduationCap, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useSelector } from "react-redux";
import type { RootState } from "../../../store";



const StudentNavbar = () => {

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user)
    console.log("user : ",user)

    return (
        <div className='flex items-center p-3 justify-between'>
            
            <Link to={'/'} className='flex items-center gap-2'>
                <GraduationCap />
                <h1 className='text-2xl font-bold'>Exora</h1>
            </Link>

            <div className='flex items-center gap-5 cursor-pointer'>
                <Link to={'/'} className='font-semibold'>Home</Link>
                <Link to={'/'} className='font-semibold'>Explore</Link>
                <Link to={'/'} className='font-semibold'>Teach on Exora</Link>
                <ShoppingCart />
                {isAuthenticated ?
                    <div className='flex items-center gap-5'>
                        <Bell />
                        <Link to={`/profile/:${user?.id}/overview`}><CircleUser /></Link>
                    </div>
                    :
                    <div className='flex items-center gap-3'>
                        <Button className='bg-white border-purple-300 hover:bg-white cursor-pointer border rounded-[5px] text-purple-800 font-semibold text-[1rem] '>
                            <Link to={'/auth/login'}> Login </Link>
                        </Button>
                        <Button className=' bg-[var(--ud-btn-background-color)] border rounded-[5px] font-bold hover:bg-[var(--ud-btn-background-color)] cursor-pointer'>
                            <Link to={'/auth/signup'}>Sign Up</Link>
                        </Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default StudentNavbar
