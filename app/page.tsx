'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Movie, YearGroup } from '@/lib/types'
import { MovieCard } from '@/components/MovieCard'
import { MovieModal } from '@/components/MovieModal'

const INITIAL_LIMIT = 120
const PAGE_SIZE = 18 // 6 cols × 3 rows

export default function Home() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [results, setResults] = useState<Movie[]>([])
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT)
  const [browse, setBrowse] = useState<YearGroup[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    fetch('/api/browse').then((r) => r.json()).then(setBrowse)
    fetch('/api/genres').then((r) => r.json()).then(setGenres)
  }, [])

  async function fetchResults(q: string, g: string) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (g) params.set('genre', g)
    const res = await fetch(`/api/search?${params}`)
    const data = await res.json()
    setResults(data)
    setVisibleCount(INITIAL_LIMIT)
  }

  function handleQueryChange(q: string) {
    setQuery(q)
    fetchResults(q, genre)
  }

  function handleGenreSelect(g: string) {
    const next = g === genre ? '' : g
    setGenre(next)
    fetchResults(query, next)
  }

  const showResults = query || genre

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, results.length))
  }, [results.length])

  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '200px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Movie Search Engine</h1>

      <div className="sticky top-0 z-40 mx-5 px-5 py-3 flex justify-center gap-2">
        <input
          className="border-2 border-gray-300 focus:border-white-500 focus:outline-none px-5 py-3 rounded-2xl w-full max-w-xl text-lg shadow-sm focus:shadow-blue-50 focus:shadow-lg transition-all duration-300 placeholder-gray-400 bg-black"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder='Search movies...'
        />

        {/* Genre filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`inline-flex items-center gap-2 rounded-2xl border-gray-400 border-2 px-4 py-3 shadow-sm transition-all duration-300 text-sm font-medium cursor-pointer bg-black
              ${genre ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}
            title="Filter by genre"
          >
            <FontAwesomeIcon icon={faFilter} className="size-4" />
            {genre && <span className="max-w-24 truncate">{genre}</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Filter by genre</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {genre && (
              <>
                <DropdownMenuItem onClick={() => handleGenreSelect('')}>
                  Clear filter
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuRadioGroup value={genre} onValueChange={(g) => { setGenre(g); fetchResults(query, g) }}>
              {genres.map((g) => (
                <DropdownMenuRadioItem key={g} value={g}>
                  {g}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showResults ? (
        <>
          <div className="mt-5 grid grid-cols-6 gap-4">
            {results.slice(0, visibleCount).map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
            ))}
          </div>
          {visibleCount < results.length && (
            <div ref={sentinelRef} className="h-10" />
          )}
        </>
      ) : (
        <div className="mt-5">
          {browse.map((group) => (
            <div key={group.year} className="mb-8">
              <h2 className="text-xl font-bold mb-3">{group.year}</h2>
              <div className="grid grid-cols-6 gap-4">
                {group.movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} action={() => setSelectedMovie(null)} />
      )}
    </main>
  )
}
