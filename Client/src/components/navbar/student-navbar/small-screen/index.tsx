import { X } from "lucide-react";

type NavBarProps = {
    isNavbarOpen: boolean;                       // current state
    setIsNavbarOpen: React.Dispatch<React.SetStateAction<boolean>>; // setter function
}

const NavBar_sm = ({ isNavbarOpen, setIsNavbarOpen }: NavBarProps) => {

    isNavbarOpen
    return (
        <div className='absolute backdrop-blur-md w-full h-full'>
            <div className="flex w-full h-full">
                <div className="w-1/2 bg-white pl-3">
                    <div className="h-20">

                    </div>
                    <div>
                        <p>somethin</p>
                        <p>somethin</p>
                        <p>somethin</p>
                        <p>somethin</p>
                        <p>somethin</p>
                    </div>
                </div>
                <X className="mt-5" onClick={() => setIsNavbarOpen(false)} />
            </div>
        </div>
    )
}

export default NavBar_sm
