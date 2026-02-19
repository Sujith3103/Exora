import { Button } from '@/components/ui/button'
import { Bell, CircleUser, GraduationCap, MenuSquareIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import {  useSelector } from "react-redux";
import type { RootState } from "../../../store";
// import server from '@/api/axiosinstance';
// import { updateUserRole } from '@/store/authSlice';
import ExploreMenu from './exploreMenu';
import { useState } from 'react';
import NavBar_sm from './small-screen';



const StudentNavbar = () => {

    const [isNavbar, setIsNavBar] = useState(false)

    // const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user)
    // const handleClick_ChangeRole = async () => {
    //     const response = await server.put('/user/change-role')
    //     if (response.data.success) {
    //         dispatch(updateUserRole("INSTRUCTOR"))
    //     }
    // }

    return (
        <>
            {
                isNavbar && <NavBar_sm isNavbarOpen={isNavbar} setIsNavbarOpen={setIsNavBar} />
            }
            <div className="flex  items-center p-4 justify-between border-gray-300 [box-shadow:0_px_4px_color-mix(in_oklch,oklch(27.54%_.1638_265.98deg)_8%,transparent),0_4px_12px_color-mix(in_oklch,oklch(27.54%_.1638_265.98deg)_8%,transparent)]
        
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
                            <Button className='bg-gray-300 hover:bg-gray-200 text-black hidden md:block'>
                                <Link to={'/teaching'} >Teach on Exora</Link>
                            </Button>
                    }

                    {/* Cart */}
                    <button aria-label="Shopping cart" className="relative hover:text-purple-700 cursor-pointer" onClick={() => navigate('/cart')}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" viewBox="0 0 24 24">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-purple-600 rounded-full text-white text-xs font-semibold px-1.5">2</span>
                    </button>

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
