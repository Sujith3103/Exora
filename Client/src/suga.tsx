const Suga = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex bg-gray-900 text-white py-3 px-15">
                <span className="font-semibold text-lg">InternSite</span>
                <div className="ml-auto space-x-6">
                    <span className="text-gray-400 hover:text-white cursor-pointer">Home</span>
                    <span className="cursor-pointer">About</span>
                    <span className="text-gray-400 hover:text-white cursor-pointer">Contact</span>
                </div>
            </div>

            <div className="flex space-x-2 px-15 mt-5 text-sm">
                <span className="text-blue-600 underline cursor-pointer">Home</span>
                <span>/</span>
                <span>About</span>
            </div>

            <div className="px-15 mt-5 space-y-2">
                <h1 className="text-3xl font-semibold">About Our Internship Program</h1>
                <p className="text-gray-500">
                    This page demonstrates how Bootstrap components can be used to build structured and responsive layouts.
                </p>
            </div>

            <div className="px-15 mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 space-y-2">
                    <p className="font-semibold">Frontend Focus</p>
                    <p className="text-gray-600">
                        Interns learn HTML, Bootstrap, responsiveness and UI components.
                    </p>
                </div>
                <div className="border rounded-md p-4 space-y-2">
                    <p className="font-semibold">Hands-on Learning</p>
                    <p className="text-gray-600">
                        Practical approach with real UI layouts and components.
                    </p>
                </div>
            </div>

            <div className="px-15 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <h2 className="mb-4 text-xl font-semibold">What Interns Will Practice</h2>
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-900 text-white">
                                    <tr>
                                        <th className="px-4 py-3 border-r border-gray-700">Topic</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-300">
                                        <td className="px-4 py-4 border-r border-gray-300">Bootstrap Grid</td>
                                        <td className="px-4 py-4">
                                            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <td className="px-4 py-4 border-r border-gray-300">Components</td>
                                        <td className="px-4 py-4">
                                            <span className="bg-yellow-400 text-white text-xs px-3 py-1 rounded-full">
                                                In Progress
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-4 border-r border-gray-300">Responsive Layout</td>
                                        <td className="px-4 py-4">
                                            <span className="bg-sky-400 text-white text-xs px-3 py-1 rounded-full">
                                                Upcoming
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-4 text-xl font-semibold">Learning Progress</h2>
                        <div className="mb-5">
                            <p className="mb-2 font-medium">HTML</p>
                            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-700 text-white text-xs flex items-center justify-center" style={{ width: "80%" }}>
                                    80%
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="mb-2 font-medium">Bootstrap</p>
                            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-sky-400 text-white text-xs flex items-center justify-center" style={{ width: "60%" }}>
                                    60%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-15 mt-10">
                <div className="flex">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">Mission</button>
                    <button className="text-blue-600 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md cursor-pointer ml-1">Vision</button>
                </div>
                <p className="mt-4 text-gray-700">
                    Our mission is to train interns with practical frontend skills.
                </p>
            </div>

            <div className="px-15 mt-10 mb-10">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="border rounded-md">
                    <div className="bg-blue-100 px-4 py-3 font-medium flex justify-between items-center">
                        <span>Do we write custom CSS?</span>
                        <span>⌄</span>
                    </div>
                    <div className="px-4 py-3 text-gray-700">
                        No. We use only Bootstrap utility classes.
                    </div>
                </div>
            </div>

            <footer className="mt-auto bg-gray-900 text-gray-300 px-15 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="font-semibold text-white">InternSite</p>
                        <p className="text-sm mt-1">Bootstrap learning platform.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white mb-2">Pages</p>
                        <p>Home</p>
                        <p>About</p>
                        <p>Contact</p>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                            Intern Training
                        </span>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
                    © 2025 InternSite
                </div>
            </footer>
        </div>
    )
}

export default Suga
