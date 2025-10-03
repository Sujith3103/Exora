import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { RootState } from '@/store'
import { ChevronLeft, Megaphone, MessageCircleMore } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const CommunicationNavbar = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const navigate = useNavigate()
    const location = useLocation()

    const [activePath, setActivePath] = useState<string>('')

    const instructorNavbarItems = [
        {
            icon: <Megaphone className="w-5 h-5" />,
            title: 'Announcements',
            id: 'announcement',
            link: '/profile/communication/announcement',
        },
    ]

    const studentNavbarItems = [
        {
            icon: <MessageCircleMore className="w-5 h-5" />,
            title: 'Messages',
            id: 'messages',
            link: '/profile/communication/messages',
        },
    ]

    useEffect(() => {

        const name = location.pathname.split('/')[3]
        setActivePath(name)

    }, [location])

    return (
        <Card className="h-screen lg:min-w-fit gap-0 p-0 rounded-none lg:block hidden">
            <Button variant={'ghost'} className='w-20 mt-2 cursor-pointer' onClick={() => navigate('/profile/overview')}>
                <ChevronLeft />
                Back
            </Button>

            <p className="text-3xl p-5 pt-3  text-center font-semibold font-display">Communication</p>
            <hr className="border-gray-300" />
            <div className="flex flex-col p-5 gap-2">
                {studentNavbarItems.map((item) => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className={`justify-start gap-2 hover:bg-gray-200 cursor-pointer ${item.id === activePath ? 'underline underline-offset-2' : ''}`}
                        onClick={() => navigate(item.link)}
                    >
                        {item.icon}
                        <span className='text-[15px]'>{item.title}</span>
                    </Button>
                ))}

                {user?.role === 'INSTRUCTOR' &&
                    instructorNavbarItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={`justify-start gap-2 hover:bg-gray-200 cursor-pointer ${item.id === activePath ? 'underline underline-offset-2' : ''}`}
                            onClick={() => navigate(item.link)}
                        >
                            {item.icon}
                            <span className='text-[15px]'>{item.title}</span>
                        </Button>
                    ))}
            </div>
        </Card>
    )
}

export default CommunicationNavbar
