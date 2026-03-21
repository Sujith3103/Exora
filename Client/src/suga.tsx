import { Smile } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const Suga = () => {
    const [text, setText] = useState("")
    const [showSecret, setShowSecret] = useState(false)

    const fullText = "Hiiiiiiiii Loooosuuuuuuuuuuuuuuuuuu 💖"

    // ✨ Typewriter effect
    useEffect(() => {
        let i = 0
        const interval = setInterval(() => {
            setText(fullText.slice(0, i))
            i++
            if (i > fullText.length) clearInterval(interval)
        }, 60)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">

            {/* 💖 Floating hearts */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-pink-300 text-xl"
                    initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
                    animate={{ y: "-10vh" }}
                    transition={{
                        duration: 6 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                >
                    💖
                </motion.div>
            ))}

            {/* 🌟 Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/60 backdrop-blur-2xl shadow-2xl rounded-3xl px-10 py-10 text-center border border-white/30"
            >

                {/* ✨ Typewriter Heading */}
                <h1 className="text-3xl font-semibold text-gray-800 flex items-center justify-center gap-2 min-h-[40px]">
                    {text}
                    <motion.span
                        animate={{ rotate: [0, 20, -10, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <Smile className="text-pink-500" />
                    </motion.span>
                </h1>

                <p className="mt-4 text-gray-600 text-sm">
                    Just felt like saying hiiii… nothing serious 👀
                </p>

                {/* 🎯 Button */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSecret(true)}
                    className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg hover:shadow-pink-300 transition"
                >
                    Click me 😌
                </motion.button>

                {/* 💌 Secret message */}
                {showSecret && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-gray-700 text-sm bg-white/50 p-4 rounded-xl"
                    >
                        okay fine… I just wanted to talk to you a little 😶
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default Suga