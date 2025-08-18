import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const CourseRequirements = () => {
  const [requirements, setRequirements] = useState<string[]>([])
  const [inputVal, setInputVal] = useState("")

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value)
  }

  const handleClick = () => {
    if (!inputVal.trim()) return // prevent empty input
    setRequirements(prev => [...prev, inputVal.trim()])
    setInputVal("") // clear input after add
  }

  return (
    <div>
      <h3 className="text-md font-semibold">Course Requirements</h3>

      <ul className="list-disc pl-5 mt-2">
        {requirements.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <div className="flex w-1/3 mt-5 gap-3">
        <Input value={inputVal} onChange={handleOnChange} placeholder="Add a requirement..." />
        <Button onClick={handleClick}>Add</Button>
      </div>
    </div>
  )
}

export default CourseRequirements
