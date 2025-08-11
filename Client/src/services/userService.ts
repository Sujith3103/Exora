import server from "@/api/axiosinstance"
// import { useSelector } from "react-redux";
// import type { RootState } from "../store";


// const profile = useSelector((state: RootState) => state.profile.data)
// const security = useSelector((state:  RootState) => state.profile.security)

export const FetchUserProfileData = async() => {

    const response = await server.get('/user/get-profile')

    return response
    
}
export const FetchUserSecurityData = async() => {

    const response = await server.get('/user/get-security')

    return response
}