'use client'

import { useState } from 'react'
import { Movie } from '@/lib/types'

export function MovieCard({ movie, onClick }: { movie: Movie; onClick: () => void }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div
      className="transition-transform duration-200 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={movie.thumbnail}
        alt="movie thumbnail"
        className="w-full rounded"
        onError={() => setVisible(false)}
      />
      <h3 className="font-semibold mt-2">{movie.title}</h3>
      <p className="text-sm text-gray-500">{movie.year}</p>
    </div>
  )
}
