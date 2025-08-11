import React, { useState } from 'react'
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import server from '@/api/axiosinstance';

interface DisplayField {
    label: string;
    name: String;
    value: string | undefined;
    type: 'text' | 'email' | 'number' | 'date' | 'select'
}

const OverViewUserInformation = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const profile = useSelector((state: RootState) => state.profile.data)
    const security = useSelector((state: RootState) => state.profile.security)

    const [isEdit_Info, setIsEdit_Info] = useState(false)
    const [isEdit_Security, setIsEdit_Security] = useState(false)

    const fields: DisplayField[] = [
        { label: "Contact", name: 'contact', type: 'number', value: profile?.contact },
        { label: "Date of Birth", name: 'dob', type: 'date', value: profile?.dob },
        { label: "Gender", name: 'gender', type: 'select', value: profile?.gender },
        { label: "Profession", name: 'profession', type: 'text', value: profile?.profession },
    ];

    const securityFields: DisplayField[] = [
        { label: "TwoStepVerification", name: 'twoStepVerification', type: 'select', value: security?.twoStepVerification ? 'enabled' : 'disabled' },
        // { label: "LastPasswordChange", name: 'lastPasswordChange', value: security?.lastPasswordChange },
        { label: "RecoveryEmail", name: 'recoveryEmail', type: 'email', value: security?.recoveryEmail },
        { label: "RecoveryPhone", name: 'recoveryPhone', type: 'number', value: security?.recoveryPhone },
        { label: "LoginAlertsEnabled", name: 'loginAlertsEnabled', type: 'select', value: security?.loginAlertsEnabled ? 'enabled' : 'disabled' },
    ]

    const handleSubmit_userInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        const updatedjsonData = {
            ...jsonData,
            gender: jsonData.gender === "enabled" ? 'Male' : "Female"
        }
        console.log(updatedjsonData)
        const response = await server.post('/user/edit-profile', updatedjsonData)

        setIsEdit_Info(false)
    }

    const handleSubmit_securityInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
                    <option value="enabled">Male</option>
                    <option value="disabled">Female</option>
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

        return <Input id={`${field.name}`} name={`${field.name}`} type={field.type} defaultValue={field.value} className="flex-1" />;
    };

    return (
        <div>
            <div className="max-w-screen px-20 py-10 flex justify-between items-center">
                <div className="flex w-full gap-10">

                    {/* Basic Information */}
                    <div className="w-full">
                        <span className="font-bold mb-10">Basic-Information</span>
                        <form onSubmit={handleSubmit_userInfo}>
                            <Card className="w-full p-5 flex relative group">
                                <div className={`flex gap-3 p-[3px] w-full`}>
                                    <Label className="w-40">Name</Label>
                                    <p className='flex-1'>{user?.name}</p>
                                </div>
                                <div className={`flex gap-3 p-[3px] w-full`}>
                                    <Label className="w-40">Email</Label>
                                    <p className='flex-1'>{user?.email}</p>
                                </div>
                                {!isEdit_Info ? (
                                    <Edit
                                        size={20}
                                        onClick={() => setIsEdit_Info(true)}
                                        strokeWidth={1}
                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                    />
                                ) : (
                                    <Button
                                        type='submit'
                                        className="absolute w-20 h-7 bg-blue-400 hover:bg-blue-400 top-3 right-3 transition-opacity duration-200 cursor-pointer"
                                    >
                                        Submit
                                    </Button >
                                )}

                                {fields.map(field => (
                                    <div key={field.label} className={`flex ${isEdit_Info ? "flex-col" : "items-center"} gap-3 p-[3px] w-full`}>
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
                    <div className="w-full h-full">
                        <span className="font-bold">Security Details</span>
                        <form onSubmit={handleSubmit_securityInfo}>
                            <Card className="w-full p-5 relative group">
                                {!isEdit_Security ? (
                                    <Edit
                                        size={20}
                                        onClick={() => setIsEdit_Security(true)}
                                        strokeWidth={1}
                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                    />
                                ) : (
                                    <Button
                                        type='submit'
                                        className="absolute w-20 h-7 bg-blue-400 hover:bg-blue-400 top-3 right-3 transition-opacity duration-200 cursor-pointer"
                                    >
                                        Submit
                                    </Button>
                                )}

                                {securityFields.map(field => (
                                    <div key={field.label} className={`flex ${isEdit_Security ? "flex-col gap-2" : "items-center "} p-2 w-full`}>
                                        <Label htmlFor={`${field.name}`} className="w-1/2">{field.label}</Label>
                                        {isEdit_Security ? (
                                            renderFieldInput(field)
                                        ) : (
                                            <div className="flex-1">{field.value || "none"}</div>
                                        )}
                                    </div>
                                ))}
                                <div className={`flex  p-2 w-full`}>
                                    <Label className="w-1/2">LastPasswordChange</Label>
                                    <p>none</p>
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
