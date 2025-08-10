import { UserCircleIcon } from "lucide-react";

import banner_img from '../../../assets-static/subtle-img.jpeg'

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface DisplayField {
  label: string;
  value: string | undefined;
}


const OverView = () => {

  const user = useSelector((state: RootState) => state.auth.user)
  const profile = useSelector((state: RootState) => state.profile.data)

  const fields: DisplayField[] = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },

    { label: "Contact", value: profile?.contact },
    { label: "About", value: profile?.about },
    { label: "Date of Birth", value: profile?.dob },
    { label: "Gender", value: profile?.gender },
    { label: "Profession", value: profile?.profession },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md w-full mx-auto">
      {/* Header area */}
      <div className="relative bg-gradient-to-r h-48 rounded-t-lg">
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

      {/* profile data */}
      <div className="ml-[6%] mt-10 italic">
        <p className="font-bold">Personal Info</p>
        <p className="font-thin">You can change your personal</p>
        <p className="font-thin">settings here</p>
      </div>

      <div className="max-w-screen px-20 py-10 flex justify-between items-center">
        <div className="flex w-full gap-10">
          <div className="w-full">
            <span className="font-bold mb-10">Basic-Information</span>
            <Card className="w-full p-5">
              {
                fields.map(field => (
                  <div className="flex flex-col gap-3">
                    <Label>{field.label}</Label>
                    <Input />
                  </div>
                ))
              }
            </Card>
          </div>

          <div className="w-full h-full">
            <span className="font-bold">Security Details</span>
            <Card className="w-full p-5">
              Security details
            </Card>
          </div>
        </div>
      </div>
      {/* about me for instructors */}
      <div>

      </div>

    </div>
  );
};

export default OverView;
