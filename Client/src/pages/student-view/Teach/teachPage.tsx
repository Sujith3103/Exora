import StudentNavbar from '@/components/navbar/student-navbar'
import teachingImg1 from '../../../assets-static/Teaching-cuate.png'
import teachingImg2 from '../../../assets-static/value-prop-get-rewarded-2x-v3.webp'
import teachingImg3 from '../../../assets-static/value-prop-inspire-2x-v3.webp'
import teachingImg4 from '../../../assets-static/value-prop-teach-2x-v3.webp'
import planYourCurriculumn_img from '../../../assets-static/plan-your-curriculum-2x-v3.webp'
import launchYourCourse_img from '../../../assets-static/launch-your-course-2x-v3.webp'
import recordYourVideo_img from '../../../assets-static/record-your-video-2x-v3.webp'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import server from '@/api/axiosinstance'
import { useNavigate } from 'react-router-dom'

const TeachPage = () => {

    const [activeTab, setActiveTab] = useState(0)

    const navigate = useNavigate()

    const tabs = [
        {
            title: "Plan your curriculum",
            image: planYourCurriculumn_img,
            content: (
                <>
                    <p>
                        You start with your passion and knowledge. Then choose a promising
                        topic with the help of our Marketplace Insights tool.
                    </p>
                    <p>
                        The way that you teach — what you bring to it — is up to you.
                    </p>

                    <h4 className="font-semibold text-lg mt-6">How we help you</h4>
                    <p>
                        We offer plenty of resources on how to create your first course.
                        Our instructor dashboard and curriculum pages help keep you organized.
                    </p>
                </>
            ),
        },
        {
            title: "Record your video",
            image: recordYourVideo_img,
            content: (
                <>
                    <p>
                        Use basic tools like a smartphone or DSLR camera. Add a good
                        microphone and you’re ready to start.
                    </p>
                    <p>
                        If you don’t like being on camera, just capture your screen.
                        We recommend two hours or more of video for a paid course.
                    </p>

                    <h4 className="font-semibold text-lg mt-6">How we help you</h4>
                    <p>
                        Our support team is available to help throughout the process
                        and provide feedback on test videos.
                    </p>
                </>
            ),
        },
        {
            title: "Launch your course",
            image: launchYourCourse_img,
            content: (
                <>
                    <p>
                        Gather your first ratings and reviews by promoting your course
                        through social media and professional networks.
                    </p>
                    <p>
                        Your course will be discoverable in our marketplace
                        where you earn revenue from each paid enrollment.
                    </p>

                    <h4 className="font-semibold text-lg mt-6">How we help you</h4>
                    <p>
                        Our custom coupon tool lets you offer enrollment incentives
                        while global promotions drive traffic to courses.
                    </p>
                </>
            ),
        },
    ]


    const handleInstructorRegister = async () => {
        const res = await server.patch('/user/role')
        console.log("Res: ",res)
        if (res) {
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            navigate('/')
        }
    }

    return (
        <div>   
            <StudentNavbar />

            <section className="w-full bg-[#EEEEEE] min-h-[80vh] flex items-center">
                <div className="max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row items-center px-12">

                    {/* LEFT CONTENT */}
                    <div className="md:w-1/2 md:space-y-6 space-y-3 md:mt-0 mt-6">

                        <h1 className="md:text-6xl text-2xl font-bold leading-tight text-gray-900">
                            Come teach<br className="hidden md:block" />                            with us
                        </h1>

                        <p className="text-lg text-gray-600 max-w-md">
                            Become an instructor and change lives —
                            <span className="font-medium text-gray-800"> including your own.</span>
                        </p>

                        <div className="pt-4">
                            <Button className="px-[30%] md:mb-0 mb-10 py-6 text-lg bg-violet-700 hover:bg-violet-800 transition-all duration-200 shadow-lg shadow-violet-700/20 rounded-md"
                                onClick={handleInstructorRegister}
                            >
                                Get Started
                            </Button>
                        </div>

                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="md:w-1/2  flex justify-center">
                        <img
                            src={teachingImg1}
                            alt="Instructor"
                            className="w-full max-w-[500px] h-auto object-contain drop-shadow-2xl"
                        />
                    </div>

                </div>
            </section>

            <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto text-center">

                    <h1 className="text-3xl md:text-5xl font-semibold mb-16">
                        So many reasons to start
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Card 1 */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <img src={teachingImg4} alt="" className="w-20 md:w-28" />
                            <h3 className="font-semibold text-xl">Teach your way</h3>
                            <p className="text-gray-600 max-w-xs">
                                Publish the course you want, in the way you want,
                                and always have control of your own content.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <img src={teachingImg3} alt="" className="w-20 md:w-28" />
                            <h3 className="font-semibold text-xl">Inspire Learners</h3>
                            <p className="text-gray-600 max-w-xs">
                                Teach what you know and help learners explore their interests,
                                gain new skills, and advance their careers.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <img src={teachingImg2} alt="" className="w-20 md:w-28" />
                            <h3 className="font-semibold text-xl">Get rewarded</h3>
                            <p className="text-gray-600 max-w-xs">
                                Expand your professional network, build your expertise,
                                and earn money on each paid enrollment.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            <section className="bg-gradient-to-r from-violet-700 to-purple-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 text-center">

                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-5xl font-bold">80M</h2>
                            <p className="text-sm md:text-base text-white/80">Students</p>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-5xl font-bold">75+</h2>
                            <p className="text-sm md:text-base text-white/80">Languages</p>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-5xl font-bold">1.1B</h2>
                            <p className="text-sm md:text-base text-white/80">Enrollments</p>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-5xl font-bold">180+</h2>
                            <p className="text-sm md:text-base text-white/80">Countries</p>
                        </div>

                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <h2 className="text-3xl md:text-5xl font-bold">17,200+</h2>
                            <p className="text-sm md:text-base text-white/80">
                                Enterprise customers
                            </p>
                        </div>

                    </div>

                </div>
            </section>
            <section className="bg-[#f7f9fa] py-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Heading */}
                    <h2 className="text-3xl md:text-5xl font-semibold text-center mb-12">
                        How to begin
                    </h2>

                    {/* Tabs */}
                    <div className="flex justify-center border-b border-gray-300 mb-16 space-x-8">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`pb-4 text-lg transition-all duration-200 ${activeTab === index
                                    ? "border-b-2 border-black font-semibold text-black"
                                    : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col md:flex-row items-center gap-12">

                        {/* Left Text */}
                        <div className="md:w-1/2 space-y-4 text-gray-700 leading-relaxed ">
                            {tabs[activeTab].content}
                        </div>

                        {/* Right Image Placeholder */}
                        <div className="md:w-1/2 flex justify-center">
                            <div className="w-[300px] h-[350px]  rounded-xl flex items-center justify-center">
                                <img
                                    src={tabs[activeTab].image}
                                    alt=""
                                    className="w-full max-w-md object-contain transition-all duration-300"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className='h-full'>
                <div className='bg-[#EEEEEE] w-full h-[35vh] flex flex-col items-center p-10 gap-7'>
                    <p className='text-5xl font-semibold'>Become an instructor today</p>
                    <p className='text-2xl font-normal'>Join one of the world’s largest online learning <br /> marketplaces.</p>
                    <Button className='px-30 bg-violet-700' onClick={handleInstructorRegister}
                    >Get Started</Button>
                </div>
            </section>
        </div>
    )
}

export default TeachPage
