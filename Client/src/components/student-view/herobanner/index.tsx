import { Card } from "@/components/ui/card"

const StudentViewHeroBanner = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 overflow-hidden h-[630px]">

      {/* content here   */}
      <div className="w-full h-full flex p-10 flex-wrap">

        <div className="w-1/2 p-15 flex flex-col gap-5">
          <div>
            <p className="text-white text-6xl font-bold">Learn From Your</p>
            <span className="text-white text-6xl font-bold ">Favourite</span>
          </div>
          <p className="text-lg md:text-xl text-indigo-100 max-w-lg ">Unlock your true potential with thousands of experts-led courses.start learning today and transfor your career</p>
        </div>
        <div className="w-1/2  p-10 pb-30">
          <Card className="h-full bg-white"></Card>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 160">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,128L80,112C160,96,320,64,480,64C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}

export default StudentViewHeroBanner
