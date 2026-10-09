export interface Movie {
  id: string | number
  title: string
  year: number
  thumbnail: string
  genres?: string[]
  cast?: string[]
  extract?: string
}

export interface YearGroup {
  year: number
  movies: Movie[]
}
