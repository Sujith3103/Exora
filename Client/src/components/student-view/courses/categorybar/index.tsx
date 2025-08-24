import { categories } from '@/components/navbar/student-navbar/exploreMenu'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const CategoryBar = () => {

    const navigate = useNavigate()

    const handleClick_Category = async (category:(typeof categories)[number]) => {
        navigate(`/courses?category=${category}&page=1&limit=10`)
    }
    
    return (
        <div
            className="[box-shadow:0_2px_4px_color-mix(in_oklch,oklch(27.54%_.1638_265.98deg)_8%,transparent),0_4px_12px_color-mix(in_oklch,oklch(27.54%_.1638_265.98deg)_8%,transparent)]
        flex p-1 justify-between items-center 
      ">
            <span className="font-bold text-gray-600 flex items-center ml-2">
                Development
            </span>
            <svg
                className="w-6 h-full text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {
                categories.map((category, index) => (
                    <>
                        <Button
                        key={index}
                            onClick={() => handleClick_Category(category)}
                            className="bg-white text-gray-600 font-semibold hover:underline hover:bg-white p-0 cursor-pointer">{category}</Button>
                    </>
                ))
            }
            <div></div>
        </div>
    )
}

export default CategoryBar
