import server from '@/api/axiosinstance'
import type { AppDispatch } from '@/store'
import { removeResource, type Lectures, type Resources } from '@/store/courseSlice'
import { ArrowUpRightFromSquareIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

type ResourceComponentProp = {
  lecture: Lectures
}

const ResourceComponent = ({ lecture }: ResourceComponentProp) => {

  const dispatch = useDispatch<AppDispatch>()

  const [isloading, setIsLoading] = useState(false)


  const handleClick_DeleteResource = async (resource: Resources) => {
    setIsLoading(true)
    try {
      const response = await server.delete(`/course/sections/${lecture.sectionId}/lectures/${lecture.id}/resources/${resource.id}`)

      if (response.data.success && resource.id) {
        dispatch(removeResource({ lectureId: lecture.id, resourceId: resource.id, sectionId: lecture.sectionId }))
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err)
      setIsLoading(false)

    }
  }

  return (
    <>
      <hr className='border-gray-300' />
      <div className={`p-2 ${isloading ? 'cursor-progress' : null}`}>
        <p className=' font-semibold text-sm '>External Resources</p>
        {lecture.Resource?.map(resource => (
          <div
            key={resource.id}
            className="flex items-center justify-between mt-2"
          >
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 items-center text-gray-500"
            >
              <ArrowUpRightFromSquareIcon strokeWidth={1} size={15} />
              <p>{resource.title}</p>
            </a>

            <Trash2
              onClick={() => handleClick_DeleteResource(resource)}
              size={15}
              
              className="text-red-500 cursor-pointer hover:scale-110 transition"
            />
          </div>
        ))}
      </div>
      <hr className='border-gray-300 mb-2' />
    </>
  )
}

export default ResourceComponent
