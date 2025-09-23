
type HoverCardProps = {
    message:string
}

export default function HoverCard({message}:HoverCardProps) {
    return (
        <>
            <svg
                className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block"
                width="20"
                height="10"
                viewBox="0 0 20 10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <polygon
                    points="0,10 10,0 20,10"
                    fill="white"
                    stroke="#e5e7eb"  /* Tailwind's gray-200 */
                    strokeWidth="1"
                />
            </svg>


            {/* Tooltip content (only shows on hover) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] border-1 bg-white text-muted-foreground font-semibold text-xs rounded-md px-3 py-2 shadow-md w-max hidden group-hover:block max-w-[200px]">
                <span>{message}</span>
            </div>
        </>
    );
}
