import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useGetMessageById } from '../../hooks/useGetMessagebyId'

const ChatArea = () => {

    const location = useLocation()

    const { data, isLoading, isError, refetch } = useGetMessageById(location.pathname.split('/')[4])

    useEffect(() => {
        refetch()
    }, [location])

    return (
        <div>
            
        </div>
    )
}

export default ChatArea
