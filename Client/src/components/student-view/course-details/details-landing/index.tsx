import { Award, Book, Code, FileDown, Monitor, Video } from 'lucide-react'
import React from 'react'

const CourseDetailsLanding = () => {
    return (
        <div>
            <div className="flex mt-8">
                <div className="flex-1">
                    {/* Placeholder for "What you'll learn" and other content */}
                    <div className="p-8 border rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
                            <li>✔️ Build 16 web development projects for your portfolio...</li>
                            <li>✔️ Learn the latest technologies, including JavaScript...</li>
                            <li>✔️ After the course you will be able to build ANY website...</li>
                            <li>✔️ Build fully-fledged websites and web apps...</li>
                            <li>✔️ Build fully-fledged websites and web apps...</li>
                            <li>✔️ Build fully-fledged websites and web apps...</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-8 pl-1">
                <h3 className="text-2xl font-bold mb-4">This course includes:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Video size={20} />
                        <span>61 hours on-demand video</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FileDown size={20} />
                        <span>194 downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Code size={20} />
                        <span>7 coding exercises</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Monitor size={20} />
                        <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Book size={20} />
                        <span>66 articles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Award size={20} />
                        <span>Certificate of completion</span>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default CourseDetailsLanding
