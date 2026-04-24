"use client";

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const DeveloperLayout = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <div className="h-screen w-full flex overflow-hidden">
            {/* Sidebar (desktop) */}
            <section className="hidden lg:block w-1/6 bg-slate-800 text-white p-5 space-y-10">
                <h1 className="text-center font-bold text-xl">DEV DASHBOARD</h1>

                <div>
                    <h3
                        className="cursor-pointer hover:bg-slate-700 p-2 text-center rounded"
                        onClick={() =>
                            navigate("/developer/dashboard/dead-letter-queue")
                        }
                    >
                        DLQ Explorer
                    </h3>
                </div>
            </section>

            {/* Mobile Sidebar */}
            {open && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="bg-black/50 w-full"
                        onClick={() => setOpen(false)}
                    />

                    <div className="w-64 bg-slate-800 text-white p-5 space-y-10 absolute left-0 top-0 h-full">
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-lg">DEV DASHBOARD</h1>
                            <X
                                className="cursor-pointer"
                                onClick={() => setOpen(false)}
                            />
                        </div>

                        <h3
                            className="cursor-pointer hover:bg-slate-700 p-2 text-center rounded"
                            onClick={() => {
                                navigate("/developer/dashboard/dead-letter-queue");
                                setOpen(false);
                            }}
                        >
                            DLQ Explorer
                        </h3>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <section className="flex-1 bg-slate-200 flex flex-col overflow-hidden">
                {/* Navbar */}
                <div className="bg-neutral-100 w-full p-2 flex items-center">
                    <Menu
                        className="lg:hidden cursor-pointer"
                        onClick={() => setOpen(true)}
                    />

                    <p className="ml-auto">A</p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </section>
        </div>
    );
};

export default DeveloperLayout;