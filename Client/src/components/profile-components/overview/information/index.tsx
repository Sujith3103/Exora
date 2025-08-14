import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import server from '@/api/axiosinstance';
import { setProfile, setSecurity } from '@/store/profileSlice';
import InformationSkeleton from './informationSkeleton';

interface DisplayField {
    label: string;
    name: string;
    value: string | undefined;
    type: 'text' | 'email' | 'number' | 'date' | 'select' | 'description'
}

const OverViewUserInformation = () => {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.auth.user)
    const profile = useSelector((state: RootState) => state.profile.data)
    const security = useSelector((state: RootState) => state.profile.security)

    const [isEdit_Info, setIsEdit_Info] = useState(false)
    const [isEdit_Security, setIsEdit_Security] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const fields = useMemo<DisplayField[]>(() => {
        const baseFields: DisplayField[] = [
            { label: "Contact", name: 'contact', type: 'number' as const, value: profile?.contact?.toString() ?? undefined },
            { label: "Date of Birth", name: 'dob', type: 'date' as const, value: profile?.dob ?? undefined },
            { label: "Gender", name: 'gender', type: 'select' as const, value: profile?.gender ?? undefined },
            { label: "Profession", name: 'profession', type: 'text' as const, value: profile?.profession ?? undefined },
        ];
        if (user?.role === "INSTRUCTOR") {
            baseFields.push({ label: "About", name: 'about', type: 'description' as const, value: profile?.about ?? undefined });
        }
        return baseFields;
    }, [profile, user?.role]);


    const securityFields = useMemo<DisplayField[]>(() => [
        { label: "TwoStepVerification", name: 'twoStepVerification', type: 'select', value: security?.twoStepVerification ? 'enabled' : 'disabled' },
        { label: "RecoveryEmail", name: 'recoveryEmail', type: 'email', value: security?.recoveryEmail },
        { label: "RecoveryPhone", name: 'recoveryPhone', type: 'number', value: security?.recoveryPhone },
        { label: "LoginAlertsEnabled", name: 'loginAlertsEnabled', type: 'select', value: security?.loginAlertsEnabled ? 'enabled' : 'disabled' },
    ], [security]);

    const handleSubmit_userInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        const form = e.currentTarget;
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        const updatedjsonData = {
            ...jsonData,
        }
        console.log(updatedjsonData)
        const response = await server.post('/user/edit-profile', updatedjsonData)
        if (response) {
            dispatch(setProfile(response.data.createdProfile))
        }
        setIsLoading(false)
        setIsEdit_Info(false)
    }

    const handleSubmit_securityInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        const form = e.currentTarget;
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        const updatedjsonData = {
            ...jsonData,
            id: profile?.id,
            loginAlertsEnabled: jsonData.loginAlertsEnabled === 'enabled' ? true : false,
            twoStepVerification: jsonData.twoStepVerification === 'enabled' ? true : false,

        };

        const response = await server.post('/user/edit-security', updatedjsonData)
        if (response.data.success) {
            dispatch(setSecurity(response.data.createdSecurityData))
        }

        setIsLoading(false)
        setIsEdit_Security(false);
    };


    const renderFieldInput = (field: DisplayField) => {
        const isToggleField = field.value === "enabled" || field.value === "disabled";
        const gender = field.label === "Gender"

        if (gender) {
            return (
                <select
                    name={`${field.name}`}
                    defaultValue={field.value}
                    className="border rounded p-2 flex-1 cursor-pointer"
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

            )
        }

        if (isToggleField) {
            return (
                <select
                    name={`${field.name}`}
                    defaultValue={field.value}
                    className="border rounded p-2 flex-1"
                >
                    <option value="enabled">enabled</option>
                    <option value="disabled">disabled</option>
                </select>
            );
        }

        if (field.value === 'lastPasswordChange') {
            return field.value
        }

        if (field.type === 'description') {
            return <textarea
                id={`${field.name}`}
                name={`${field.name}`}
                rows={4}  // controls height
                placeholder="Enter a detailed description..."
                defaultValue={field.value}
            ></textarea>
        }

        return <Input id={`${field.name}`} name={`${field.name}`} type={field.type} defaultValue={field.value} className="flex-1" />;
    };
    
    if (!profile || !security) {
        return <InformationSkeleton />; // or skeleton
    }

    return (
        <div className={`${isLoading ? 'cursor-progress' : null}`}>
            <div className="max-w-screen xl:px-20 px-10 py-10 flex flex-wrap justify-between items-center">
                <div className="flex sm:flex-row flex-col w-full gap-10">

                    {/* Basic Information */}
                    <div className="sm:w-1/2 w-full">
                        <span className="font-bold mb-10">Basic-Information</span>
                        <form onSubmit={handleSubmit_userInfo}>
                            <Card className="w-full p-5 flex relative group">
                                <div className={`flex  gap-3 p-[3px] flex-wrap w-full`}>
                                    <Label className="w-40 flex-shrink-0">Name</Label>
                                    <p className='flex-1'>{user?.name}</p>
                                </div>
                                <div className={`flex  gap-3 p-[3px] flex-wrap w-full`}>
                                    <Label className="w-40 flex-shrink-0">Email</Label>
                                    <p className='flex-1'>{user?.email}</p>
                                </div>
                                {!isEdit_Info ? (
                                    <Edit
                                        size={20}
                                        onClick={() => setIsEdit_Info(true)}
                                        strokeWidth={1}
                                        className="absolute top-3 right-3 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                                    />
                                ) : (
                                    <Button
                                        disabled={isLoading}
                                        type='submit'
                                        className="absolute w-20 h-7 bg-blue-400 hover:bg-blue-400 top-3 right-3 transition-opacity duration-200 cursor-pointer"
                                    >
                                        Submit
                                    </Button >
                                )}

                                {fields.map(field => (
                                    <div key={field.label} className={`flex ${isEdit_Info ? "flex-col" : "items-center"} gap-3 p-[3px] flex-wrap w-full`}>
                                        <Label htmlFor={`${field.name}`} className="w-40">{field.label}</Label>
                                        {isEdit_Info ? (
                                            renderFieldInput(field)
                                        ) : (
                                            <div className="flex-1">{field.value || "none"}</div>

                                        )}
                                    </div>
                                ))}


                            </Card>
                        </form>
                    </div>

                    {/* Security Details */}
                    <div className="sm:w-1/2 h-full w-full">
                        <span className="font-bold">Security Details</span>
                        <form onSubmit={handleSubmit_securityInfo}>
                            <Card className="w-full p-5 relative group">
                                {!isEdit_Security ? (
                                    <Edit
                                        size={20}
                                        onClick={() => setIsEdit_Security(true)}
                                        strokeWidth={1}
                                        className="absolute top-3 right-3 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                                    />
                                ) : (
                                    <Button
                                        disabled={isLoading}
                                        type='submit'
                                        className="absolute w-20 h-7 bg-blue-400 hover:bg-blue-400 top-3 right-3 transition-opacity duration-200 cursor-pointer"
                                    >
                                        Submit
                                    </Button>
                                )}

                                {securityFields.map(field => (
                                    <div
                                        key={field.label}
                                        className={`flex ${isEdit_Security ? "flex-col" : "items-center"} gap-3 p-[3px] flex-wrap w-full`}
                                    >
                                        <Label
                                            htmlFor={`${field.name}`}
                                            className="w-40 flex-shrink-0"
                                        >
                                            {field.label}
                                        </Label>

                                        {isEdit_Security ? (
                                            renderFieldInput(field)
                                        ) : (
                                            <div className="flex-1">{field.value || "none"}</div>
                                        )}
                                    </div>
                                ))}



                                <div className={`flex  gap-3 p-[3px] flex-wrap w-full`}>
                                    <Label className="w-40 flex-shrink-0">LastPasswordChange</Label>
                                    <p className='flex-1'>none</p>
                                </div>
                            </Card>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OverViewUserInformation;
