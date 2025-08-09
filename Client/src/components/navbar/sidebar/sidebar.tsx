import React from 'react'
import { FileText, House, MenuIcon, MessageCircle, RollerCoaster } from 'lucide-react'
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { Link } from 'react-router-dom';

const SideBar = () => {

    const user = useSelector((state: RootState) => state.auth.user);


    const sidebarItmes = [
        {
            icon: <House />,
            title: 'Home',
            link: '/'
        },
        {
            icon: <MessageCircle />,
            title: 'Messages',
            link: 'messages'
        },
        {
            icon: <MenuIcon />,
            title: 'Tasks',
            link: 'tasks'
        },
        {
            icon:<FileText />,
            title:'Reviews',
            link: 'reviews',
            role:'instructor'
        },

    ]

    return (
        <div>

        <div>
            {
                sidebarItmes.map((items,index) => (
                    <Link key={index} className='flex items-center gap-2 mt-4' to={`${items.link}`}>

                        {items.icon}
                        <p>{items.title}</p>

                    </Link>
                ))
            }
        </div>

        </div>
    )
}

export default SideBar
