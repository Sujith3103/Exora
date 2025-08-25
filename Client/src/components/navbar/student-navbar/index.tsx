import { Button } from '@/components/ui/button'
import { Bell, CircleUser, GraduationCap, MenuSquareIcon, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import server from '@/api/axiosinstance';
import { updateUserRole } from '@/store/authSlice';
import ExploreMenu from './exploreMenu';
import { useState } from 'react';
import NavBar_sm from './small-screen';



const StudentNavbar = () => {

    const [isNavbar, setIsNavBar] = useState(false)

    const dispatch = useDispatch<AppDispatch>()

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user)
    console.log("user : ", user)

    const handleClick_ChangeRole = async () => {
        const response = await server.put('/user/change-role')
        if (response.data.success) {
            dispatch(updateUserRole("INSTRUCTOR"))
        }
    }

    return (
        <>
            {
                isNavbar && <NavBar_sm isNavbarOpen={isNavbar} setIsNavbarOpen={setIsNavBar} />
            }
            <div className="flex  items-center p-4 justify-between border-gray-300 [box-shadow:0_2px_4px_color-mix(in_oklch,oklch(27.54%_.1638_265.98deg)_8%,transparent),0_4px_12px_color-mix(in_oklch,oklch(27.54%_.1638_265.98deg)_8%,transparent)]
        
        ">
                <MenuSquareIcon className='md:hidden block' onClick={() => setIsNavBar(true)} />

                <Link to={'/'} className='flex items-center gap-2'>
                    <GraduationCap className='hidden md:block' />
                    <h1 className='text-2xl font-bold'>Exora</h1>
                </Link>

                <div className='flex items-center gap-5 cursor-pointer'>
                    <Link to={'/'} className='font-semibold hidden md:block'>Home</Link>
                    <ExploreMenu />
                    {
                        user?.role === "INSTRUCTOR" ?
                            <Button className='font-semibold hidden md:block'>Instructor</Button>
                            :
                            <Button onClick={handleClick_ChangeRole} className='bg-gray-300 hover:bg-gray-200 text-black hidden md:block'>Teach on Exora</Button>
                    }

                    <ShoppingCart />
                    {isAuthenticated ?
                        <div className='md:flex hidden items-center gap-5 '>
                            <Bell />
                            <Link to={`/profile/overview`}><CircleUser /></Link>
                        </div>
                        :
                        <div className='md:flex hidden items-center gap-3'>
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
        </>
    )
}

export default StudentNavbar
