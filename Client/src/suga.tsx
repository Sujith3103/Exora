import { useState } from "react"
import { Button } from "./components/ui/button"

const Suga = () => {


    const [count,setCount] = useState(0)

    return (
        <div className="">

        <Button className="bg-red-200 w-20" onClick={() => setCount(prev => prev+1)}>+</Button>
            {count }
        <Button>-</Button>
        </div>
    )
}

export default Suga
