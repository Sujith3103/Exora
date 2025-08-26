import { categories } from '@/components/navbar/student-navbar/exploreMenu'
import { Button } from '@/components/ui/button'
import type { ClickEvent } from '@/config/config'
import { trackClick } from '@/services/userService'
import type { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CategoryBar = () => {

    const navigate = useNavigate()

    const user = useSelector((state: RootState) => state.auth.user)
    const handleClick_Category = async (category: (typeof categories)[number]) => {
        navigate(`/courses?category=${category}&page=1&limit=10`)

        if (!user) return

        const clickEvent: ClickEvent = {
            type: 'category',
            targetId: category,
            userId: user?.id.toString()
        }
        await trackClick(clickEvent)
    }

    return (
        <div className="flex items-center p-1 gap-2 [box-shadow:0_2px_4px_color-mix(in_oklch,oklch(27.54%_.1638_265.98deg)_8%,transparent),0_4px_12px_color-mix(in_oklch,oklch(27.54%_.1638_265.98deg)_8%,transparent)]">
            {/* Fixed label + arrow */}
            <span className="font-bold text-gray-600 flex items-center ml-2">Development</span>
            <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>

            {/* Scrollable categories */}
            <div className="flex gap-2 overflow-x-auto  flex-1 justify-between thin-scrollbar">
                {categories.map((category, index) => (
                    <Button
                        key={index}
                        onClick={() => handleClick_Category(category)}
                        className="bg-white cursor-pointer text-gray-600 font-semibold hover:underline hover:bg-white p-1 whitespace-nowrap"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Optional ellipsis or other buttons */}
            <div></div>
        </div>

    )
}

export default CategoryBar
