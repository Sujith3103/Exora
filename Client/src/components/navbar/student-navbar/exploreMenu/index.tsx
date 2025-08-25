import type { CourseCategory } from "@/store/courseSlice";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export const categories: CourseCategory[] = [
  "web-development",
  "data-science",
  "machine-learning",
  "artificial-intelligence",
  "cloud-computing",
  "cyber-security",
  "mobile-development",
  "game-development",
  "software-engineering",
];

export default function ExploreMenu() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150); // short delay for smoothness
  };

  return (
    <div
      className="relative hidden md:block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p className="font-semibold cursor-pointer select-none">Explore</p>

      <div
        className={`absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-200 ease-out
        ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="flex flex-col">
          {categories.map((category) => (
            <Link
              key={category}
             to={`/courses?category=${category}&page=${1}&limit=${10}`}
              className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
            >
              {category.replace("-", " ")}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
