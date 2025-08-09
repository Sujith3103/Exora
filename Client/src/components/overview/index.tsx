import { UserCircleIcon } from "lucide-react";

import banner_img from '../../assets-static/subtle-img.jpeg'

import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const OverView = () => {

  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md w-full mx-auto">
      {/* Header area */}
      <div className="relative bg-gradient-to-r from-cyan-400 to-blue-500 h-48 rounded-t-lg">
        <img src={banner_img} className="h-full w-full" />
        {/* Placeholder for header image or background */}
      </div>

      {/* Profile icon overlapping header */}
      <div className="flex flex-col items-center md:w-1/4 w-full -mt-16 z-1">
        <UserCircleIcon
          strokeWidth={0.5}
          size={120}
          className="bg-white rounded-full border-4 border-white shadow-lg"
        />
        <div className="mt-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">{user?.name}</p>
          <p className="text-gray-500 mt-1">{user?.email}</p>
        </div>
      </div>

    </div>
  );
};

export default OverView;
