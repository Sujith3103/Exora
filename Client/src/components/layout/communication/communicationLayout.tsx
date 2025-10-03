import CommunicationNavbar from '@/components/navbar/communication-navbar/communicationNavbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const CommunicationLayout = () => {


    return (
        <div className="flex w-full h-screen">
            <CommunicationNavbar />

            <div className="flex-1 overflow-x-auto">
                <Outlet />
            </div>
        </div>

    )
}

export default CommunicationLayout
