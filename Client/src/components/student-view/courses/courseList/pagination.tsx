import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const pageNumbers: (number | string)[] = []

  // Always show first page
  pageNumbers.push(1)

  // Left ellipsis
  if (currentPage > 3) pageNumbers.push("...")

  // Middle window (current ± 1)
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pageNumbers.push(i)
  }

  // Right ellipsis
  if (currentPage < totalPages - 2) pageNumbers.push("...")

  // Always show last page
  if (totalPages > 1) pageNumbers.push(totalPages)

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      {pageNumbers.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2">…</span>
        ) : (
          <Button
            key={i}
            variant={p === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(p as number)}
            className={cn(p === currentPage && "font-bold")}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
