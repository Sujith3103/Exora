import server from "@/api/axiosinstance";

export const fetchCourses = async({category,page,limit}: {category:string,page:number,limit:number}) =>{

    const response = await server.get('/courses',{
        params:{category,page,limit}
    })
    return response.data
}