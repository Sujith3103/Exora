import { FileText, House, MenuIcon, MessageCircle } from 'lucide-react'
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { Link } from 'react-router-dom';

const SideBar = () => {

    const user = useSelector((state: RootState) => state.auth.user);


    const Instructor_sideBarItems = [
        {
            icon: <FileText />,
            title: 'Reviews',
            link: 'reviews',
            role: 'instructor'
        },
    ]

    const User_sidebarItmes = [
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


    ]

    return (
        <div>

            <div>
                {
                    User_sidebarItmes.map((items, index) => (
                        <Link key={index} className='flex items-center gap-2 mt-4' to={`${items.link}`}>

                            {items.icon}
                            <p>{items.title}</p>

                        </Link>
                    ))
                }
                {
                    user?.role === "INSTRUCTOR"?
                    Instructor_sideBarItems.map((items, index) => (
                        <Link key={index} className='flex items-center gap-2 mt-4' to={`${items.link}`}>

                            {items.icon}
                            <p>{items.title}</p>

                        </Link>
                    )):null
                }
            </div>

        </div>
    )
}

export default SideBar
