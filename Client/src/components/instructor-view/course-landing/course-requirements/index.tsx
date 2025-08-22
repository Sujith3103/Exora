import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AppDispatch, RootState } from '@/store'
import { removeCourseRequirement, setCoursePricing, setCourseRequirements } from '@/store/courseSlice'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const CourseRequirements = () => {

  const dispatch = useDispatch<AppDispatch>()

  const requirements = useSelector((state: RootState) => state.course.courseRequirements)

  //   const [requirements, setRequirements] = useState<string[]>([])
  const [inputVal, setInputVal] = useState('')

  const pricingRef = useRef<HTMLInputElement>(null)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value)
  }

  const handleChange_Input = () => {
    const value = pricingRef.current?.value;
    if (value !== undefined) {
      const numberValue = parseFloat(value); // converts string to float
      dispatch(setCoursePricing(numberValue));
    }
  }


  const handleAdd = () => {
    if (inputVal.trim()) {
      dispatch(setCourseRequirements(inputVal))
      //   setRequirements(prev => [...prev, inputVal.trim()])
      setInputVal("")
    }
  }

  const handleRemove = (index: number) => {
    dispatch(removeCourseRequirement(index))
    // setRequirements(prev => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    console.log("req : ", requirements)
  }, [requirements])

  return (
    <>
      <div className="w-full max-w-lg mx-0 ">
        <h3 className="text-lg font-semibold tracking-tight text-gray-800">
          Course Requirements
        </h3>

        {/* List */}
        <div className="space-y-3">
          {requirements.length > 0 ? (
            requirements.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <li className="text-gray-700 text-sm">{item}</li>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic mt-4">No requirements added yet.</p>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3 mt-5">
          <Input
            value={inputVal}
            onChange={handleOnChange}
            placeholder="Enter a requirement..."
            className="flex-1"
          />
          <Button className="rounded-lg" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>
      <div className='flex gap-2'>
        <Label className="text-lg font-semibold tracking-tight text-gray-800">
          Pricing : $
        </Label>
        <Input className='w-20' ref={pricingRef} type='number' onChange={handleChange_Input} />
      </div>
    </>
  )
}

export default CourseRequirements
