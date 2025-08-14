import { Edit, UserCircleIcon } from "lucide-react";

import banner_img from '../../../assets-static/subtle-img.jpeg'

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

import OverViewUserInformation from "./information";
import { useRef, } from "react";
import { Input } from "@/components/ui/input";
import server from "@/api/axiosinstance";
import { updateProfileImage } from "@/store/profileSlice";



const OverView = () => {

  //-----------------------STORE STUFF--------------------------
  const user = useSelector((state: RootState) => state.auth.user)
  const profile = useSelector((state: RootState) => state.profile.data)
  const loading = useSelector((state: RootState) => state.profile.loading);
  // const profile = useSelector((state: RootState) => state.profile.data)
  const dispatch = useDispatch<AppDispatch>()

  //---------------------------REF-------------------------------

  const fieldInpuRef = useRef<HTMLInputElement>(null)

  //----------------------------STATE----------------------------

  //----------------------FUNCTIONS-----------------------------
  const handleClick_editProfile = async () => {
    const file = fieldInpuRef.current?.files?.[0]
    if (!file) {
      return console.log("No file selected");
    }

    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const res = await server.post('/media/set-profile-img', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (res.data.success) {
        dispatch(updateProfileImage(res.data.url))
        console.log(res.data.url)
      }

    } catch (err) {
      console.error("Upload failed", err);
    }
  }

  //--------------------SKELETON COMPONENTS--------------------
  const AvatarSkeleton = () => (
    <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse border-2 border-white shadow-md" />
  );


  // useEffect(() => {
  //   console.log(profile)
  // }, [profile])

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md w-full mx-auto">
      {/* Header area */}
      <div className="relative bg-gradient-to-r h-48 rounded-t-lg">
        <img src={banner_img} className="h-full w-full" />
        {/* Placeholder for header image or background */}
      </div>

      {/* Profile icon overlapping header */}
      <div className="flex flex-col items-center md:w-1/4 w-1/2  -mt-16 z-1 group ">
        <div className="relative group">
          {loading ? (
            <AvatarSkeleton />
          ) : profile?.profileImg ? (
            <img
              src={profile.profileImg}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <UserCircleIcon
              strokeWidth={0.5}
              size={120}
              className="bg-white rounded-full border-4 cursor-pointer border-white shadow-lg"
            />
          )}

          <Edit
            size={17}
            className="absolute cursor-pointer right-0 opacity-0 group-hover:opacity-60"
            onClick={() => fieldInpuRef.current?.click()}
          />

          <Input
            ref={fieldInpuRef}
            type="file"
            name="profileImage"
            accept="image/*"
            className="hidden"
            onChange={handleClick_editProfile}
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">{user?.name}</p>
          <p className="text-gray-500 mt-1">{user?.email}</p>
        </div>
      </div>

      {/* profile data */}
      <div className="ml-[6%] mt-10 italic">
        <p className="font-bold">Personal Info</p>
        <p className="font-thin">You can change your personal</p>
        <p className="font-thin">settings here</p>
      </div>

      <OverViewUserInformation />

      {/* about me for instructors */}
      <div>

      </div>

    </div>
  );
};

export default OverView;
