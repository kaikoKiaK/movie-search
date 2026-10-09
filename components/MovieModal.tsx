'use client'

import { useEffect } from 'react'
import { Movie } from '@/lib/types'

export function MovieModal({ movie, action }: { movie: Movie; action: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') action()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [action])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs
      p-4"
      onClick={action}
    >
      <div
        className="relative bg-black rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={action}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-200 text-2xl font-bold leading-none cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex flex-col sm:flex-row gap-6 p-8">
          {movie.thumbnail && (
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full sm:w-56 rounded-lg object-cover self-start shrink-0"
            />
          )}
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-3xl font-bold text-white">{movie.title}</h2>
              <p className="text-gray-400 text-m mt-0.5">{movie.year}</p>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="bg-gray-800 text-gray-200 text-sm font-medium px-2.5 py-1 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h3 className="text-m font-semibold text-gray-300 mb-1">Cast</h3>
                <p className="text-m text-gray-400">{movie.cast.join(', ')}</p>
              </div>
            )}

            {movie.extract && (
              <div>
                <h3 className="text-m font-semibold text-gray-300 mb-1">About</h3>
                <p className="text-m text-gray-400 leading-relaxed">{movie.extract}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
