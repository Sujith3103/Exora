import CommunicationNavbar from '@/components/navbar/communication-navbar/communicationNavbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const CommunicationLayout = () => {

    
    return (
        <div className='flex'>

            <CommunicationNavbar />

            <Outlet />

        </div>
    )
}

export default CommunicationLayout
